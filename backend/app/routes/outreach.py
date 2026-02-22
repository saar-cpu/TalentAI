from fastapi import APIRouter, HTTPException

from app.models.schemas import ScreeningChatRequest, ScreeningChatResponse
from app.services.outreach_agent import screen_candidate

router = APIRouter()


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
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
