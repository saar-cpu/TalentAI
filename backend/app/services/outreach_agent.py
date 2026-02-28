import json
import re

import anthropic

from app.config import settings
from app.models.schemas import ChatMessage, ScreeningChatResponse

SYSTEM_PROMPT = """You are an energetic, sharp, and highly efficient WhatsApp Recruiter for "Barak Services" (ברק שירותים), the leading job placement agency in Eilat, Israel. You help young people and discharged soldiers relocate to Eilat for work.

The company offers a full relocation package: immediate job placement (hotels, retail/sales, security, restaurants/F&B), subsidized housing with no upfront payment, meals, free local transport, and "Muadefet" (עבודה מועדפת) status.

CRITICAL RULES & CHAT FLOW:

1. Platform: WhatsApp style. Short, conversational (1-2 sentences max per message). Use emojis naturally but stay professional. SPEAK IN HEBREW. All replies must be in Hebrew.

2. The Hook: You offer a full package — immediate jobs, subsidized housing (no upfront payment), meals, and free transport in Eilat. Lead with excitement about the opportunity.

3. No Resumes: Never ask for a CV or resume.

4. Mandatory Screening Checklist: You MUST ask ALL of the following questions, ONE AT A TIME, in this exact order. Do NOT skip any. Do NOT ask for a phone number or offer next steps until every question has been answered clearly.
   Q1. Relocation — Are they actually ready/willing to move to Eilat? Example: "מוכן/ה לעשות את הצעד ולהגיע לאילת?"
   Q2. Housing — Do they need the subsidized housing package, or do they already have a place in Eilat? Example: "יש לך מקום באילת או שתצטרך/י את המגורים המסובסדים שלנו?"
   Q3. Field of Interest — What kind of work are they looking for? (Hotels/מלונאות, Sales-Retail/מכירות, Security/אבטחה, F&B-Restaurants/מסעדנות). Example: "מה התחום שהכי מדבר אליך? מלונאות, מכירות, אבטחה או מסעדנות?"
   Q4. Start Date — When EXACTLY can they pack a bag and come? Example: "מתי אתה/את יכול/ה לארוז תיק ולהגיע?"

5. Tone: Energetic, direct, and warm — like a cool recruiter who genuinely wants to help them start a new chapter. NOT a corporate robot. Match your energy to what they said. Never say "מעולה!" or "אחלה!" to a negative or vague answer.

6. Logical Empathy — React to what the candidate ACTUALLY said:
   - Ready to move → "יאללה, אז בוא נתקדם!"
   - Hesitant but interested → Acknowledge and gently push.
   - Has experience in a relevant field → "זה רקע מצוין, יש ביקוש לזה באילת."
   - No experience → "אין בעיה, יש הכשרות מלאות."
   - NEVER respond positively to a negative answer.

7. Zero Tolerance for Flakes: If the candidate says "לא יודע", "אולי", "maybe", "I don't know", "not sure", "אפשרי", "נראה", or gives a vague non-answer to ANY question — especially relocation or start date — do NOT move to the next question. Do NOT praise them. Push back firmly but politely:
   - "כדי שנוכל להתקדם ולהזמין לך חדר במגורים, אני חייב/ה לדעת תאריך משוער. מדובר על הימים הקרובים או עוד חודש?"
   - "אני צריך/ה תשובה ברורה יותר כדי להתקדם. מה אומר/ת?"
   Stay on the same question until you get a usable answer. If they dodge the same question twice, politely end the screening as "not_a_fit".

8. Rejection Path: Politely end the screening and set candidate_fit to "not_a_fit" if:
   - The candidate says NO to relocating to Eilat. Example: "הבנתי, אנחנו מגייסים כרגע לעבודה באילת. אם יהיה רלוונטי בעתיד, תעדכן/י אותנו! 🙏"
   - The candidate gives vague or evasive answers twice in a row to the same question.
   - The candidate is clearly uninterested or hostile.

9. DO NOT RUSH THE CLOSE: Never ask for a phone number or offer next steps until ALL 4 questions have been asked AND answered clearly. Only then may you close: "סבבה, אז הנה מה שקורה עכשיו — אני מעביר/ה את הפרטים שלך למגייס/ת שלנו שיתקשר/תתקשר אליך לסגור פרטים על מגורים ותאריך הגעה. מה המספר טלפון שלך? 📞"

You MUST respond with ONLY valid JSON (no markdown fences) matching this schema:
{
  "reply": "your WhatsApp message to the candidate IN HEBREW",
  "screening_complete": false,
  "candidate_fit": null
}

- Set screening_complete to true ONLY when: (a) all 4 questions are answered clearly AND you collected their phone number, OR (b) a disqualifying answer triggers early rejection.
- Set candidate_fit to "good_fit" or "not_a_fit" only when screening_complete is true. Otherwise keep it null.
- "not_a_fit" is a valid and expected outcome. Do not try to force every candidate into "good_fit"."""


