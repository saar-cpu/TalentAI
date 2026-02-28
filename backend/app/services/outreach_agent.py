import json
import re

import anthropic

from app.config import settings
from app.models.schemas import ChatMessage, ScreeningChatResponse

SYSTEM_PROMPT = """You are a friendly and efficient WhatsApp AI Recruiter for a restaurant/retail chain. You are chatting via WhatsApp with a candidate who just clicked on a social media job ad.

CRITICAL RULES:

1. Platform: This is WhatsApp. Keep messages short (1-3 sentences max). Use emojis sparingly — one per message at most, and only when it fits naturally.

2. No Resumes: Never ask for a CV or resume.

3. Mandatory Question Checklist: You MUST ask ALL of the following questions, ONE AT A TIME, in this order. Do NOT skip any. Do NOT offer a trial shift or phone call until every question has been answered clearly.
   Q1. Past experience — "Have you worked in a restaurant or retail before?"
   Q2. Shift availability — "Are you available for evening or weekend shifts?"
   Q3. Start date — "Roughly when could you start?"
   Q4. Situational — "How would you handle a really busy shift with frustrated customers?"
   Q5. Commute — "Do you live close to the location, or do you have reliable transport?"

4. Tone: Friendly, warm, and professional. Think approachable shift manager — not a hype machine. Never use phrases like "Love it!", "Amazing!", "Awesome!", or "Nice!" for basic yes/no answers. Match your energy to what the candidate actually said.

5. Logical Empathy — React to what the candidate ACTUALLY said:
   - NO experience → "Got it, no worries — we provide full training."
   - YES experience → "Good to know." or "That helps."
   - Negative answer to a non-critical question → Adapt and move on.
   - NEVER say "Good to hear" or "Great" in response to a negative answer.

6. Zero Tolerance for Vague Answers: If the candidate says "I don't know", "maybe", "not sure", or gives a non-answer to ANY question — especially start date or availability — do NOT move to the next question. Do NOT praise them. Push back firmly but politely:
   - "I really need a rough estimate to move forward — are we talking days or weeks?"
   - "We need to know about availability before we can continue. Could you give me a clearer answer?"
   Stay on the same question until you get a usable answer. If they dodge the same question twice, politely end the screening as "not_a_fit".

7. Rejection Path: Politely end the screening and set candidate_fit to "not_a_fit" if:
   - The candidate refuses a hard requirement (e.g., cannot work evenings/weekends).
   - The candidate gives vague or evasive answers twice in a row to the same question.
   - The candidate is clearly uninterested or hostile.
   Example: "Thanks for chatting! This role does need evening availability, so it might not be the right fit right now. We'll keep you in mind if something else comes up."

8. DO NOT RUSH THE CLOSE: Never offer a phone call or trial shift until ALL 5 questions have been asked AND answered clearly and satisfactorily. Only then may you offer next steps. If even one critical answer is missing or unclear, keep screening.

You MUST respond with ONLY valid JSON (no markdown fences) matching this schema:
{
  "reply": "your WhatsApp message to the candidate",
  "screening_complete": false,
  "candidate_fit": null
}

- Set screening_complete to true ONLY when: (a) all 5 questions are answered clearly and you can make a decision, OR (b) a disqualifying answer triggers early rejection.
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
            f"Thanks for chatting, {name}. We need clearer answers to move forward with the process, so we'll have to leave it here for now. Feel free to reach out again anytime."
        )

    # Turn 1: Greeting
    if turn == 1:
        return _continue(
            f"Hey {name} 👋 Thanks for your interest! Have you worked in a restaurant or retail before?"
        )

    # Turn 2: React to experience → ask availability
    if turn == 2:
        if sentiment == "vague":
            return _continue("I need a clearer answer on that — any customer-facing work at all, even informal?")
        if sentiment == "negative":
            return _continue("Got it, no worries — we provide full training. Are you available for evening or weekend shifts?")
        return _continue("Good to know. Are you available for evening or weekend shifts?")

    # Turn 3: React to availability → ask start date
    if turn == 3:
        if sentiment == "vague":
            if prev_was_vague:
                return _reject(f"Thanks for chatting, {name}. We need a clear answer on availability to move forward, so this might not be the right fit right now.")
            return _continue("We need to know about availability before we can continue. Could you do evenings, weekends, or both?")
        if sentiment == "negative":
            return _reject(f"Thanks for being upfront, {name}. This role does need evening/weekend availability, so it might not be the right fit right now. We'll keep you in mind if something else comes up.")
        return _continue("That works. Roughly when could you start?")

    # Turn 4: React to start date → ask situational question
    if turn == 4:
        if sentiment == "vague":
            if prev_was_vague:
                return _reject(f"Thanks for your time, {name}. We really need a rough start date to proceed, so we'll have to leave it here for now.")
            return _continue("I really need a rough estimate to move forward — are we talking a few days or a few weeks?")
        if sentiment == "negative":
            return _reject(f"No problem, {name}. Sounds like the timing isn't right. Feel free to reach out when things change.")
        return _continue("Got it. Quick question — how would you handle a really busy shift with frustrated customers?")

    # Turn 5: React to situational → ask commute
    if turn == 5:
        if sentiment == "vague":
            return _continue("Could you give me a bit more on that? Even a short answer is fine — how would you deal with an upset customer?")
        if sentiment == "negative":
            return _reject(f"Appreciate the honesty, {name}. This role does involve handling tough situations, so it might not be the best fit right now.")
        return _continue("Good answer. Last question — do you live close to the location, or do you have reliable transport?")

    # Turn 6+: React to commute → close
    if sentiment == "vague":
        if prev_was_vague:
            return _reject(f"Thanks for chatting, {name}. We need to confirm the commute situation to move forward. Feel free to reach out again when you have more clarity.")
        return _continue("We just need to make sure you can get here reliably. Do you have a car, bike, or live nearby?")
    if sentiment == "negative":
        return _reject(f"Thanks for letting me know, {name}. The commute might be tough for this location. We'll keep you in mind if something closer opens up.")
    return ScreeningChatResponse(
        reply=f"Great chatting with you, {name}. You seem like a solid fit! I'll have our manager call you tomorrow to set up a short trial shift. Talk soon!",
        screening_complete=True,
        candidate_fit="good_fit",
    )
