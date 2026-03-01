import re

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    QuickApplyRequest,
    QuickApplyResponse,
    ScreeningChatRequest,
    ScreeningChatResponse,
    VoiceApplyRequest,
)
from app.services.crm import save_lead_to_supabase
from app.services.cv_scorer import score_cv_match
from app.services.job_matcher import match_jobs, normalize_field
from app.services.outreach_agent import screen_candidate, extract_field_from_history
from app.services.voice_extractor import extract_application_from_transcript

router = APIRouter()


def _extract_phone(text: str) -> str | None:
    """Try to pull an Israeli phone number from the message."""
    match = re.search(r"[\d\-+()]{7,}", text)
    return match.group(0) if match else None


@router.post("/quick-apply", response_model=QuickApplyResponse)
async def quick_apply(request: QuickApplyRequest):
    try:
        # Disqualify if not willing to relocate
        if not request.relocate:
            return QuickApplyResponse(
                success=True,
                fit="not_a_fit",
                message="תודה על ההתעניינות! כרגע אנחנו מגייסים לעבודה באילת. אם זה יהיה רלוונטי בעתיד, נשמח לשמוע ממך!",
            )

        # Disqualify vague start date
        if request.start_date == "not_sure":
            return QuickApplyResponse(
                success=True,
                fit="not_a_fit",
                message="תודה על ההתעניינות! כשתדע/י מתי את/ה יכול/ה להגיע, חזור/י אלינו ונסדר הכל.",
            )

        # Match jobs based on field
        field = normalize_field(request.field) or request.field
        jobs = match_jobs(field)

        # Score CV match if candidate provided skills text
        if jobs and request.cv_text.strip():
            jobs = await score_cv_match(request.cv_text, jobs)

        # Build success message
        if jobs:
            job_mentions = " ו".join(
                f"{j['title']} ב{j['employer']}" for j in jobs[:2]
            )
            message = (
                f"מעולה {request.name}! יש לנו כרגע {job_mentions} — "
                "המגייס/ת שלנו יצור/תיצור איתך קשר בקרוב לסגור פרטים. להתראות באילת!"
            )
        else:
            message = (
                f"תודה {request.name}! קיבלנו את הפרטים. "
                "המגייס/ת שלנו יצור/תיצור איתך קשר בקרוב לסגור פרטים. להתראות באילת!"
            )

        # Save to CRM (fire-and-forget)
        await save_lead_to_supabase(
            name=request.name,
            phone=request.phone,
            desired_role=field,
            location="אילת",
        )

        return QuickApplyResponse(
            success=True,
            fit="good_fit",
            message=message,
            matched_jobs=jobs if jobs else None,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/screen", response_model=ScreeningChatResponse)
async def screen(request: ScreeningChatRequest):
    try:
        response = await screen_candidate(
            chat_history=request.chat_history,
            latest_message=request.latest_message,
            job_title=request.job_title,
            candidate_name=request.candidate_name,
            location=request.location,
        )

        # On successful screening, save lead to Supabase + score CV match
        if response.screening_complete and response.candidate_fit == "good_fit":
            phone = _extract_phone(request.latest_message)
            if phone:
                # Use the candidate's stated field instead of generic job_title
                field = extract_field_from_history(request.chat_history)
                desired_role = field or request.job_title
                await save_lead_to_supabase(
                    name=request.candidate_name,
                    phone=phone,
                    desired_role=desired_role,
                    location=request.location,
                )

            # Score matched jobs against candidate's chat messages
            if response.matched_jobs:
                skills_text = " ".join(
                    msg.content for msg in request.chat_history if msg.role == "user"
                ) + " " + request.latest_message
                response.matched_jobs = await score_cv_match(skills_text, response.matched_jobs)

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/voice-apply", response_model=QuickApplyResponse)
async def voice_apply(request: VoiceApplyRequest):
    try:
        # Extract structured data from the voice transcript
        data = await extract_application_from_transcript(request.transcript)

        name = data["name"]
        phone = data["phone"]
        field_raw = data["field"]
        relocate = data["relocate"]
        start_date = data["start_date"]
        cv_text = data.get("cv_text", "")

        # Disqualify if not willing to relocate
        if not relocate:
            return QuickApplyResponse(
                success=True,
                fit="not_a_fit",
                message="תודה על השיחה! כרגע אנחנו מגייסים לעבודה באילת. אם זה יהיה רלוונטי בעתיד, נשמח לשמוע ממך!",
            )

        # Disqualify vague start date
        if start_date == "not_sure":
            return QuickApplyResponse(
                success=True,
                fit="not_a_fit",
                message="תודה על השיחה! כשתדע/י מתי את/ה יכול/ה להגיע, חזור/י אלינו ונסדר הכל.",
            )

        # Match jobs
        field = normalize_field(field_raw) or field_raw
        jobs = match_jobs(field)

        # Score CV match if transcript contained skills info
        if jobs and cv_text.strip():
            jobs = await score_cv_match(cv_text, jobs)

        # Build success message
        if jobs:
            job_mentions = " ו".join(
                f"{j['title']} ב{j['employer']}" for j in jobs[:2]
            )
            message = (
                f"מעולה {name}! יש לנו כרגע {job_mentions} — "
                "המגייס/ת שלנו יצור/תיצור איתך קשר בקרוב לסגור פרטים. להתראות באילת!"
            )
        else:
            message = (
                f"תודה {name}! קיבלנו את הפרטים. "
                "המגייס/ת שלנו יצור/תיצור איתך קשר בקרוב לסגור פרטים. להתראות באילת!"
            )

        # Save to CRM
        if phone:
            await save_lead_to_supabase(
                name=name,
                phone=phone,
                desired_role=field,
                location="אילת",
            )

        return QuickApplyResponse(
            success=True,
            fit="good_fit",
            message=message,
            matched_jobs=jobs if jobs else None,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
