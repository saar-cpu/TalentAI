import json
import re

import anthropic

from app.config import settings
from app.models.schemas import ChatMessage, ScreeningChatResponse

SYSTEM_PROMPT = """You are a friendly and efficient WhatsApp AI Recruiter for a restaurant/retail chain. You are chatting via WhatsApp with a candidate who just clicked on a social media job ad.

CRITICAL RULES:

1. Platform: This is WhatsApp. Keep messages short (1-3 sentences max). Use emojis sparingly — one per message at most, and only when it fits naturally.

2. No Resumes: Never ask for a CV or resume.

3. Goal: Ask ONE screening question at a time to check basic fit (previous experience, availability for required shifts, approximate start date).

4. Tone: Friendly, warm, and professional. Think approachable shift manager — not a hype machine. Never use phrases like "Love it!", "Amazing!", or "Awesome!" for basic yes/no answers. Match your energy to what the candidate actually said.

5. Contextual Reactions: React logically to the candidate's answers.
   - If they say they have NO experience, do NOT say "Great!" or "Nice!". Instead, be reassuring: "No worries, we provide full training."
   - If they answer positively, acknowledge it naturally without over-the-top enthusiasm: "Good to hear." or "That works."
   - If they give a negative answer to a non-critical question, adapt and move on.

6. Handle Vague Answers: If the candidate is vague or non-committal (e.g., "I don't know", "maybe", "not sure") on a critical question (availability, start date), do NOT praise them and do NOT advance them. Politely press for clarity: "We'd need a rough idea of when you could start to move forward — are we talking days or weeks?"

7. Rejection Path: If the candidate flat-out refuses required conditions (e.g., cannot work evenings/weekends when the role requires it), or gives consistently unhelpful or evasive answers after being asked to clarify, politely end the screening. Example: "Thanks for your time! Unfortunately this role needs evening availability, so it might not be the right fit right now. We'll keep you in mind if something else opens up."

8. Action-Oriented (only when earned): Only offer a phone call or trial shift if the candidate has given clear, positive answers to all key screening questions. Do not offer it by default.

You MUST respond with ONLY valid JSON (no markdown fences) matching this schema:
{
  "reply": "your WhatsApp message to the candidate",
  "screening_complete": false,
  "candidate_fit": null
}

- Set screening_complete to true when you have enough info to make a fit decision (positive OR negative).
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


_VAGUE_PHRASES = {"maybe", "idk", "not sure", "i don't know", "dunno", "possibly", "we'll see", "i guess"}
_NEGATIVE_PHRASES = {"no", "nope", "nah", "can't", "cannot", "don't", "never"}


def _classify_sentiment(text: str) -> str:
    """Return 'vague', 'negative', or 'positive'. Vague is checked first."""
    lower = text.lower().strip()
    if any(phrase in lower for phrase in _VAGUE_PHRASES):
        return "vague"
    if any(re.search(rf"\b{re.escape(kw)}\b", lower) for kw in _NEGATIVE_PHRASES):
        return "negative"
    return "positive"


def _mock_screening(
    chat_history: list[ChatMessage],
    latest_message: str,
    candidate_name: str | None,
) -> ScreeningChatResponse:
    name = candidate_name.split()[0] if candidate_name else "there"
    turn = len([m for m in chat_history if m.role == "user"]) + 1
    sentiment = _classify_sentiment(latest_message)

    if turn == 1:
        reply = f"Hey {name} 👋 Thanks for your interest! Have you worked in a restaurant or retail before?"
    elif turn == 2:
        if sentiment == "negative":
            reply = "No worries — we provide full training, so that's not a dealbreaker. Are you available for evening or weekend shifts?"
        elif sentiment == "vague":
            reply = "All good, even informal experience counts. Have you done any customer-facing work at all?"
        else:
            reply = "Good to hear. Are you available for evening or weekend shifts?"
    elif turn == 3:
        if sentiment == "negative":
            return ScreeningChatResponse(
                reply=f"Thanks for being upfront, {name}. This role does need evening/weekend availability, so it might not be the right fit right now. We'll keep you in mind if something else opens up.",
                screening_complete=True,
                candidate_fit="not_a_fit",
            )
        if sentiment == "vague":
            reply = "We do need someone who can cover evenings or weekends. Could you do at least one of those?"
        else:
            reply = "That works. Roughly when could you start?"
    else:
        if sentiment == "vague":
            reply = "We'd need a rough idea of timing to move forward — are we talking a few days or a few weeks?"
        elif sentiment == "negative":
            return ScreeningChatResponse(
                reply=f"No problem, {name}. Sounds like the timing isn't right. Feel free to reach out when things change — we'd be happy to chat again.",
                screening_complete=True,
                candidate_fit="not_a_fit",
            )
        else:
            return ScreeningChatResponse(
                reply=f"Sounds good, {name}. I'll have our manager give you a call tomorrow to set up a short trial shift. Talk soon!",
                screening_complete=True,
                candidate_fit="good_fit",
            )

    return ScreeningChatResponse(
        reply=reply,
        screening_complete=False,
        candidate_fit=None,
    )
