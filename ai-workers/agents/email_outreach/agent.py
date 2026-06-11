"""
Email Outreach Agent.
Generates a personalized outreach email draft using Gemini and saves it as an AgentTask (AWAITING_APPROVAL).
Once approved, sends it via SendGrid and logs the outbound email as a Conversation in the CRM.
"""

import json
from shared.gemini_client import generate_text
from shared.email_sender import send_email
from shared.backend_client import get_lead, create_agent_task, add_conversation


async def run_email_outreach(lead_id: str) -> dict:
    """
    Generate email outreach draft for a given lead, and create an AgentTask (AWAITING_APPROVAL).
    """
    print(f"📧 Running Email Outreach Agent for Lead ID: {lead_id}...")

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
    prompt = f"""You are an expert sales outreach assistant at AiGateway, an AI Workforce SaaS Platform. We provide AI employees (like Lead Research, Email Outreach, and Meeting Agents) to automate business operations.
Write a highly personalized, warm, and professional cold outreach email to the following lead.

Lead Details:
- Company: {company_name}
- Contact Person: {contact_name}
- Industry: {industry}
- Location: {location}
- Website: {website}
- Additional Notes: {notes}
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

    prompt += """
Rules:
1. Write a compelling, concise email.
2. Highlight how AiGateway's AI employees can help automate their processes (e.g., automated scraping, personalized lead research, or automated outreach).
3. Do not use generic placeholders like [Your Name], [Company Name], or [Insert Date]. Sign the email off as "Ashish from AiGateway".
4. Address the contact person by name if possible.
5. Return the response strictly as a JSON object with 'subject' and 'body' keys. Do not include markdown formatting like ```json or ```.

Format:
{
  "subject": "Email Subject Line",
  "body": "Email Body text"
}
"""

    # 3. Define fallback mock response in case Gemini API is missing or fails
    mock_resp = {
        "subject": f"Personalized AI workforce solutions for {company_name}",
        "body": f"Hi {contact_name},\n\nI was looking at the great work {company_name} is doing in {industry} in {location}. At AiGateway, we help companies deploy dedicated AI employees to automate lead research, outreach, and booking.\n\nLet me know if you have 5 minutes this week for a quick chat.\n\nBest regards,\nAshish from AiGateway"
    }
    mock_response_str = json.dumps(mock_resp)

    # 4. Generate email text using Gemini Client
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
        subject = parsed.get("subject", mock_resp["subject"])
        body = parsed.get("body", mock_resp["body"])
    except Exception as e:
        print(f"⚠️ Failed to parse Gemini response as JSON: {e}. Raw: {response}")
        subject = mock_resp["subject"]
        body = response if response else mock_resp["body"]

    # 6. Create AgentTask AWAITING_APPROVAL in backend DB
    task_res = await create_agent_task(
        agent_type="EMAIL_OUTREACH",
        input_data={
            "leadId": lead_id,
            "subject": subject,
            "body": body,
            "email": lead.get("email"),
            "companyName": company_name,
            "contactName": contact_name,
        },
        lead_id=lead_id
    )

    print(f"✅ Email outreach task created for lead {company_name}: Status AWAITING_APPROVAL")

    return {
        "success": True,
        "message": f"Email outreach draft generated for {company_name}. Task created awaiting approval.",
        "task": task_res.get("data"),
        "draft": {
            "subject": subject,
            "body": body
        }
    }


async def execute_approved_outreach(task_id: str, input_data: dict) -> dict:
    """
    Send the drafted outreach email using SendGrid and log to CRM conversation.
    Called when admin approves the task.
    """
    lead_id = input_data.get("leadId")
    subject = input_data.get("subject")
    body = input_data.get("body")
    email = input_data.get("email")
    contact_name = input_data.get("contactName") or "there"
    company_name = input_data.get("companyName") or "Unknown Company"

    if not email:
        raise Exception("Lead email not provided in task input data")

    # Send Email via SendGrid
    send_res = send_email(
        to_email=email,
        to_name=contact_name,
        subject=subject,
        body=body
    )

    if not send_res.get("success"):
        raise Exception(f"Failed to send email: {send_res.get('error', 'Unknown error')}")

    # Log to CRM Conversation
    conv_content = f"Subject: {subject}\n\n{body}"
    if send_res.get("mock"):
        conv_content = f"[MOCK SEND]\n" + conv_content

    conv_res = await add_conversation({
        "leadId": lead_id,
        "channel": "email",
        "direction": "outbound",
        "content": conv_content
    })

    return {
        "success": True,
        "message": "Email sent and logged successfully",
        "send_result": send_res,
        "conversation": conv_res.get("data")
    }
