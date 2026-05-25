"""
CRM HTTP Client — calls backend API from Python agents
Scaffold only — Phase 10+
"""
import httpx
import os

BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:5000")
AI_WORKERS_SECRET = os.getenv("AI_WORKERS_SECRET", "")

async def create_lead(lead_data: dict) -> dict:
    """POST /api/v1/crm/leads"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BACKEND_URL}/api/v1/crm/leads",
            json=lead_data,
            headers={"x-ai-secret": AI_WORKERS_SECRET},
        )
        response.raise_for_status()
        return response.json()
