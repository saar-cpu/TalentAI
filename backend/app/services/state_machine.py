"""Lead Status State Machine — Server-side validation.

Mirrors the frontend stateMachine.ts. This is the authoritative enforcement
layer — the frontend validates for UX, the backend validates for security.
"""

import logging

logger = logging.getLogger(__name__)

LEAD_STATUSES = [
    "NEW_LEAD",
    "CONTACTED",
    "SCREENING_IN_PROGRESS",
    "FIT_FOR_INTERVIEW",
    "INTERVIEW_BOOKED",
    "ARRIVED",
    "HIRED",
    "STARTED",
    "NO_SHOW",
    "REJECTED",
    "LOST_CONTACT",
]

ALLOWED_TRANSITIONS: dict[str, list[str]] = {
    "NEW_LEAD": ["CONTACTED", "REJECTED", "LOST_CONTACT"],
    "CONTACTED": ["SCREENING_IN_PROGRESS", "REJECTED", "LOST_CONTACT"],
    "SCREENING_IN_PROGRESS": ["FIT_FOR_INTERVIEW", "REJECTED", "LOST_CONTACT"],
    "FIT_FOR_INTERVIEW": ["INTERVIEW_BOOKED", "REJECTED", "LOST_CONTACT"],
    "INTERVIEW_BOOKED": ["ARRIVED", "NO_SHOW", "REJECTED", "LOST_CONTACT"],
    "ARRIVED": ["HIRED", "REJECTED", "LOST_CONTACT"],
    "HIRED": ["STARTED", "REJECTED", "LOST_CONTACT"],
    "STARTED": [],
    "NO_SHOW": ["CONTACTED", "REJECTED", "LOST_CONTACT"],
    "REJECTED": [],
    "LOST_CONTACT": ["CONTACTED"],
}

STATUS_LABELS: dict[str, str] = {
    "NEW_LEAD": "ליד חדש",
    "CONTACTED": "נוצר קשר",
    "SCREENING_IN_PROGRESS": "בסינון",
    "FIT_FOR_INTERVIEW": "מתאים לראיון",
    "INTERVIEW_BOOKED": "ראיון נקבע",
    "ARRIVED": "הגיע לראיון",
    "HIRED": "התקבל",
    "STARTED": "התחיל לעבוד",
    "NO_SHOW": "לא הגיע",
    "REJECTED": "נדחה",
    "LOST_CONTACT": "אבד קשר",
}


class TransitionError(Exception):
    """Raised when a status transition is illegal."""

    pass


def validate_transition(
    current_status: str,
    new_status: str,
    screening_score: int | None = None,
    human_approved: bool = False,
) -> None:
    """Validate a status transition. Raises TransitionError if illegal."""
    if new_status not in LEAD_STATUSES:
        raise TransitionError(f"סטטוס לא חוקי: {new_status}")

    if current_status == new_status:
        raise TransitionError(
            f'הליד כבר בסטטוס "{STATUS_LABELS.get(current_status, current_status)}"'
        )

    allowed = ALLOWED_TRANSITIONS.get(current_status, [])
    if new_status not in allowed:
        cur_label = STATUS_LABELS.get(current_status, current_status)
        new_label = STATUS_LABELS.get(new_status, new_status)
        raise TransitionError(f'מעבר לא חוקי: "{cur_label}" → "{new_label}"')

    # Guardrails
    if new_status == "FIT_FOR_INTERVIEW":
        if screening_score is None or screening_score <= 0:
            raise TransitionError(
                'לא ניתן להעביר ל"מתאים לראיון" ללא ציון סינון (screening_score)'
            )

    if new_status == "HIRED":
        if not human_approved:
            raise TransitionError(
                'לא ניתן להעביר ל"התקבל" ללא אישור ידני (human_approved)'
            )

    logger.info(
        "Transition validated: %s → %s",
        current_status,
        new_status,
    )
