import logging
from datetime import datetime, timezone

from app.config import settings

logger = logging.getLogger(__name__)

# Lazy-initialized Supabase client
_supabase_client = None


def _get_supabase():
    """Return a cached Supabase client, or None if not configured."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    if not settings.supabase_url or not settings.supabase_key:
        return None
    from supabase import create_client
    _supabase_client = create_client(settings.supabase_url, settings.supabase_key)
    return _supabase_client


async def save_lead_to_supabase(
    name: str | None,
    phone: str,
    desired_role: str | None = None,
    location: str | None = None,
    start_date: str | None = None,
    needs_housing: bool | None = None,
    source: str = "whatsapp_screening",
) -> bool:
    """Insert a qualified lead into the Supabase `leads` table.

    Returns True on success, False on failure (never raises).
    Falls back to logging if Supabase is not configured.
    """
    lead_data = {
        "name": name or "לא צוין",
        "phone": phone,
        "desired_role": desired_role,
        "location": location or "אילת",
        "start_date": start_date,
        "needs_housing": needs_housing,
        "source": source,
        "status": "New Lead",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    client = _get_supabase()
    if client is None:
        logger.warning(
            "Supabase not configured — lead NOT saved: %s (%s). "
            "Set SUPABASE_URL and SUPABASE_KEY in .env",
            name, phone,
        )
        return False

    try:
        result = client.table("leads").insert(lead_data).execute()
        logger.info("Lead saved to Supabase: %s (%s) → id=%s", name, phone, result.data)
        return True
    except Exception as e:
        logger.error("Failed to save lead to Supabase: %s", e)
        return False
