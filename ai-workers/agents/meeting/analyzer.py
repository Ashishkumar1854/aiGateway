"""
Conversation analyzer — uses Gemini to detect lead interest
and qualification signals from conversation history.
"""

from shared.gemini_client import generate_text
import json


def build_analysis_prompt(lead: dict, conversations: list) -> str:
    """Build Gemini prompt to analyze lead interest."""
    conv_text = ""
    for c in conversations[-10:]:  # last 10 conversations
        direction = "→ We sent" if c.get("direction") == "outbound" else "← They replied"
        conv_text += f"\n[{c.get('channel', 'unknown')}] {direction}: {c.get('content', '')[:300]}\n"

    if not conv_text:
        conv_text = "No conversations yet."

    return f"""
You are an expert sales analyst for AiGateway, an AI automation company.

Analyze this lead's conversation history and determine:
1. Interest level (HIGH / MEDIUM / LOW / NONE)
2. Key signals you noticed (what made you decide this)
3. Best approach for booking a meeting
4. Suggested meeting title
5. Suggested meeting duration (15, 30, or 45 minutes)

Lead Information:
- Company: {lead.get('companyName', 'Unknown')}
- Contact: {lead.get('contactName', 'Unknown')}
- Industry: {lead.get('industry', 'Unknown')}
- Current Stage: {lead.get('status', 'COLD')}
- Score: {lead.get('score', 0)}/100

Conversation History:
{conv_text}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{{
  "interest_level": "HIGH",
  "signals": ["they asked about pricing", "mentioned specific pain point"],
  "approach": "Direct ask for 30-min discovery call",
  "meeting_title": "AiGateway Demo — Company Name",
  "duration_minutes": 30,
  "summary": "One sentence summary of why this lead is worth meeting"
}}
"""


async def analyze_lead_interest(lead: dict, conversations: list) -> dict:
    """
    Use Gemini to analyze lead interest from conversations.
    Returns analysis dict.
    """
    prompt = build_analysis_prompt(lead, conversations)

    mock_response = json.dumps({
        "interest_level": "MEDIUM",
        "signals": ["Lead has been contacted", "No negative response"],
        "approach": "Send friendly discovery call invite",
        "meeting_title": f"Discovery Call — {lead.get('companyName', 'Lead')}",
        "duration_minutes": 30,
        "summary": f"Mock analysis for {lead.get('companyName')} — set GEMINI_API_KEY for real analysis"
    })

    raw = await generate_text(prompt, mock_response=mock_response)

    try:
        # Clean response — remove markdown if present
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            # Remove ```json or ``` and matching closing triple-backticks
            start_idx = 1 if lines[0].strip().startswith("```") else 0
            end_idx = -1 if lines[-1].strip() == "```" else len(lines)
            cleaned = "\n".join(lines[start_idx:end_idx])
        return json.loads(cleaned.strip())
    except Exception as e:
        print(f"⚠️  Could not parse Gemini analysis: {e}")
        return {
            "interest_level": "MEDIUM",
            "signals": ["Analysis parsing failed — using defaults"],
            "approach": "Standard discovery call",
            "meeting_title": f"Discovery Call — {lead.get('companyName', 'Lead')}",
            "duration_minutes": 30,
            "summary": "Default analysis used"
        }
