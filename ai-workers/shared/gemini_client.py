"""
Google Gemini AI client.
Used for email generation, lead analysis, and other AI tasks.
"""

import asyncio
import google.generativeai as genai
import google.api_core.exceptions
from .config import GEMINI_API_KEY

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("⚠️  GEMINI_API_KEY not set — AI features will use mock responses")


def get_model():
    """Get Gemini Flash model — fastest and cheapest."""
    return genai.GenerativeModel("gemini-1.5-flash")


async def generate_text(prompt: str, mock_response: str = None) -> str:
    """
    Generate text using Gemini.
    Falls back to mock_response if API key not set.
    Includes retry logic with exponential backoff for 429 rate limit exceptions.
    """
    if not GEMINI_API_KEY:
        print("⚠️  Using mock AI response (no GEMINI_API_KEY)")
        return mock_response or "Mock AI response — set GEMINI_API_KEY for real responses"

    max_retries = 5
    delay = 2.0

    for attempt in range(max_retries):
        try:
            model = get_model()
            # Wrap the blocking generate_content call in asyncio.to_thread if on Python 3.9+
            # since uvicorn is async and we don't want to block the thread loop.
            response = await asyncio.to_thread(model.generate_content, prompt)
            return response.text.strip()
        except google.api_core.exceptions.ResourceExhausted as e:
            print(f"⚠️  Gemini API quota exhausted (429). Retrying in {delay}s... (Attempt {attempt + 1}/{max_retries})")
            await asyncio.sleep(delay)
            delay *= 2
        except Exception as e:
            err_msg = str(e)
            if "429" in err_msg or "ResourceExhausted" in err_msg or "quota" in err_msg.lower():
                print(f"⚠️  Gemini rate limit detected: {e}. Retrying in {delay}s... (Attempt {attempt + 1}/{max_retries})")
                await asyncio.sleep(delay)
                delay *= 2
            else:
                print(f"❌ Gemini API error: {e}")
                if mock_response:
                    return mock_response
                raise

    print("❌ All Gemini API retries exhausted due to rate limits.")
    if mock_response:
        return mock_response
    raise Exception("Gemini API Rate Limit Exhausted")
