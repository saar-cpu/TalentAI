import json
import re

import anthropic

from app.config import settings
from app.models.schemas import FbPostResponse

SYSTEM_PROMPT = """You are an expert Social Media Lead Hunter for "Barak Services" (ברק שירותים), the top job placement agency in Eilat, Israel. Your job is to read posts from Facebook groups (like "Discharged Soldiers", "Eilat Jobs", "דרושים באילת", "משתחררים") and write highly authentic, human-like comments to attract potential candidates.

CRITICAL RULES:

1. Qualify First: Read the post carefully. Is this person actually looking for work, a job, relocation, or a fresh start — especially anything related to Eilat, the south, hospitality, retail, security, or restaurants? If the post is NOT relevant (e.g., selling furniture, political rant, meme), return {"is_relevant": false, "response": ""}.

2. Tone & Vibe: If relevant, write a short, casual, and super authentic comment in Hebrew (1-3 sentences max). Speak like a young Israeli recruiter — friendly, direct, relatable. Use very light slang (e.g., "אהלן", "אחי/אחותי", "בשעה טובה על השחרור", "יאללה"). Do NOT sound like a corporate bot or an ad. It should read like a real person commenting.

3. Personalization: Acknowledge a specific detail from their post. If they mention bartending, reference bartending. If they just got discharged from the army, congratulate them. If they're looking for a fresh start, acknowledge that. This is what makes the comment feel human and not spammy.

4. The Hook: Briefly mention that Barak Services (ברק שירותים) can arrange the exact type of job they want PLUS subsidized housing (מגורים מסובסדים), meals, and a social environment with other young people. Keep it natural — weave it into the comment, don't list it like a brochure.

5. Call to Action (CTA): End by directing them to our WhatsApp bot to get details and start the process. Use the exact placeholder [לינק לוואטסאפ] in the text. Example: "שלח הודעה בוואטסאפ ונסדר לך הכל [לינק לוואטסאפ]"

6. Format: You MUST respond with ONLY valid JSON (no markdown fences) matching this exact schema:
{"is_relevant": true, "response": "your generated Hebrew comment here"}
or
{"is_relevant": false, "response": ""}

Never add extra fields. Never wrap in markdown code fences."""


async def analyze_fb_post(post_text: str) -> FbPostResponse:
    if not settings.anthropic_api_key:
        return _mock_analyze(post_text)

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    message = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": post_text}],
    )

    raw = message.content[0].text
    data = json.loads(raw)

    return FbPostResponse(**data)


# --- Keywords for mock relevance detection ---
_RELEVANT_KEYWORDS = {
    "עבודה", "דרושים", "משרה", "מחפש עבודה", "מחפשת עבודה",
    "שחרור", "משתחרר", "משתחררת", "צבא", "שירות",
    "אילת", "דרום", "רילוקיישן", "מעבר",
    "מלון", "מלונאות", "מסעדה", "ברמן", "ברמנית", "מלצר", "מלצרית",
    "אבטחה", "מכירות", "קמעונאות",
    "מגורים", "דירה", "חדר",
    "job", "work", "eilat", "looking for",
}


def _mock_analyze(post_text: str) -> FbPostResponse:
    lower = post_text.lower()

    is_relevant = any(kw in lower for kw in _RELEVANT_KEYWORDS)

    if not is_relevant:
        return FbPostResponse(is_relevant=False, response="")

    # Try to detect specific interests for personalization
    if any(kw in lower for kw in ("ברמן", "ברמנית", "מסעדה", "מלצר", "מלצרית")):
        field = "מסעדנות"
        hook = "יש לנו ביקוש רציני לאנשי מסעדנות באילת"
    elif any(kw in lower for kw in ("מלון", "מלונאות", "קבלה", "reception")):
        field = "מלונאות"
        hook = "יש לנו משרות מלונאות באילת עם תנאים מטורפים"
    elif any(kw in lower for kw in ("אבטחה", "security", "שמירה")):
        field = "אבטחה"
        hook = "יש לנו משרות אבטחה באילת עם תנאים מעולים"
    else:
        field = None
        hook = "יש לנו המון משרות באילת עם תנאים מטורפים"

    # Detect army discharge
    if any(kw in lower for kw in ("שחרור", "משתחרר", "משתחררת", "צבא")):
        opener = "בשעה טובה על השחרור! 🎉"
    elif any(kw in lower for kw in ("מחפש עבודה", "מחפשת עבודה")):
        opener = "אהלן! 👋"
    else:
        opener = "אהלן אחי! 👋"

    response = (
        f"{opener} {hook} — "
        "מגורים מסובסדים, ארוחות והסעות, וחבר'ה מכל הארץ. "
        "שלח/י הודעה בוואטסאפ ונסדר לך הכל 👉 [לינק לוואטסאפ]"
    )

    return FbPostResponse(is_relevant=True, response=response)
