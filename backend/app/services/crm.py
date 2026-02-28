import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


async def send_lead_to_crm(
    name: str | None,
    phone: str,
    field_of_interest: str | None = None,
    location: str | None = None,
    start_date: str | None = None,
    needs_housing: bool | None = None,
    source: str = "whatsapp_screening",
) -> bool:
    """Push a qualified lead to the external CRM.

    Returns True on success, False on failure (never raises).
    """
    payload = {
        "name": name or "לא צוין",
        "phone": phone,
        "field_of_interest": field_of_interest,
        "location": location or "אילת",
        "start_date": start_date,
        "needs_housing": needs_housing,
        "source": source,
        "status": "new",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                settings.crm_api_url,
                json=payload,
            )
            resp.raise_for_status()
            logger.info("Lead sent to CRM: %s (%s)", name, phone)
            return True
    except Exception as e:
        logger.error("Failed to send lead to CRM: %s", e)
        return False