async def screen_candidate(
    chat_history: list[ChatMessage],
    latest_message: str,
    job_title: str,
    candidate_name: str | None = None,
    location: str | None = None,
) -> ScreeningChatResponse:
    if not settings.anthropic_api_key:
        return _mock_screening(chat_history, latest_message, candidate_name)

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    context = f"Job title: {job_title}"
    if candidate_name:
        context += f"\nCandidate name: {candidate_name}"
    if location:
        context += f"\nLocation: {location}"

    messages = []
    for msg in chat_history:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": latest_message})

    message = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system=SYSTEM_PROMPT + f"\n\nContext:\n{context}",
        messages=messages,
    )

    raw = message.content[0].text
    data = json.loads(raw)

    return ScreeningChatResponse(**data)


_VAGUE_PHRASES = {
    "maybe", "idk", "not sure", "i don't know", "dunno", "possibly",
    "we'll see", "i guess", "אולי", "לא יודע", "לא יודעת", "נראה",
    "אפשרי", "לא בטוח", "לא בטוחה", "יכול להיות",
}
_NEGATIVE_PHRASES = {
    "no", "nope", "nah", "can't", "cannot", "don't", "never",
    "לא", "אי אפשר", "לא יכול", "לא יכולה", "לא מעוניין", "לא מעוניינת",
    "לא רלוונטי",
}


def _classify_sentiment(text: str) -> str:
    """Return 'vague', 'negative', or 'positive'. Vague is checked first."""
    lower = text.lower().strip()
    if any(phrase in lower for phrase in _VAGUE_PHRASES):
        return "vague"
    if any(phrase in lower for phrase in _NEGATIVE_PHRASES):
        return "negative"
    return "positive"


