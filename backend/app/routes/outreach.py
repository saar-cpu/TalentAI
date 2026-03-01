import re

from fastapi import APIRouter, HTTPException

from app.models.schemas import ScreeningChatRequest, ScreeningChatResponse
from app.services.crm import save_lead_to_supabase
from app.services.outreach_agent import screen_candidate, extract_field_from_history

router = APIRouter()


def _extract_phone(text: str) -> str | None:
    """Try to pull an Israeli phone number from the message."""
    match = re.search(r"[\d\-+()]{7,}", text)
    return match.group(0) if match else None


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

        # On successful screening, save lead to Supabase
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

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
