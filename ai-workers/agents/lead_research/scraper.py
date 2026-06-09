"""
Web scraper for finding business leads.
Uses multiple strategies — no single point of failure.
"""

import asyncio
import httpx
from bs4 import BeautifulSoup
from typing import List, Dict


async def search_businesses_web(industry: str, location: str, count: int = 10) -> List[Dict]:
    """
    Search for businesses using DuckDuckGo web search.
    No API key required — uses public search.
    """
    query = f"{industry} businesses in {location} contact email"
    results = []

    try:
        # Use DuckDuckGo HTML search (no API key needed)
        url = f"https://html.duckduckgo.com/html/?q={query.replace(' ', '+')}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }

        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=headers, timeout=15, follow_redirects=True)
            soup = BeautifulSoup(res.text, "html.parser")

            # Extract search result snippets
            result_elements = soup.find_all("div", class_="result__body")[:count]

            for i, elem in enumerate(result_elements):
                title_elem = elem.find("a", class_="result__a")
                snippet_elem = elem.find("a", class_="result__snippet")
                url_elem = elem.find("span", class_="result__url")

                if not title_elem:
                    continue

                title = title_elem.get_text(strip=True)
                snippet = snippet_elem.get_text(strip=True) if snippet_elem else ""
                website = url_elem.get_text(strip=True) if url_elem else ""

                # Skip obviously irrelevant results
                skip_keywords = ["wikipedia", "youtube", "facebook", "instagram", "twitter", "linkedin"]
                if any(kw in website.lower() for kw in skip_keywords):
                    continue

                # Extract any email from snippet
                email = None
                import re
                email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                emails_found = re.findall(email_pattern, snippet)
                if emails_found:
                    email = emails_found[0]

                results.append({
                    "companyName": title[:100],
                    "website": website[:200] if website else None,
                    "email": email,
                    "notes": snippet[:300] if snippet else None,
                    "industry": industry,
                    "location": location,
                    "source": "lead_research_agent",
                })

    except Exception as e:
        print(f"Web search error: {e}")

    return results


async def search_businesses_mock(industry: str, location: str, count: int = 5) -> List[Dict]:
    """
    Mock scraper for testing when no internet available.
    Returns realistic-looking sample data.
    """
    mock_data = [
        {
            "companyName": f"{location} {industry.title()} Hub",
            "contactName": "Rahul Sharma",
            "email": f"info@{industry.lower().replace(' ', '')}hub.com",
            "phone": "+91 98765 43210",
            "website": f"https://{industry.lower().replace(' ', '')}hub.com",
            "industry": industry,
            "location": location,
            "notes": f"Leading {industry} business in {location} with strong online presence.",
            "source": "lead_research_agent",
            "rating": "4.2",
        },
        {
            "companyName": f"Premium {industry.title()} {location}",
            "contactName": "Priya Patel",
            "email": f"contact@premium{industry.lower().replace(' ', '')}.in",
            "phone": "+91 87654 32109",
            "website": f"https://premium{industry.lower().replace(' ', '')}.in",
            "industry": industry,
            "location": location,
            "notes": f"Premium {industry} services provider. Active on Instagram with 8k followers.",
            "source": "lead_research_agent",
            "rating": "4.5",
        },
        {
            "companyName": f"{industry.title()} Star {location}",
            "email": f"hello@{industry.lower().replace(' ', '')}star.com",
            "website": f"https://{industry.lower().replace(' ', '')}star.com",
            "industry": industry,
            "location": location,
            "notes": f"Growing {industry} startup in {location}.",
            "source": "lead_research_agent",
        },
    ]
    return mock_data[:count]
