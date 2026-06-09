"""
HTTP client for calling AiGateway backend APIs.
All agent actions go through backend — never direct DB writes.
"""

import httpx
from .config import BACKEND_URL, AI_WORKERS_SECRET

# Shared headers for all backend calls
def get_headers():
    return {
        "Content-Type": "application/json",
        "x-ai-workers-secret": AI_WORKERS_SECRET,
    }


async def create_agent_task(agent_type: str, input_data: dict, lead_id: str = None) -> dict:
    """
    Create an AgentTask in backend DB.
    Status will be AWAITING_APPROVAL — human must approve.
    """
    payload = {
        "agentType": agent_type,
        "input": input_data,
        "status": "AWAITING_APPROVAL",
    }
    if lead_id:
        payload["leadId"] = lead_id

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{BACKEND_URL}/api/v1/agents/tasks",
            json=payload,
            headers=get_headers(),
            timeout=30,
        )
        res.raise_for_status()
        return res.json()


async def create_lead(lead_data: dict) -> dict:
    """
    Create a lead in CRM via backend API.
    Only called AFTER human approves the AgentTask.
    """
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{BACKEND_URL}/api/v1/crm/leads",
            json=lead_data,
            headers=get_headers(),
            timeout=30,
        )
        res.raise_for_status()
        return res.json()


async def get_lead(lead_id: str) -> dict:
    """Get a lead by ID."""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{BACKEND_URL}/api/v1/crm/leads/{lead_id}",
            headers=get_headers(),
            timeout=15,
        )
        res.raise_for_status()
        return res.json()


async def health_check() -> bool:
    """Check if backend is reachable."""
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{BACKEND_URL}/health", timeout=5)
            return res.status_code == 200
    except Exception:
        return False
