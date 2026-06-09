"""
Lead scoring logic — 0 to 100.
Higher score = better fit for AiGateway services.
"""


def score_lead(company_data: dict) -> int:
    """
    Score a lead based on available data.
    Returns integer 0-100.
    """
    score = 0

    # Has email contact (+20)
    if company_data.get("email"):
        score += 20

    # Has phone (+10)
    if company_data.get("phone"):
        score += 10

    # Has website (+15)
    if company_data.get("website"):
        score += 15

    # Industry fit — these industries need automation most (+20)
    high_value_industries = [
        "fitness", "gym", "restaurant", "cafe", "food",
        "retail", "salon", "beauty", "real estate", "education",
        "coaching", "ecommerce", "clothing", "fashion"
    ]
    industry = (company_data.get("industry") or "").lower()
    name = (company_data.get("companyName") or "").lower()
    combined = industry + " " + name

    if any(kw in combined for kw in high_value_industries):
        score += 20

    # Has reviews / social presence (+15)
    if company_data.get("rating") and float(company_data.get("rating", 0)) > 3.5:
        score += 15

    # Has description/notes (means scraped well) (+10)
    if company_data.get("notes") and len(company_data["notes"]) > 20:
        score += 10

    return min(score, 100)


def get_score_label(score: int) -> str:
    if score >= 80:
        return "high"
    elif score >= 60:
        return "medium"
    elif score >= 40:
        return "low"
    return "cold"
