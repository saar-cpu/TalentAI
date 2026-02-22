import type {
  PersonalizedLandingData,
  OutreachSequence,
  CandidateProfile,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchLandingPageData(
  jobId: string,
  candidateId: string
): Promise<PersonalizedLandingData> {
  const res = await fetch(
    `${API_BASE}/landing-page/${jobId}/${candidateId}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`Failed to fetch landing data: ${res.status}`);
  const raw = await res.json();

  // Backend returns snake_case; map to camelCase for the frontend
  return {
    jobId: raw.job_id,
    candidateId: raw.candidate_id,
    headline: raw.headline,
    subheadline: raw.subheadline,
    whyYouFit: raw.why_you_fit,
    personalizedBenefits: raw.personalized_benefits,
    callToAction: raw.call_to_action,
    tone: raw.tone,
  };
}

export async function generateOutreach(
  candidateProfile: CandidateProfile,
  jobDescription: string
): Promise<OutreachSequence> {
  const res = await fetch(`${API_BASE}/generate-outreach`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      candidate_profile: {
        id: candidateProfile.id,
        name: candidateProfile.name,
        headline: candidateProfile.headline,
        skills: candidateProfile.skills,
        experience_level: candidateProfile.experienceLevel,
        years_of_experience: candidateProfile.yearsOfExperience,
        interests: candidateProfile.interests,
        current_role: candidateProfile.currentRole ?? null,
        current_company: candidateProfile.currentCompany ?? null,
        location: candidateProfile.location ?? null,
      },
      job_description: jobDescription,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail ?? `Outreach generation failed: ${res.status}`;
    throw new Error(detail);
  }

  const raw = await res.json();

  // Backend returns snake_case; map to camelCase
  return {
    candidateId: raw.candidate_id,
    jobId: raw.job_id,
    steps: raw.steps.map(
      (s: { step_number: number; channel: string; subject?: string; body: string; send_after_days: number }) => ({
        stepNumber: s.step_number,
        channel: s.channel,
        subject: s.subject,
        body: s.body,
        sendAfterDays: s.send_after_days,
      })
    ),
  };
}
