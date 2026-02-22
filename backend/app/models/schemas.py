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


class OutreachRequest(BaseModel):
    candidate_profile: CandidateProfile
    job_description: str


class OutreachStep(BaseModel):
    step_number: int
    channel: str  # email | linkedin
    subject: str | None = None
    body: str
    send_after_days: int


class OutreachSequence(BaseModel):
    candidate_id: str
    job_id: str
    steps: list[OutreachStep]


class LandingPageData(BaseModel):
    job_id: str
    candidate_id: str
    headline: str
    subheadline: str
    why_you_fit: list[str]
    personalized_benefits: list[str]
    call_to_action: str
    tone: str
