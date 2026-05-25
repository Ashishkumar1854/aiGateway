from fastapi import FastAPI
from datetime import datetime

app = FastAPI(
    title="AiGateway AI Workers",
    description="Internal AI agent service",
    version="0.1.0"
)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "aigw-ai-workers",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/")
def root():
    return {
        "message": "AiGateway AI Workers — Phase 1",
        "agents": [
            "lead_research",
            "email_outreach",
            "linkedin",
            "meeting"
        ]
    }
