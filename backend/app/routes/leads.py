import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.crm import _get_supabase
from app.services.state_machine import validate_transition, TransitionError

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
            .select("id,name,phone,job_title,location,source,status,recruitment_status,lead_source,screening_score,human_approved,created_at")
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


class TransitionRequest(BaseModel):
    new_status: str
    changed_by: str = "system"
    notes: str | None = None


@router.post("/leads/{lead_id}/transition")
async def transition_lead(lead_id: str, req: TransitionRequest):
    """Transition a lead to a new status using strict state machine rules.

    Validates the transition, updates the lead, and logs to status history.
    """
    client = _get_supabase()
    if client is None:
        raise HTTPException(status_code=503, detail="Supabase not configured")

    # Fetch current lead
    try:
        result = client.table("leads").select("*").eq("id", lead_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Lead not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    lead = result.data[0]
    current_status = lead["status"]

    # Validate transition (raises TransitionError if illegal)
    try:
        validate_transition(
            current_status=current_status,
            new_status=req.new_status,
            screening_score=lead.get("screening_score"),
            human_approved=lead.get("human_approved", False),
        )
    except TransitionError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Update lead status
    try:
        client.table("leads").update({"status": req.new_status}).eq("id", lead_id).execute()
    except Exception as e:
        logger.error("Failed to update lead status %s: %s", lead_id, e)
        raise HTTPException(status_code=500, detail=str(e))

    # Insert into status history
    try:
        client.table("lead_status_history").insert({
            "lead_id": lead_id,
            "previous_status": current_status,
            "new_status": req.new_status,
            "changed_by": req.changed_by,
            "notes": req.notes,
        }).execute()
    except Exception as e:
        # Log but don't fail — the status change already succeeded
        logger.error("Failed to log status history for %s: %s", lead_id, e)

    return {
        "success": True,
        "lead_id": lead_id,
        "previous_status": current_status,
        "new_status": req.new_status,
    }


@router.patch("/leads/{lead_id}")
async def update_lead(lead_id: str, body: dict):
    client = _get_supabase()
    if client is None:
        raise HTTPException(status_code=503, detail="Supabase not configured")

    allowed_fields = {"lead_source", "recruitment_status", "screening_score", "human_approved"}
    update_data = {k: v for k, v in body.items() if k in allowed_fields}
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    try:
        result = client.table("leads").update(update_data).eq("id", lead_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Lead not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update lead %s: %s", lead_id, e)
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
