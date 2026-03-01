"""Score candidate CV/skills text against job requirements using Claude AI."""

import json

import anthropic

from app.config import settings


async def score_cv_match(cv_text: str, jobs: list[dict]) -> list[dict]:
    """Score each job 0-100 based on how well the candidate's CV matches its requirements.

    Returns the jobs list with a `match_score` field added, sorted by score descending.
    Falls back to keyword matching when no API key is configured.
    """
    if not cv_text.strip() or not jobs:
        return jobs

    if not settings.anthropic_api_key:
        return _mock_score(cv_text, jobs)

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    # Build job summaries for the prompt
    job_summaries = []
    for job in jobs:
        reqs = ", ".join(job.get("requirements", []))
        job_summaries.append(f'- id: "{job["id"]}", title: "{job["title"]}", requirements: [{reqs}]')

    jobs_text = "\n".join(job_summaries)

    prompt = f"""אתה מערכת התאמת מועמדים. קיבלת רקע של מועמד ורשימת משרות עם דרישות.
דרג כל משרה בציון 0-100 לפי מידת ההתאמה של המועמד.

קריטריונים:
- ניסיון ישיר בתחום = ציון גבוה (80-100)
- כישורים רלוונטיים אך לא ישירים = ציון בינוני (50-79)
- אין התאמה ברורה אבל יש פוטנציאל = ציון נמוך (30-49)
- אין התאמה כלל = ציון מינימלי (10-29)

רקע המועמד:
{cv_text}

משרות:
{jobs_text}

החזר ONLY JSON array, בלי markdown fences:
[{{"id": "...", "match_score": ...}}, ...]"""

    try:
        message = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=256,
            messages=[{"role": "user", "content": prompt}],
        )

        raw = message.content[0].text
        scores = json.loads(raw)
        score_map = {s["id"]: s["match_score"] for s in scores}

        for job in jobs:
            score = score_map.get(job["id"])
            if score is not None:
                job["match_score"] = max(0, min(100, int(score)))

    except Exception:
        # On any failure, fall back to keyword matching
        return _mock_score(cv_text, jobs)

    jobs.sort(key=lambda j: j.get("match_score", 0), reverse=True)
    return jobs


def _mock_score(cv_text: str, jobs: list[dict]) -> list[dict]:
    """Keyword-based fallback scoring when no API key is available."""
    cv_lower = cv_text.lower()

    for job in jobs:
        requirements = job.get("requirements", [])
        if not requirements:
            job["match_score"] = 50
            continue

        matched = 0
        for req in requirements:
            # Check if any word from the requirement appears in the CV
            words = [w for w in req.split() if len(w) > 2]
            if any(w.lower() in cv_lower for w in words):
                matched += 1

        job["match_score"] = max(10, int((matched / len(requirements)) * 100))

    jobs.sort(key=lambda j: j.get("match_score", 0), reverse=True)
    return jobs
