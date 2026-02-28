from fastapi import APIRouter, HTTPException

from app.models.schemas import FbPostRequest, FbPostResponse
from app.services.fb_hunter_agent import analyze_fb_post

router = APIRouter()


@router.post("/analyze-fb-post", response_model=FbPostResponse)
async def analyze_post(request: FbPostRequest):
    try:
        return await analyze_fb_post(post_text=request.post_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
