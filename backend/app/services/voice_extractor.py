"""Extract structured Quick Apply fields from a voice call transcript using Claude AI."""

import json
import re

import anthropic

from app.config import settings


async def extract_application_from_transcript(transcript: str) -> dict:
    """Use Claude to extract structured application data from a voice transcript.

    Returns dict with: name, phone, field, relocate, housing, start_date, cv_text.
    Falls back to keyword/regex extraction when no API key is configured.
    """
    if not transcript.strip():
        return _empty_result()

    if not settings.anthropic_api_key:
        return _mock_extract(transcript)

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    prompt = f"""אתה מערכת חילוץ נתונים מתמלול שיחת גיוס. חלץ את הפרטים הבאים מהשיחה:

1. name — שם המועמד (מחרוזת)
2. phone — מספר טלפון (מחרוזת, פורמט ישראלי)
3. field — תחום עבודה מועדף. חייב להיות אחד מ: מלונאות, מכירות, אבטחה, מסעדנות, תחנות דלק, אחר
4. relocate — האם מוכן/ה לעבור לאילת (true/false)
5. housing — צריך מגורים? אחד מ: need, have, flexible (ברירת מחדל: need)
6. start_date — מתי יכול/ה להתחיל. אחד מ: this_week, two_weeks, this_month, not_sure
7. cv_text — כל מידע על ניסיון, כישורים או רקע שהמועמד הזכיר (מחרוזת חופשית)

תמלול השיחה:
{transcript}

החזר ONLY JSON object, בלי markdown fences:
{{"name": "...", "phone": "...", "field": "...", "relocate": true/false, "housing": "...", "start_date": "...", "cv_text": "..."}}

אם שדה לא הוזכר בשיחה, השתמש בברירות מחדל:
- name: "לא צוין"
- phone: ""
- field: "אחר"
- relocate: true (רוב המתקשרים מתכוונים לעבור)
- housing: "need"
- start_date: "this_month"
- cv_text: ""
"""

    try:
        message = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=512,
            messages=[{"role": "user", "content": prompt}],
        )

        raw = message.content[0].text
        data = json.loads(raw)

        return _normalize(data)

    except Exception:
        return _mock_extract(transcript)


def _normalize(data: dict) -> dict:
    """Ensure all fields exist with correct types."""
    valid_fields = {"מלונאות", "מכירות", "אבטחה", "מסעדנות", "תחנות דלק", "אחר"}
    valid_start = {"this_week", "two_weeks", "this_month", "not_sure"}
    valid_housing = {"need", "have", "flexible"}

    field = data.get("field", "אחר")
    if field not in valid_fields:
        field = "אחר"

    start_date = data.get("start_date", "this_month")
    if start_date not in valid_start:
        start_date = "this_month"

    housing = data.get("housing", "need")
    if housing not in valid_housing:
        housing = "need"

    return {
        "name": str(data.get("name", "לא צוין")),
        "phone": str(data.get("phone", "")),
        "field": field,
        "relocate": bool(data.get("relocate", True)),
        "housing": housing,
        "start_date": start_date,
        "cv_text": str(data.get("cv_text", "")),
    }


def _empty_result() -> dict:
    return {
        "name": "לא צוין",
        "phone": "",
        "field": "אחר",
        "relocate": True,
        "housing": "need",
        "start_date": "this_month",
        "cv_text": "",
    }


def _mock_extract(transcript: str) -> dict:
    """Keyword/regex fallback when no API key is available."""
    text = transcript.strip()

    # Extract phone
    phone_match = re.search(r"[\d\-+()]{7,}", text)
    phone = phone_match.group(0) if phone_match else ""

    # Detect field from keywords
    field = "אחר"
    field_keywords = {
        "מלונאות": ["מלון", "קבלה", "חדרנ", "מלונאות"],
        "מכירות": ["מכירות", "חנות", "קמעונ", "מוכר"],
        "אבטחה": ["אבטח", "שמיר", "מאבטח"],
        "מסעדנות": ["מסעד", "מלצר", "טבח", "ברמן", "בישול"],
        "תחנות דלק": ["דלק", "תחנ", "תדלוק"],
    }
    for f, keywords in field_keywords.items():
        if any(kw in text for kw in keywords):
            field = f
            break

    # Detect relocate
    relocate = True
    if "לא מוכן" in text or "לא יכול לעבור" in text or "לא רוצה לעבור" in text:
        relocate = False

    # Detect start date
    start_date = "this_month"
    if "השבוע" in text or "מחר" in text or "מיד" in text:
        start_date = "this_week"
    elif "שבועיים" in text:
        start_date = "two_weeks"
    elif "לא בטוח" in text or "לא יודע" in text:
        start_date = "not_sure"

    return {
        "name": "לא צוין",
        "phone": phone,
        "field": field,
        "relocate": relocate,
        "housing": "need",
        "start_date": start_date,
        "cv_text": text,
    }
