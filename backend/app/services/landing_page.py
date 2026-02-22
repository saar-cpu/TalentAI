import json

import anthropic

from app.config import settings
from app.models.schemas import LandingPageData

SYSTEM_PROMPT = """You are TalentAI, an expert recruitment copywriter.
Given a candidate profile and job posting, generate hyper-personalized landing
page copy that speaks directly to this candidate's background, skills, and
career aspirations. The tone should be confident yet warm — like a trusted
mentor showing them an opportunity tailor-made for them.

Rules:
- headline: A bold, short hook (max 10 words). Make it personal.
- subheadline: 1-2 sentences connecting their specific background to the role.
- why_you_fit: Exactly 3 bullet points. Each must reference a concrete detail from their profile (a skill, project, company, or interest) and map it to a job requirement.
- personalized_benefits: Exactly 3 benefits reframed through the lens of what this specific candidate would value most based on their interests and experience level.
- call_to_action: A single compelling CTA string (action-oriented, low friction).
- tone: One of "confident-yet-warm", "exciting-startup", "prestigious-enterprise", "mission-driven" — pick the best fit for this candidate.

Return ONLY valid JSON matching this schema (no markdown fences):
{
  "headline": "string",
  "subheadline": "string",
  "why_you_fit": ["string", "string", "string"],
  "personalized_benefits": ["string", "string", "string"],
  "call_to_action": "string",
  "tone": "string"
}"""

# Mock data for demo routes and when the API key is not configured
MOCK_CANDIDATES = {
    "demo-candidate": {
        "id": "demo-candidate",
        "name": "Alex Chen",
        "headline": "Senior Software Engineer | Distributed Systems",
        "skills": ["Python", "Go", "Kubernetes", "PostgreSQL", "gRPC"],
        "experience_level": "senior",
        "years_of_experience": 7,
        "interests": ["open-source", "system design", "mentoring"],
        "current_role": "Senior Engineer",
        "current_company": "Stripe",
        "location": "San Francisco, CA",
    }
}

MOCK_JOBS = {
    "demo-job": {
        "id": "demo-job",
        "title": "Staff Platform Engineer",
        "company": "TalentAI",
        "description": "Lead the design and scaling of our core platform infrastructure serving 1M+ requests/sec.",
        "requirements": ["Distributed systems", "Kubernetes", "Python or Go", "7+ years experience"],
        "benefits": ["$12K learning budget", "Fully remote", "Top-tier equity"],
        "location": "Remote",
    }
}


async def generate_landing_page(
    job_id: str,
    candidate_id: str,
) -> LandingPageData:
    # In production, fetch candidate/job from DB. For now use mocks for demo IDs.
    candidate = MOCK_CANDIDATES.get(candidate_id)
    job = MOCK_JOBS.get(job_id)

    if not candidate or not job:
        # Return a generic placeholder when IDs aren't in our mock store
        return LandingPageData(
            job_id=job_id,
            candidate_id=candidate_id,
            headline="An Opportunity Built for You",
            subheadline="We think your unique background makes you an exceptional fit for this role.",
            why_you_fit=[
                "Your technical skills align closely with our core requirements.",
                "Your experience level matches what we need for this position.",
                "Your interests suggest you'd thrive in our team culture.",
            ],
            personalized_benefits=[
                "Work on challenging problems at meaningful scale.",
                "Generous learning and development budget.",
                "Flexible work environment designed around your productivity.",
            ],
            call_to_action="Start a Conversation — It Only Takes 2 Minutes",
            tone="confident-yet-warm",
        )

    # If no API key is configured, return rich mock data without calling Claude
    if not settings.anthropic_api_key:
        return _mock_landing_data(job_id, candidate_id, candidate, job)

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    user_message = f"""
CANDIDATE PROFILE:
{json.dumps(candidate, indent=2)}

JOB POSTING:
{json.dumps(job, indent=2)}
"""

    message = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = message.content[0].text
    data = json.loads(raw)

    return LandingPageData(
        job_id=job_id,
        candidate_id=candidate_id,
        **data,
    )


def _mock_landing_data(
    job_id: str, candidate_id: str, candidate: dict, job: dict
) -> LandingPageData:
    name = candidate["name"].split()[0]
    return LandingPageData(
        job_id=job_id,
        candidate_id=candidate_id,
        headline=f"{name}, This Role Was Made for You",
        subheadline=(
            f"Your {candidate['years_of_experience']}+ years in {candidate['skills'][0]} "
            f"and {candidate['skills'][1]} at {candidate['current_company']} make you "
            f"an ideal fit for {job['title']} at {job['company']}."
        ),
        why_you_fit=[
            f"Your expertise in {candidate['skills'][2]} maps directly to our core infrastructure needs.",
            f"Your passion for {candidate['interests'][0]} aligns with our engineering culture of open collaboration.",
            f"Your {candidate['experience_level']}-level experience exceeds the {job['requirements'][-1]} we're looking for.",
        ],
        personalized_benefits=[
            f"Work on systems processing 1M+ req/sec — the scale you've been building toward at {candidate['current_company']}.",
            f"A {job['benefits'][0]} to fuel the curiosity your {candidate['interests'][1]} interest demonstrates.",
            f"{job['benefits'][1]} with async-first culture — matching the flexibility top engineers thrive in.",
        ],
        call_to_action="Let's Talk — Book a 15-min Chat With the Hiring Manager",
        tone="confident-yet-warm",
    )
