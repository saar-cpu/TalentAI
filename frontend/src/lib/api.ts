import type { PersonalizedLandingData, OutreachSequence } from "@/types";

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
  candidateProfile: Record<string, unknown>,
  jobDescription: string
): Promise<OutreachSequence> {
  const res = await fetch(`${API_BASE}/generate-outreach`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      candidate_profile: candidateProfile,
      job_description: jobDescription,
    }),
  });
  if (!res.ok) throw new Error(`Outreach generation failed: ${res.status}`);
  return res.json();
}
