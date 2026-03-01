"""Hardcoded job listings and field-matching logic for the screening chatbot."""

JOBS: list[dict] = [
    # מלונאות (Hotels)
    {"id": "h1", "title": "פקיד/ת קבלה", "field": "מלונאות", "employer": "רויאל ביץ׳ אילת", "salary_range": "6,500–8,000 ₪", "housing": True, "urgency": "now"},
    {"id": "h2", "title": "מלצר/ית", "field": "מלונאות", "employer": "דן אילת", "salary_range": "6,000–7,500 ₪", "housing": True, "urgency": "now"},
    {"id": "h3", "title": "עוזר/ת חדרנ/ית", "field": "מלונאות", "employer": "הרודס אילת", "salary_range": "5,800–6,800 ₪", "housing": True, "urgency": "this_week"},

    # קמעונאות/מכירות (Retail/Sales)
    {"id": "r1", "title": "מוכר/ת בחנות", "field": "קמעונאות", "employer": "מתחם Ice Mall", "salary_range": "6,000–7,500 ₪", "housing": True, "urgency": "now"},
    {"id": "r2", "title": "נציג/ת מכירות", "field": "קמעונאות", "employer": "פוקס אילת", "salary_range": "6,500–8,500 ₪", "housing": False, "urgency": "this_week"},
    {"id": "r3", "title": "קופאי/ת", "field": "קמעונאות", "employer": "סופר-פארם אילת", "salary_range": "5,800–6,500 ₪", "housing": True, "urgency": "this_month"},

    # אבטחה (Security)
    {"id": "s1", "title": "מאבטח/ת", "field": "אבטחה", "employer": "מלון ישרוטל", "salary_range": "7,000–9,000 ₪", "housing": True, "urgency": "now"},
    {"id": "s2", "title": "סייר/ת ביטחון", "field": "אבטחה", "employer": "קניון מול הים", "salary_range": "7,500–9,500 ₪", "housing": True, "urgency": "now"},
    {"id": "s3", "title": "מאבטח/ת אירועים", "field": "אבטחה", "employer": "הפקות דרום", "salary_range": "6,500–8,000 ₪", "housing": False, "urgency": "this_week"},

    # מסעדנות (F&B / Restaurants)
    {"id": "f1", "title": "טבח/ית", "field": "מסעדנות", "employer": "מסעדת לה קוצ׳ינה", "salary_range": "7,000–9,000 ₪", "housing": True, "urgency": "now"},
    {"id": "f2", "title": "מלצר/ית", "field": "מסעדנות", "employer": "שף בר אילת", "salary_range": "6,000–8,000 ₪", "housing": True, "urgency": "this_week"},
    {"id": "f3", "title": "ברמן/ית", "field": "מסעדנות", "employer": "ביץ׳ בר אילת", "salary_range": "6,500–8,500 ₪", "housing": True, "urgency": "now"},

    # תחנות דלק (Gas Stations)
    {"id": "g1", "title": "עובד/ת תחנת דלק", "field": "תחנות דלק", "employer": "פז אילת", "salary_range": "6,000–7,000 ₪", "housing": True, "urgency": "this_week"},
    {"id": "g2", "title": "קופאי/ת נוחות", "field": "תחנות דלק", "employer": "סונול אילת", "salary_range": "5,800–6,800 ₪", "housing": True, "urgency": "this_month"},
]

# Maps candidate free-text keywords to canonical field names
FIELD_KEYWORDS: dict[str, str] = {
    # מלונאות
    "מלונאות": "מלונאות",
    "מלון": "מלונאות",
    "מלונות": "מלונאות",
    "קבלה": "מלונאות",
    "housekeeping": "מלונאות",
    "חדרנ": "מלונאות",
    "הוטל": "מלונאות",
    "hotel": "מלונאות",
    # קמעונאות / מכירות
    "מכירות": "קמעונאות",
    "קמעונאות": "קמעונאות",
    "חנות": "קמעונאות",
    "חנויות": "קמעונאות",
    "קופאי": "קמעונאות",
    "מוכר": "קמעונאות",
    "retail": "קמעונאות",
    "sales": "קמעונאות",
    # אבטחה
    "אבטחה": "אבטחה",
    "שמירה": "אבטחה",
    "מאבטח": "אבטחה",
    "ביטחון": "אבטחה",
    "security": "אבטחה",
    "סייר": "אבטחה",
    # מסעדנות
    "מסעדנות": "מסעדנות",
    "מסעדה": "מסעדנות",
    "מסעדות": "מסעדנות",
    "טבח": "מסעדנות",
    "מלצר": "מסעדנות",
    "ברמן": "מסעדנות",
    "בישול": "מסעדנות",
    "restaurant": "מסעדנות",
    "food": "מסעדנות",
    # תחנות דלק
    "תחנת דלק": "תחנות דלק",
    "תחנות דלק": "תחנות דלק",
    "דלק": "תחנות דלק",
    "gas": "תחנות דלק",
}

_URGENCY_ORDER = {"now": 0, "this_week": 1, "this_month": 2}


def normalize_field(text: str) -> str | None:
    """Map free-text to a canonical field name. Returns None if no match."""
    lower = text.lower().strip()
    for keyword, field in FIELD_KEYWORDS.items():
        if keyword in lower:
            return field
    return None


def match_jobs(field_text: str, limit: int = 3) -> list[dict]:
    """Return top matching jobs for the candidate's stated field of interest."""
    field = normalize_field(field_text)
    if not field:
        return []

    matching = [j for j in JOBS if j["field"] == field]
    matching.sort(key=lambda j: _URGENCY_ORDER.get(j["urgency"], 99))
    return matching[:limit]
