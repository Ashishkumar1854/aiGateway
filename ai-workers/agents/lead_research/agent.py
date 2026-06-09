"""
Lead Research Agent — AiGateway's first AI employee.

Workflow:
1. Receive research request (industry + location + count)
2. Scrape businesses from web
3. Score each lead
4. Create AgentTask (AWAITING_APPROVAL) for each lead
5. Return summary — human reviews in admin dashboard
"""

import asyncio
from typing import List, Dict
from agents.lead_research.scraper import search_businesses_web, search_businesses_mock
from shared.scorer import score_lead
from shared.backend_client import create_agent_task


async def run_lead_research(
    industry: str,
    location: str,
    count: int = 5,
    use_mock: bool = False,
) -> Dict:
    """
    Main entry point for Lead Research Agent.
    
    Args:
        industry: Target industry (e.g. "fitness", "restaurant")
        location: Target location (e.g. "Mumbai", "Delhi")
        count: Number of leads to find
        use_mock: Use mock data (for testing without internet)
    
    Returns:
        Summary dict with tasks_created count and leads found
    """
    print(f"🔍 Lead Research Agent starting...")
    print(f"   Industry: {industry}")
    print(f"   Location: {location}")
    print(f"   Count: {count}")
    print(f"   Mode: {'mock' if use_mock else 'live'}")

    # Step 1: Scrape businesses
    if use_mock:
        raw_leads = await search_businesses_mock(industry, location, count)
    else:
        raw_leads = await search_businesses_web(industry, location, count)

    if not raw_leads:
        print("⚠️  No leads found from scraping")
        return {
            "success": False,
            "message": "No leads found",
            "tasks_created": 0,
            "leads_found": 0,
        }

    print(f"✅ Found {len(raw_leads)} raw leads")

    # Step 2: Score each lead
    scored_leads = []
    for lead in raw_leads:
        score = score_lead(lead)
        lead["score"] = score
        scored_leads.append(lead)
        print(f"   📊 {lead['companyName']}: score={score}")

    # Sort by score — best leads first
    scored_leads.sort(key=lambda x: x["score"], reverse=True)

    # Step 3: Create AgentTask for each lead (AWAITING_APPROVAL)
    tasks_created = 0
    task_ids = []

    for lead in scored_leads:
        try:
            task_result = await create_agent_task(
                agent_type="LEAD_RESEARCH",
                input_data={
                    "lead": lead,
                    "industry": industry,
                    "location": location,
                    "scoreLabel": "high" if lead["score"] >= 70 else "medium" if lead["score"] >= 40 else "low",
                },
            )
            task_id = task_result.get("data", {}).get("id")
            if task_id:
                task_ids.append(task_id)
                tasks_created += 1
                print(f"   ✅ AgentTask created: {task_id} (AWAITING_APPROVAL)")
        except Exception as e:
            print(f"   ❌ Failed to create task for {lead['companyName']}: {e}")

    print(f"\n🎉 Lead Research complete!")
    print(f"   Tasks created (awaiting approval): {tasks_created}")
    print(f"   Go to admin dashboard → AI Agents → Tasks to review")

    return {
        "success": True,
        "message": f"Found {len(scored_leads)} leads. {tasks_created} tasks created — awaiting human approval.",
        "tasks_created": tasks_created,
        "leads_found": len(scored_leads),
        "task_ids": task_ids,
        "top_leads": [
            {
                "companyName": l["companyName"],
                "score": l["score"],
                "industry": l.get("industry"),
                "location": l.get("location"),
            }
            for l in scored_leads[:3]
        ],
    }


async def approve_and_create_lead(task_id: str, lead_data: dict) -> Dict:
    """
    Called when admin approves a task.
    Creates the actual lead in CRM.
    This is called by backend webhook after approval.
    """
    from shared.backend_client import create_lead

    try:
        lead_result = await create_lead({
            "companyName": lead_data.get("companyName", "Unknown"),
            "contactName": lead_data.get("contactName"),
            "email": lead_data.get("email"),
            "phone": lead_data.get("phone"),
            "website": lead_data.get("website"),
            "industry": lead_data.get("industry"),
            "location": lead_data.get("location"),
            "source": "lead_research_agent",
            "notes": lead_data.get("notes"),
            "score": lead_data.get("score", 0),
            "status": "COLD",
        })
        return {"success": True, "lead": lead_result.get("data")}
    except Exception as e:
        return {"success": False, "error": str(e)}
