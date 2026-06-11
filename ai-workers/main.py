"""
AiGateway AI Workers — FastAPI Service
Internal service only — not exposed to internet.
Called by backend via Docker internal network.
"""

from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os

app = FastAPI(
    title="AiGateway AI Workers",
    description="Internal AI agent service — Lead Research, Outreach, Meeting",
    version="0.1.0"
)

AI_WORKERS_SECRET = os.getenv("AI_WORKERS_SECRET", "dev-ai-secret")


def verify_secret(x_ai_workers_secret: str = Header(None)):
    """Verify internal secret header."""
    if x_ai_workers_secret != AI_WORKERS_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ─── Health ───────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "aigw-ai-workers",
        "timestamp": datetime.utcnow().isoformat(),
        "agents": ["lead_research", "email_outreach", "meeting"],
    }


@app.get("/")
def root():
    return {
        "message": "AiGateway AI Workers",
        "version": "0.1.0",
        "endpoints": {
            "health": "/health",
            "lead_research": "/agents/lead-research/run",
            "approve_task": "/agents/tasks/{task_id}/execute",
        }
    }


# ─── Lead Research Agent ──────────────────────────────────

class LeadResearchRequest(BaseModel):
    industry: str
    location: str
    count: Optional[int] = 5
    use_mock: Optional[bool] = False


@app.post("/agents/lead-research/run")
async def run_lead_research(
    request: LeadResearchRequest,
    x_ai_workers_secret: str = Header(None),
):
    """
    Trigger Lead Research Agent.
    Finds businesses, scores them, creates AgentTasks (AWAITING_APPROVAL).
    Human must approve in admin dashboard before leads are created in CRM.
    """
    verify_secret(x_ai_workers_secret)

    try:
        from agents.lead_research.agent import run_lead_research
        result = await run_lead_research(
            industry=request.industry,
            location=request.location,
            count=request.count,
            use_mock=request.use_mock,
        )
        return {"success": True, "data": result}
    except Exception as e:
        print(f"Lead research error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── Task Execution (after human approval) ────────────────

class TaskExecuteRequest(BaseModel):
    task_id: str
    agent_type: str
    input_data: dict


@app.post("/agents/tasks/{task_id}/execute")
async def execute_approved_task(
    task_id: str,
    request: TaskExecuteRequest,
    x_ai_workers_secret: str = Header(None),
):
    """
    Execute an approved AgentTask.
    Called by backend AFTER human clicks Approve in admin dashboard.
    """
    verify_secret(x_ai_workers_secret)

    try:
        if request.agent_type == "LEAD_RESEARCH":
            from agents.lead_research.agent import approve_and_create_lead
            lead_data = request.input_data.get("lead", {})
            result = await approve_and_create_lead(task_id, lead_data)
            return {"success": True, "data": result}
        elif request.agent_type == "EMAIL_OUTREACH":
            from agents.email_outreach.agent import execute_approved_outreach
            result = await execute_approved_outreach(task_id, request.input_data)
            return {"success": True, "data": result}
        elif request.agent_type == "LINKEDIN":
            from agents.linkedin.agent import execute_approved_linkedin
            result = await execute_approved_linkedin(task_id, request.input_data)
            return {"success": True, "data": result}
        elif request.agent_type == "MEETING":
            from agents.meeting.agent import execute_approved_meeting
            result = await execute_approved_meeting(task_id, request.input_data)
            return {"success": True, "data": result}
        else:
            return {"success": False, "data": {"message": f"Agent {request.agent_type} not yet implemented"}}
    except Exception as e:
        print(f"Task execution error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── Email Outreach Agent ─────────────────────────────────

class EmailOutreachRequest(BaseModel):
    lead_id: str


@app.post("/agents/email-outreach/run")
async def run_email_outreach(
    request: EmailOutreachRequest,
    x_ai_workers_secret: str = Header(None),
):
    """
    Trigger Email Outreach Agent.
    Generates a personalized draft, creates an AgentTask (AWAITING_APPROVAL).
    """
    verify_secret(x_ai_workers_secret)

    try:
        from agents.email_outreach.agent import run_email_outreach as start_outreach
        result = await start_outreach(request.lead_id)
        return {"success": True, "data": result}
    except Exception as e:
        print(f"Email outreach error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── LinkedIn Outreach Agent ──────────────────────────────

class LinkedInOutreachRequest(BaseModel):
    lead_id: str


@app.post("/agents/linkedin-outreach/run")
async def run_linkedin_outreach(
    request: LinkedInOutreachRequest,
    x_ai_workers_secret: str = Header(None),
):
    """
    Trigger LinkedIn Outreach Agent.
    Generates a personalized connection request + message draft, creates an AgentTask (AWAITING_APPROVAL).
    """
    verify_secret(x_ai_workers_secret)

    try:
        from agents.linkedin.agent import run_linkedin_outreach as start_linkedin
        result = await start_linkedin(request.lead_id)
        return {"success": True, "data": result}
    except Exception as e:
        print(f"LinkedIn outreach error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── Meeting Agent ────────────────────────────────────────

class MeetingAgentRequest(BaseModel):
    lead_id: str
    lead_data: dict
    conversations: Optional[list] = []


@app.post("/agents/meeting/run")
async def run_meeting_agent(
    request: MeetingAgentRequest,
    x_ai_workers_secret: str = Header(None),
):
    """
    Trigger Meeting Agent for a specific lead.
    Analyzes interest, generates slots, creates AgentTask (AWAITING_APPROVAL).
    """
    verify_secret(x_ai_workers_secret)

    try:
        from agents.meeting.agent import run_meeting_agent as run_meeting
        result = await run_meeting(
            lead_id=request.lead_id,
            lead_data=request.lead_data,
            conversations=request.conversations,
        )
        return {"success": True, "data": result}
    except Exception as e:
        print(f"Meeting agent error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


