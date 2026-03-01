from pydantic import BaseModel


class CandidateProfile(BaseModel):
    id: str
    name: str
    headline: str
    skills: list[str]
    experience_level: str  # junior | mid | senior | lead | executive
    years_of_experience: int
    interests: list[str]
    current_role: str | None = None
    current_company: str | None = None
    location: str | None = None


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ScreeningChatRequest(BaseModel):
    chat_history: list[ChatMessage] = []
    latest_message: str
    candidate_name: str | None = None
    job_title: str
    location: str | None = None


class ScreeningChatResponse(BaseModel):
    reply: str
    screening_complete: bool
    candidate_fit: str | None = None  # "good_fit" | "not_a_fit" | null
    matched_jobs: list[dict] | None = None


class QuickApplyRequest(BaseModel):
    name: str
    phone: str
    relocate: bool
    housing: str  # "need" | "have" | "flexible"
    field: str  # מלונאות | מכירות | אבטחה | מסעדנות | תחנות דלק | אחר
    start_date: str  # "this_week" | "two_weeks" | "this_month" | "not_sure"
    cv_text: str = ""  # Optional free-text CV/skills for match scoring


class QuickApplyResponse(BaseModel):
    success: bool
    fit: str  # "good_fit" | "not_a_fit"
    message: str
    matched_jobs: list[dict] | None = None


class FbPostRequest(BaseModel):
    post_text: str


class FbPostResponse(BaseModel):
    is_relevant: bool
    response: str


class LandingPageData(BaseModel):
    job_id: str
    candidate_id: str
    headline: str
    subheadline: str
    why_you_fit: list[str]
    personalized_benefits: list[str]
    call_to_action: str
    tone: str
