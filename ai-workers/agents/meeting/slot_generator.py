"""
Meeting slot generator.
Generates available time slots for the next 5 business days.
No external calendar API needed — uses simple business hours logic.
"""

from datetime import datetime, timedelta
from typing import List, Dict


def get_next_business_days(count: int = 5) -> List[datetime]:
    """Get next N business days (Mon-Fri) from tomorrow."""
    days = []
    current = datetime.now() + timedelta(days=1)

    while len(days) < count:
        # Skip weekends
        if current.weekday() < 5:  # 0=Mon, 4=Fri
            days.append(current)
        current += timedelta(days=1)

    return days


def generate_meeting_slots(count: int = 3) -> List[Dict]:
    """
    Generate meeting slot proposals.
    Returns list of slot dicts with datetime and label.
    """
    business_days = get_next_business_days(5)

    # Preferred times: 10 AM, 2 PM, 4 PM IST
    preferred_hours = [10, 14, 16]

    slots = []
    for day in business_days:
        for hour in preferred_hours:
            slot_time = day.replace(hour=hour, minute=0, second=0, microsecond=0)
            slots.append({
                "datetime": slot_time.isoformat() + "Z",
                "label": slot_time.strftime("%A, %d %B at %I:%M %p IST"),
                "day": slot_time.strftime("%A"),
                "date": slot_time.strftime("%d %B %Y"),
                "time": slot_time.strftime("%I:%M %p"),
            })
        if len(slots) >= count * 3:
            break

    # Return requested count
    return slots[:count]


def format_slots_for_message(slots: List[Dict]) -> str:
    """Format slots as numbered list for email/message."""
    lines = []
    for i, slot in enumerate(slots, 1):
        lines.append(f"{i}. {slot['label']}")
    return "\n".join(lines)
