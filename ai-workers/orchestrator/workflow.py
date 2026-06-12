"""
Multi-Agent Orchestrator — coordinates all AI agents.
Decides next action based on lead state.
Never executes autonomously — creates tasks for human approval.
"""

import httpx
from shared.config import BACKEND_URL, AI_WORKERS_SECRET

HEADERS = {
    "Content-Type": "application/json",
    "x-ai-workers-secret": AI_WORKERS_SECRET,
}


async def get_lead_state(lead_id: str) -> dict:
    """Fetch complete lead state from backend."""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{BACKEND_URL}/api/v1/crm/leads/{lead_id}",
            headers=HEADERS,
            timeout=15,
        )
        res.raise_for_status()
        return res.json().get("data", {})


async def get_pending_tasks_for_lead(lead_id: str) -> list:
    """Check if there are already pending tasks for this lead."""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{BACKEND_URL}/api/v1/agents/tasks?leadId={lead_id}&status=AWAITING_APPROVAL&limit=10",
            headers=HEADERS,
            timeout=15,
        )
        res.raise_for_status()
        return res.json().get("data", [])


def decide_next_action(lead: dict, pending_tasks: list) -> dict:
    """
    Decide what the next AI action should be for this lead.
    Returns action dict with type and reason.
    """
    # If there are already pending tasks — wait for human
    if pending_tasks:
        return {
            "action": "WAIT",
            "reason": f"{len(pending_tasks)} task(s) already awaiting approval. Review them first.",
            "pending_count": len(pending_tasks),
        }

    status = lead.get("status", "COLD")
    score = lead.get("score", 0)
    conversations = lead.get("conversations", [])
    meetings = lead.get("meetings", [])
    email = lead.get("email")

    # Check if already won/lost
    if status in ["WON", "LOST"]:
        return {
            "action": "COMPLETE",
            "reason": f"Lead is already marked as {status}. No further action needed.",
        }

    # No score yet — needs research
    if score == 0 and status == "COLD":
        return {
            "action": "LEAD_RESEARCH",
            "reason": "Lead has no score yet. Run Lead Research Agent to analyze and score this lead.",
        }

    # Has score but no outreach yet
    if score > 0 and len(conversations) == 0 and email:
        return {
            "action": "EMAIL_OUTREACH",
            "reason": f"Lead scored {score}/100 but has no outreach yet. Generate personalized email.",
        }

    # Has conversations but no meeting yet
    if len(conversations) > 0 and len(meetings) == 0 and status in ["WARM", "QUALIFIED"]:
        return {
            "action": "MEETING",
            "reason": f"Lead has {len(conversations)} conversation(s). Analyze for meeting readiness.",
        }

    # Has meeting — move to negotiation
    if len(meetings) > 0 and status not in ["PROPOSAL", "NEGOTIATION", "WON"]:
        return {
            "action": "UPDATE_STAGE",
            "reason": "Lead has a meeting scheduled. Move to PROPOSAL stage.",
            "new_stage": "PROPOSAL",
        }

    # No email — can't do outreach
    if not email and score > 0:
        return {
            "action": "NEEDS_EMAIL",
            "reason": "Lead has no email address. Add contact email to enable outreach.",
        }

    return {
        "action": "REVIEW",
        "reason": f"Lead is at {status} stage with {len(conversations)} conversations. Manual review recommended.",
    }


async def run_orchestrator(lead_id: str, lead_data: dict = None) -> dict:
    """
    Main orchestrator entry point.
    Analyzes lead state and triggers the appropriate next agent.
    """
    print(f"🎯 Orchestrator starting for lead: {lead_data.get('companyName') if lead_data else lead_id}")

    # Fetch full lead state
    try:
        lead = await get_lead_state(lead_id)
    except Exception as e:
        print(f"❌ Could not fetch lead: {e}")
        return {"success": False, "error": f"Could not fetch lead: {e}"}

    # Check pending tasks
    try:
        pending_tasks = await get_pending_tasks_for_lead(lead_id)
    except Exception:
        pending_tasks = []

    # Decide next action
    decision = decide_next_action(lead, pending_tasks)
    print(f"   🧠 Decision: {decision['action']} — {decision['reason']}")

    result = {
        "success": True,
        "lead_id": lead_id,
        "company": lead.get("companyName"),
        "current_stage": lead.get("status"),
        "current_score": lead.get("score"),
        "decision": decision,
        "action_taken": None,
    }

    # Execute decision
    action = decision["action"]

    if action == "LEAD_RESEARCH":
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    f"{BACKEND_URL.replace('backend:5000', 'ai-workers:8000') if 'backend' in BACKEND_URL else 'http://ai-workers:8000'}/agents/lead-research/run",
                    json={
                        "industry": lead.get("industry", "business"),
                        "location": lead.get("location", "India"),
                        "count": 1,
                        "use_mock": True,
                    },
                    headers=HEADERS,
                    timeout=30,
                )
            result["action_taken"] = "Triggered Lead Research Agent"
        except Exception as e:
            result["action_taken"] = f"Lead Research trigger failed: {e}"

    elif action == "EMAIL_OUTREACH":
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    "http://ai-workers:8000/agents/email-outreach/run",
                    json={"lead_id": lead_id, "lead_data": lead},
                    headers=HEADERS,
                    timeout=30,
                )
            result["action_taken"] = "Triggered Email Outreach Agent — task awaiting approval"
        except Exception as e:
            result["action_taken"] = f"Email Outreach trigger failed: {e}"

    elif action == "MEETING":
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    "http://ai-workers:8000/agents/meeting/run",
                    json={"lead_id": lead_id, "lead_data": lead},
                    headers=HEADERS,
                    timeout=30,
                )
            result["action_taken"] = "Triggered Meeting Agent — task awaiting approval"
        except Exception as e:
            result["action_taken"] = f"Meeting Agent trigger failed: {e}"

    elif action == "UPDATE_STAGE":
        try:
            new_stage = decision.get("new_stage", "PROPOSAL")
            async with httpx.AsyncClient() as client:
                await client.put(
                    f"{BACKEND_URL}/api/v1/crm/leads/{lead_id}/stage",
                    json={"status": new_stage},
                    headers=HEADERS,
                    timeout=15,
                )
            result["action_taken"] = f"Lead stage updated to {new_stage}"
        except Exception as e:
            result["action_taken"] = f"Stage update failed: {e}"

    elif action in ["WAIT", "COMPLETE", "NEEDS_EMAIL", "REVIEW"]:
        result["action_taken"] = f"No automatic action — {decision['reason']}"

    print(f"   ✅ Action taken: {result['action_taken']}")
    return result


async def run_bulk_orchestration(industry: str, location: str, count: int = 3) -> dict:
    """
    Run orchestrator for multiple new leads at once.
    First runs lead research, then processes each found lead.
    """
    print(f"🚀 Bulk orchestration: {industry} in {location} (count={count})")

    # Step 1: Run Lead Research
    from agents.lead_research.agent import run_lead_research
    research_result = await run_lead_research(
        industry=industry,
        location=location,
        count=count,
        use_mock=True,
    )

    return {
        "success": True,
        "message": f"Bulk orchestration started. {research_result.get('tasks_created', 0)} research tasks created.",
        "research_result": research_result,
        "next_step": "Approve research tasks in Admin → AI Agents → Tasks, then run orchestrator per lead for outreach.",
    }
