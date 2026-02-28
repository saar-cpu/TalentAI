import logging

from fastapi import APIRouter, HTTPException

from app.services.crm import _get_supabase

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/leads")
async def list_leads(limit: int = 50, offset: int = 0, status: str | None = None):
    client = _get_supabase()
    if client is None:
        raise HTTPException(status_code=503, detail="Supabase not configured")

    try:
        query = (
            client.table("leads")
            .select("id,name,phone,job_title,location,source,status,recruitment_status,created_at")
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
        )
        if status:
            query = query.eq("status", status)

        result = query.execute()
        return {"leads": result.data, "count": len(result.data)}
    except Exception as e:
        logger.error("Failed to fetch leads: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/leads/{lead_id}")
async def get_lead(lead_id: str):
    client = _get_supabase()
    if client is None:
        raise HTTPException(status_code=503, detail="Supabase not configured")

    try:
        result = client.table("leads").select("*").eq("id", lead_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Lead not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to fetch lead %s: %s", lead_id, e)
        raise HTTPException(status_code=500, detail=str(e))
