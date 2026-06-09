import os
from dotenv import load_dotenv

load_dotenv()

# Backend API
BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:5000")
AI_WORKERS_SECRET = os.getenv("AI_WORKERS_SECRET", "dev-ai-secret")

# Anthropic
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

# Database (direct connection for agent memory)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@postgres:5432/aigw")

# Redis
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")
