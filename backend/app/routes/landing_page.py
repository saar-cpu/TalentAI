from fastapi import APIRouter, HTTPException

from app.models.schemas import LandingPageData
from app.services.landing_page import generate_landing_page

router = APIRouter()


@router.get("/landing-page/{job_id}/{candidate_id}", response_model=LandingPageData)
async def get_landing_page(job_id: str, candidate_id: str):
    try:
        data = await generate_landing_page(job_id, candidate_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
