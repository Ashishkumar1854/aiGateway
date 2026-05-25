"""
AiGateway — AI Workers Service
Python 3.11 + FastAPI

Internal-only service. Never exposed to the public internet.
Backend calls this via Docker internal network: http://ai-workers:8000

Phase 0: Scaffold only
Phase 10+: Full agent implementation
"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse
import uvicorn
import os

app = FastAPI(
    title="AiGateway AI Workers",
    description="Internal AI agent orchestration service",
    version="1.0.0",
    # Disable docs in production
    docs_url="/docs" if os.getenv("ENV", "development") == "development" else None,
    redoc_url=None,
)


@app.get("/health")
async def health_check():
    """Health check endpoint — used by Docker and backend."""
    return JSONResponse(
        content={
            "status": "ok",
            "service": "aigw-ai-workers",
            "version": "1.0.0",
            "env": os.getenv("ENV", "development"),
        }
    )


@app.get("/agents")
async def list_agents():
    """List available AI agents. Full implementation Phase 10."""
    return {
        "agents": [
            {"name": "lead_research", "status": "not_implemented", "phase": 10},
            {"name": "email_outreach", "status": "not_implemented", "phase": 11},
            {"name": "linkedin", "status": "not_implemented", "phase": 11},
            {"name": "meeting", "status": "not_implemented", "phase": 12},
        ]
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENV", "development") == "development",
    )
