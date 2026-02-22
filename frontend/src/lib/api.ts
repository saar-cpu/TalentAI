import type {
  PersonalizedLandingData,
  ScreeningChatRequest,
  ScreeningChatResponse,
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

export async function sendScreeningMessage(
  request: ScreeningChatRequest
): Promise<ScreeningChatResponse> {
  const res = await fetch(`${API_BASE}/screen`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_history: request.chatHistory.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      latest_message: request.latestMessage,
      candidate_name: request.candidateName ?? null,
      job_title: request.jobTitle,
      location: request.location ?? null,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail ?? `Screening request failed: ${res.status}`;
    throw new Error(detail);
  }

  const raw = await res.json();

  return {
    reply: raw.reply,
    screeningComplete: raw.screening_complete,
    candidateFit: raw.candidate_fit,
  };
}
