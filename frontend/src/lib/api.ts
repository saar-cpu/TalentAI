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
  return res.json();
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
