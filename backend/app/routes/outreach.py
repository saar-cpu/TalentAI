from fastapi import APIRouter, HTTPException

from app.models.schemas import OutreachRequest, OutreachSequence
from app.services.outreach_agent import generate_outreach_sequence

router = APIRouter()


@router.post("/generate-outreach", response_model=OutreachSequence)
async def generate_outreach(request: OutreachRequest):
    try:
        sequence = await generate_outreach_sequence(
            candidate=request.candidate_profile,
            job_description=request.job_description,
        )
        return sequence
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