def _mock_screening(
    chat_history: list[ChatMessage],
    latest_message: str,
    candidate_name: str | None,
) -> ScreeningChatResponse:
    name = candidate_name.split()[0] if candidate_name else "👋"
    turn = len([m for m in chat_history if m.role == "user"]) + 1
    sentiment = _classify_sentiment(latest_message)

    # Check if previous turn was also vague (double-dodge → reject)
    prev_user_msgs = [m.content for m in chat_history if m.role == "user"]
    prev_was_vague = (
        len(prev_user_msgs) >= 1
        and _classify_sentiment(prev_user_msgs[-1]) == "vague"
    )

    def _reject(reason: str) -> ScreeningChatResponse:
        return ScreeningChatResponse(
            reply=reason, screening_complete=True, candidate_fit="not_a_fit"
        )

    def _continue(reply: str) -> ScreeningChatResponse:
        return ScreeningChatResponse(
            reply=reply, screening_complete=False, candidate_fit=None
        )

    # Global guard: two vague answers in a row → reject regardless of turn
    if sentiment == "vague" and prev_was_vague and turn > 2:
        return _reject(
            f"תודה על השיחה {name}. אני צריך/ה תשובות ברורות יותר כדי להתקדם בתהליך. אם זה יהיה רלוונטי בעתיד, אל תהסס/י לחזור אלינו! 🙏"
        )

    # Turn 1: Greeting + Hook → Q1 (Relocation)
    if turn == 1:
        return _continue(
            f"היי {name}! אני מברק שירותים, הסוכנות המובילה להשמה באילת 🌴 "
            "אנחנו מציעים חבילה מלאה — עבודה מיידית, מגורים מסובסדים, ארוחות והסעות בחינם. "
            "מוכן/ה לעשות את הצעד ולהגיע לאילת?"
        )

    # Turn 2: React to relocation → Q2 (Housing)
    if turn == 2:
        if sentiment == "vague":
            return _continue("אני צריך/ה לדעת אם אילת רלוונטית בשבילך. מדובר על מעבר — אתה/את בכיוון או לא?")
        if sentiment == "negative":
            return _reject("הבנתי, אנחנו מגייסים כרגע לעבודה באילת. אם יהיה רלוונטי בעתיד, תעדכן/י אותנו! 🙏")
        return _continue("יאללה, אז בוא/י נתקדם! 💪 יש לך מקום באילת או שתצטרך/י את המגורים המסובסדים שלנו?")

    # Turn 3: React to housing → Q3 (Field of Interest)
    if turn == 3:
        if sentiment == "vague":
            if prev_was_vague:
                return _reject("תודה על השיחה. בלי תשובה ברורה על מגורים קשה לי להתקדם. כשתדע/י, חזור/י אלינו! 🙏")
            return _continue("צריך לדעת את זה כדי לסדר לך הכל מראש — צריך/ה מגורים מסובסדים או שיש לך מקום?")
        # Both positive (need housing) and negative (have own place) are fine here
        if sentiment == "negative":
            prefix = "סבבה, אז יש לך מקום באילת — מעולה."
        else:
            prefix = "מעולה, נסדר לך מגורים מסובסדים בלי תשלום מראש."
        return _continue(f"{prefix} מה התחום שהכי מדבר אליך? מלונאות, מכירות, אבטחה או מסעדנות? 🏨")

    # Turn 4: React to field → Q4 (Start Date)
    if turn == 4:
        if sentiment == "vague":
            if prev_was_vague:
                return _reject("תודה על הזמן. בלי בחירת תחום אני לא יכול/ה להתקדם. כשתחליט/י, אנחנו פה! 🙏")
            return _continue("אין לחץ, אבל תגיד/י לי לפחות מה יותר מדבר אליך — עבודה עם אנשים (מלונאות/מכירות) או משהו אחר?")
        return _continue("זה רקע מצוין, יש ביקוש לזה באילת 🔥 מתי אתה/את יכול/ה לארוז תיק ולהגיע?")

    # Turn 5: React to start date → Close (ask for phone number)
    if turn == 5:
        if sentiment == "vague":
            if prev_was_vague:
                return _reject("תודה על השיחה. כדי להתקדם עם מגורים ושיבוץ אני חייב/ה תאריך. כשתדע/י — תחזור/י! 🙏")
            return _continue("כדי שנוכל להתקדם ולהזמין לך חדר במגורים, אני חייב/ה לדעת תאריך משוער. מדובר על הימים הקרובים או עוד חודש?")
        if sentiment == "negative":
            return _reject("הבנתי, נשמע שהתזמון לא מתאים כרגע. כשזה ישתנה, אנחנו פה! 🙏")
        return _continue(
            "סבבה, אז הנה מה שקורה עכשיו — אני מעביר/ה את הפרטים שלך למגייס/ת שלנו "
            "שיתקשר/תתקשר אליך לסגור פרטים על מגורים ותאריך הגעה. מה המספר טלפון שלך? 📞"
        )

    # Turn 6+: Collect phone number → complete
    if turn >= 6:
        # Check if the message looks like a phone number
        phone_match = re.search(r"[\d\-+()]{7,}", latest_message)
        if phone_match:
            return ScreeningChatResponse(
                reply=f"תודה רבה {name}! 🎉 המגייס/ת שלנו יצור/תיצור איתך קשר בקרוב לסגור את כל הפרטים. להתראות באילת! 🌴",
                screening_complete=True,
                candidate_fit="good_fit",
            )
        if sentiment == "vague" or sentiment == "negative":
            return _reject("הבנתי. אם תרצה/י להתקדם בעתיד, שלח/י לנו הודעה. בהצלחה! 🙏")
        return _continue("אני צריך/ה את מספר הטלפון שלך כדי שהמגייס/ת שלנו יתקשר/תתקשר. אפשר לשלוח פה? 📞")
