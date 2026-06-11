"""
LinkedIn Outreach Agent (Drafts only).
Generates a personalized LinkedIn connection note and a follow-up message draft using Gemini.
Saves it as an AgentTask (AWAITING_APPROVAL).
Once approved, logs the outreach message as a LinkedIn Conversation in the CRM.
"""

import json
from shared.gemini_client import generate_text
from shared.backend_client import get_lead, create_agent_task, add_conversation


async def run_linkedin_outreach(lead_id: str) -> dict:
    """
    Generate LinkedIn outreach drafts (connection request + follow-up) for a given lead,
    and create an AgentTask (AWAITING_APPROVAL).
    """
    print(f"💼 Running LinkedIn Outreach Agent for Lead ID: {lead_id}...")

    # 1. Fetch Lead Details from CRM
    lead_res = await get_lead(lead_id)
    lead = lead_res.get("data")
    if not lead:
        raise Exception(f"Lead not found for ID: {lead_id}")

    company_name = lead.get("companyName") or "Unknown Company"
    contact_name = lead.get("contactName") or "there"
    industry = lead.get("industry") or "Business"
    location = lead.get("location") or "India"
    website = lead.get("website") or ""
    notes = lead.get("notes") or ""

    # 2. Build Prompt incorporating Lead Context & History
    prompt = f"""You are an expert sales outreach assistant at AiGateway, an AI Workforce SaaS Platform. We provide AI employees to automate business operations.
Write a highly personalized, warm, and professional LinkedIn outreach for the following lead.

Lead Details:
- Company: {company_name}
- Contact Person: {contact_name}
- Industry: {industry}
- Location: {location}
- Website: {website}
- Additional Notes: {notes}

Rules:
1. Write a personalized LinkedIn connection request note (MUST BE strictly under 300 characters to fit LinkedIn's limit).
2. Write a slightly longer follow-up message to send once they accept, highlighting how AiGateway can help them automate operations.
3. Return the response strictly as a JSON object with 'connectionNote' and 'followUpMessage' keys. Do not include markdown formatting like ```json or ```.

Format:
{{
  "connectionNote": "Personalized connection request note (max 300 chars)",
  "followUpMessage": "Follow-up message content"
}}
"""

    # Add conversation history
    convs = lead.get("conversations", [])
    if convs:
        prompt += "\nPrevious CRM Conversation History:\n"
        for c in convs[:5]:
            direction = c.get("direction", "outbound")
            content = c.get("content", "")
            prompt += f"- [{direction}] {content}\n"

    # Add notes history
    notes_list = lead.get("leadNotes", [])
    if notes_list:
        prompt += "\nInternal CRM Lead Notes:\n"
        for n in notes_list[:5]:
            content = n.get("content", "")
            prompt += f"- {content}\n"

    # 3. Define fallback mock response in case Gemini API is missing or fails
    mock_resp = {
        "connectionNote": f"Hi {contact_name}, noticed your work at {company_name} in {location}. Would love to connect and share some thoughts on AI automation!",
        "followUpMessage": f"Thanks for connecting, {contact_name}!\n\nAt AiGateway, we help companies like {company_name} automate manual operations using AI employees. Let me know if you are open to a brief chat."
    }
    mock_response_str = json.dumps(mock_resp)

    # 4. Generate text using Gemini Client
    response = await generate_text(prompt, mock_response=mock_response_str)

    # 5. Parse Gemini response
    try:
        text = response.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()

        parsed = json.loads(text)
        connection_note = parsed.get("connectionNote", mock_resp["connectionNote"])
        follow_up = parsed.get("followUpMessage", mock_resp["followUpMessage"])
    except Exception as e:
        print(f"⚠️ Failed to parse Gemini response as JSON: {e}. Raw: {response}")
        connection_note = mock_resp["connectionNote"]
        follow_up = response if response else mock_resp["followUpMessage"]

    # 6. Create AgentTask AWAITING_APPROVAL in backend DB
    task_res = await create_agent_task(
        agent_type="LINKEDIN",
        input_data={
            "leadId": lead_id,
            "connectionNote": connection_note,
            "followUpMessage": follow_up,
            "companyName": company_name,
            "contactName": contact_name,
        },
        lead_id=lead_id
    )

    print(f"✅ LinkedIn outreach task created for lead {company_name}: Status AWAITING_APPROVAL")

    return {
        "success": True,
        "message": f"LinkedIn outreach draft generated for {company_name}. Task created awaiting approval.",
        "task": task_res.get("data"),
        "draft": {
            "connectionNote": connection_note,
            "followUpMessage": follow_up
        }
    }


async def execute_approved_linkedin(task_id: str, input_data: dict) -> dict:
    """
    Simulate approved LinkedIn task execution by logging connection request and message drafts to CRM conversation history.
    """
    lead_id = input_data.get("leadId")
    connection_note = input_data.get("connectionNote")
    follow_up = input_data.get("followUpMessage")

    # Log to CRM Conversation history (LinkedIn channel)
    conv_content = f"Connection Request Note:\n{connection_note}\n\nFollow-up Message:\n{follow_up}"
    conv_res = await add_conversation({
        "leadId": lead_id,
        "channel": "linkedin",
        "direction": "outbound",
        "content": f"[APPROVED LINKEDIN OUTREACH DRAFT]\n{conv_content}"
    })

    return {
        "success": True,
        "message": "LinkedIn draft outreach approved and logged to CRM",
        "conversation": conv_res.get("data")
    }
