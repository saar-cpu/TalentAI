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
    if not settings.anthropic_api_key:
        return _mock_outreach(candidate, job_id)

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


def _mock_outreach(candidate: CandidateProfile, job_id: str) -> OutreachSequence:
    first_name = candidate.name.split()[0]
    top_skill = candidate.skills[0] if candidate.skills else "engineering"
    company = candidate.current_company or "your company"

    return OutreachSequence(
        candidate_id=candidate.id,
        job_id=job_id,
        steps=[
            {
                "step_number": 1,
                "channel": "linkedin",
                "subject": None,
                "body": (
                    f"Hi {first_name}, I came across your work in {top_skill} at {company} "
                    f"and was genuinely impressed. We're building something at TalentAI that "
                    f"I think would resonate with your background — would love to connect."
                ),
                "send_after_days": 0,
            },
            {
                "step_number": 2,
                "channel": "email",
                "subject": f"A quick read on scaling {top_skill} systems",
                "body": (
                    f"Hi {first_name},\n\n"
                    f"I wanted to share an article our engineering team published on scaling "
                    f"{top_skill} infrastructure to 1M+ req/sec — given your experience at "
                    f"{company}, I thought you'd find the trade-offs interesting.\n\n"
                    f"No pitch, just thought you'd appreciate the read.\n\n"
                    f"Best,\nTalentAI Recruiting"
                ),
                "send_after_days": 3,
            },
            {
                "step_number": 3,
                "channel": "email",
                "subject": f"{first_name}, a role that fits your trajectory",
                "body": (
                    f"Hi {first_name},\n\n"
                    f"I'll be direct — we have a Staff Platform Engineer role that maps "
                    f"remarkably well to your {candidate.years_of_experience}+ years of "
                    f"{top_skill} experience. The team works on distributed systems at "
                    f"serious scale, fully remote, with top-tier equity.\n\n"
                    f"Would you be open to a quick 15-minute chat this week? No pressure, "
                    f"just a conversation.\n\n"
                    f"Best,\nTalentAI Recruiting"
                ),
                "send_after_days": 7,
            },
        ],
    )
