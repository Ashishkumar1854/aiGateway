"""
Meeting Agent — AiGateway's third AI employee.

Workflow:
1. Receive lead data + conversation history
2. Gemini analyzes interest level
3. Generate 3 meeting slot proposals
4. Create AgentTask (AWAITING_APPROVAL)
5. Admin reviews and approves
6. Meeting created in CRM, lead status updated
"""

from .analyzer import analyze_lead_interest
from .slot_generator import generate_meeting_slots, format_slots_for_message
from shared.backend_client import create_agent_task
from shared.gemini_client import generate_text


async def generate_invite_message(lead: dict, analysis: dict, slots: list) -> str:
    """Generate personalized meeting invite message using Gemini."""
    slots_text = format_slots_for_message(slots)

    prompt = f"""
Write a short, friendly meeting invite message for this lead.

Lead: {lead.get('contactName', 'there')} from {lead.get('companyName')}
Industry: {lead.get('industry', 'business')}
Analysis: {analysis.get('summary', '')}
Meeting title: {analysis.get('meeting_title', 'Discovery Call')}
Duration: {analysis.get('duration_minutes', 30)} minutes

Available slots:
{slots_text}

Requirements:
- 2-3 sentences maximum
- Friendly and professional tone
- Reference their specific industry
- Ask them to pick one of the slots
- Do NOT sound like a template

Return ONLY the message text, nothing else.
"""

    mock_msg = (
        f"Hi {lead.get('contactName', 'there')}, "
        f"following up on our conversation about automating {lead.get('companyName', 'your business')}. "
        f"I'd love to show you a quick demo — would any of these slots work for a {analysis.get('duration_minutes', 30)}-min call?\n\n"
        f"{slots_text}\n\nLet me know what works best!"
    )

    return await generate_text(prompt, mock_response=mock_msg)


async def run_meeting_agent(lead_id: str, lead_data: dict, conversations: list = None) -> dict:
    """
    Main entry point for Meeting Agent.

    Args:
        lead_id: Lead UUID
        lead_data: Lead dict from CRM
        conversations: List of conversation dicts (last 10)

    Returns:
        Summary dict with task created
    """
    print(f"📅 Meeting Agent starting for: {lead_data.get('companyName')}")

    conversations = conversations or []

    # Step 1: Analyze lead interest with Gemini
    print("   🤖 Analyzing lead interest...")
    analysis = await analyze_lead_interest(lead_data, conversations)
    print(f"   📊 Interest level: {analysis.get('interest_level')}")
    print(f"   💡 {analysis.get('summary')}")

    # Step 2: Generate meeting slots
    slots = generate_meeting_slots(count=3)
    print(f"   📅 Generated {len(slots)} meeting slots")

    # Step 3: Generate invite message
    print("   ✍️  Generating invite message...")
    invite_message = await generate_invite_message(lead_data, analysis, slots)

    # Step 4: Create AgentTask (AWAITING_APPROVAL)
    task_result = await create_agent_task(
        agent_type="MEETING",
        input_data={
            "lead": lead_data,
            "analysis": analysis,
            "proposed_slots": slots,
            "invite_message": invite_message,
            "meeting_title": analysis.get("meeting_title", f"Discovery Call — {lead_data.get('companyName')}"),
            "duration_minutes": analysis.get("duration_minutes", 30),
        },
        lead_id=lead_id,
    )

    task_id = task_result.get("data", {}).get("id")
    print(f"   ✅ AgentTask created: {task_id} (AWAITING_APPROVAL)")
    print(f"   👀 Admin must approve to book the meeting")

    return {
        "success": True,
        "message": "Meeting proposal created — awaiting admin approval",
        "task_id": task_id,
        "analysis": {
            "interest_level": analysis.get("interest_level"),
            "summary": analysis.get("summary"),
        },
        "slots_count": len(slots),
        "meeting_title": analysis.get("meeting_title"),
    }


async def execute_approved_meeting(task_id: str, input_data: dict) -> dict:
    """
    Called AFTER admin approves the meeting task.
    Creates meeting in CRM and updates lead status.
    """
    import httpx
    from shared.config import BACKEND_URL, AI_WORKERS_SECRET

    lead_data = input_data.get("lead", {})
    lead_id = lead_data.get("id") or input_data.get("lead_id") or lead_data.get("id")
    proposed_slots = input_data.get("proposed_slots", [])
    meeting_title = input_data.get("meeting_title", "Discovery Call")
    duration = input_data.get("duration_minutes", 30)
    invite_message = input_data.get("invite_message", "")

    # Use first proposed slot as scheduled time
    scheduled_at = None
    if proposed_slots:
        scheduled_at = proposed_slots[0].get("datetime")

    headers = {
        "Content-Type": "application/json",
        "x-ai-workers-secret": AI_WORKERS_SECRET,
    }

    results = {}

    async with httpx.AsyncClient() as client:
        # 1. Create meeting in CRM
        if lead_id and scheduled_at:
            try:
                meeting_res = await client.post(
                    f"{BACKEND_URL}/api/v1/crm/meetings",
                    json={
                        "leadId": lead_id,
                        "title": meeting_title,
                        "description": invite_message,
                        "scheduledAt": scheduled_at,
                        "duration": duration,
                        "notes": f"Booked by Meeting Agent. Interest: {input_data.get('analysis', {}).get('interest_level', 'MEDIUM')}",
                    },
                    headers=headers,
                    timeout=15,
                )
                results["meeting_created"] = meeting_res.status_code == 201
                print(f"   ✅ Meeting created in CRM: {meeting_title}")
            except Exception as e:
                print(f"   ⚠️  Could not create meeting: {e}")
                results["meeting_created"] = False

        # 2. Update lead stage to QUALIFIED if still COLD/WARM
        current_status = lead_data.get("status", "COLD")
        if current_status in ["COLD", "WARM"] and lead_id:
            try:
                await client.put(
                    f"{BACKEND_URL}/api/v1/crm/leads/{lead_id}/stage",
                    json={"status": "QUALIFIED"},
                    headers=headers,
                    timeout=10,
                )
                results["status_updated"] = True
                print(f"   ✅ Lead status updated to QUALIFIED")
            except Exception as e:
                print(f"   ⚠️  Could not update lead status: {e}")

        # 3. Log meeting conversation
        if lead_id:
            try:
                await client.post(
                    f"{BACKEND_URL}/api/v1/crm/conversations",
                    json={
                        "leadId": lead_id,
                        "channel": "meeting",
                        "direction": "outbound",
                        "content": f"Meeting booked by AI agent.\n\nTitle: {meeting_title}\nScheduled: {proposed_slots[0].get('label', 'TBD') if proposed_slots else 'TBD'}\n\nInvite sent:\n{invite_message}",
                    },
                    headers=headers,
                    timeout=10,
                )
                results["conversation_logged"] = True
                print(f"   ✅ Conversation logged in CRM")
            except Exception as e:
                print(f"   ⚠️  Could not log conversation: {e}")

    return {
        "success": True,
        "message": "Meeting booked and CRM updated",
        "results": results,
        "meeting_title": meeting_title,
        "scheduled_at": scheduled_at,
    }
