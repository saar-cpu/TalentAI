import json

import anthropic

from app.config import settings
from app.models.schemas import CandidateProfile, OutreachSequence

SYSTEM_PROMPT = """You are TalentAI, an expert recruitment marketing strategist.
Given a candidate profile and job description, generate a personalized 3-step
outreach sequence. Each step should feel authentic, reference specific details
from the candidate's background, and progressively build interest.

Rules:
- Step 1: Initial outreach (LinkedIn connection request or short email). Warm, concise, reference one specific thing about them.
- Step 2: Value-add follow-up (2-3 days later). Share a relevant insight, article, or project detail. No hard sell.
- Step 3: Soft close (5-7 days later). Direct but respectful ask for a conversation. Include a specific reason this role fits them.

Return ONLY valid JSON matching this schema (no markdown fences):
{
  "candidate_id": "string",
  "job_id": "string",
  "steps": [
    {
      "step_number": 1,
      "channel": "linkedin" | "email",
      "subject": "string or null",
      "body": "string",
      "send_after_days": 0
    }
  ]
}"""


async def generate_outreach_sequence(
    candidate: CandidateProfile,
    job_description: str,
    job_id: str = "unknown",
) -> OutreachSequence:
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    user_message = f"""
CANDIDATE PROFILE:
{candidate.model_dump_json(indent=2)}

JOB DESCRIPTION:
{job_description}
"""

    message = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = message.content[0].text
    data = json.loads(raw)

    # Ensure IDs are set correctly
    data["candidate_id"] = candidate.id
    data["job_id"] = job_id

    return OutreachSequence(**data)
