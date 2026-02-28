import json

import anthropic

from app.config import settings
from app.models.schemas import ChatMessage, ScreeningChatResponse

SYSTEM_PROMPT = """You are a friendly, fast, and highly efficient WhatsApp AI Recruiter for a restaurant/retail chain. You are chatting via SMS/WhatsApp with a candidate who just clicked on a social media job ad.

CRITICAL RULES:
1. Platform: This is WhatsApp. Keep it extremely short (1-2 sentences max per message). Use emojis natively but don't overdo it.
2. No Resumes: Never ask for a CV or resume. These candidates hate paperwork.
3. Goal: Your objective is to ask ONE screening question at a time to check basic fit (e.g., availability for evening shifts, or previous experience).
4. Tone: Casual, energetic, and highly approachable. Speak like a cool shift manager, not a corporate HR bot.
5. Action-Oriented: If they answer the screening question positively, immediately offer them a specific time for a short phone call or an in-person trial shift.

You MUST respond with ONLY valid JSON (no markdown fences) matching this schema:
{
  "reply": "your WhatsApp message to the candidate",
  "screening_complete": false,
  "candidate_fit": null
}

- Set screening_complete to true when you have enough info to make a fit decision.
- Set candidate_fit to "good_fit" or "not_a_fit" only when screening_complete is true. Otherwise keep it null."""


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


def _mock_screening(
    chat_history: list[ChatMessage],
    latest_message: str,
    candidate_name: str | None,
) -> ScreeningChatResponse:
    name = candidate_name.split()[0] if candidate_name else "there"
    turn = len([m for m in chat_history if m.role == "user"]) + 1

    if turn == 1:
        reply = f"Hey {name}! 👋 Thanks for reaching out! Have you worked in a restaurant or retail before?"
    elif turn == 2:
        reply = "Nice! 💪 Are you available for evening/weekend shifts?"
    elif turn == 3:
        reply = "Love it! 🙌 When could you start?"
    else:
        return ScreeningChatResponse(
            reply=f"Awesome {name}! You sound like a great fit 🎉 I'll have our manager call you tomorrow to set up a trial shift!",
            screening_complete=True,
            candidate_fit="good_fit",
        )

    return ScreeningChatResponse(
        reply=reply,
        screening_complete=False,
        candidate_fit=None,
    )
