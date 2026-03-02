import type {
  FbPostResponse,
  Lead,
  LeadsResponse,
  PersonalizedLandingData,
  QuickApplyRequest,
  QuickApplyResponse,
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
    matchedJobs: raw.matched_jobs ?? null,
  };
}

export async function submitQuickApply(
  request: QuickApplyRequest
): Promise<QuickApplyResponse> {
  const res = await fetch(`${API_BASE}/quick-apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: request.name,
      phone: request.phone,
      relocate: request.relocate,
      housing: request.housing,
      field: request.field,
      start_date: request.startDate,
      cv_text: request.cvText || "",
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail ?? `Quick apply failed: ${res.status}`;
    throw new Error(detail);
  }

  const raw = await res.json();

  return {
    success: raw.success,
    fit: raw.fit,
    message: raw.message,
    matchedJobs: raw.matched_jobs ?? null,
  };
}

export async function submitVoiceApply(
  transcript: string
): Promise<QuickApplyResponse> {
  const res = await fetch(`${API_BASE}/voice-apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail ?? `Voice apply failed: ${res.status}`;
    throw new Error(detail);
  }

  const raw = await res.json();

  return {
    success: raw.success,
    fit: raw.fit,
    message: raw.message,
    matchedJobs: raw.matched_jobs ?? null,
  };
}

export async function analyzeFbPost(postText: string): Promise<FbPostResponse> {
  const res = await fetch(`${API_BASE}/analyze-fb-post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ post_text: postText }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail ?? `FB analysis failed: ${res.status}`;
    throw new Error(detail);
  }

  const raw = await res.json();

  return {
    isRelevant: raw.is_relevant,
    response: raw.response,
  };
}

export async function fetchLeads(
  limit = 50,
  offset = 0,
  status?: string
): Promise<LeadsResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (status) params.set("status", status);

  const res = await fetch(`${API_BASE}/leads?${params}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail ?? `Failed to fetch leads: ${res.status}`;
    throw new Error(detail);
  }

  const raw = await res.json();

  return {
    leads: raw.leads.map(
      (l: Record<string, unknown>): Lead => ({
        id: l.id as string,
        name: l.name as string,
        phone: l.phone as string,
        jobTitle: (l.job_title as string) ?? null,
        location: (l.location as string) ?? null,
        source: (l.source as string) ?? null,
        status: (l.status as string) ?? "NEW_LEAD",
        recruitmentStatus: (l.recruitment_status as string) ?? null,
        leadSource: (l.lead_source as string) ?? null,
        screeningScore: (l.screening_score as number) ?? null,
        humanApproved: (l.human_approved as boolean) ?? false,
        createdAt: l.created_at as string,
      })
    ),
    count: raw.count,
  };
}

export async function updateLead(
  leadId: string,
  data: { leadSource?: string }
): Promise<void> {
  const body: Record<string, string> = {};
  if (data.leadSource !== undefined) body.lead_source = data.leadSource;

  const res = await fetch(`${API_BASE}/leads/${leadId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const raw = await res.json().catch(() => null);
    throw new Error(raw?.detail ?? `Failed to update lead: ${res.status}`);
  }
}

export interface TransitionResult {
  success: boolean;
  lead_id: string;
  previous_status: string;
  new_status: string;
}

export async function changeLeadStatus(
  leadId: string,
  newStatus: string,
  changedBy: string = "dashboard_user",
  notes?: string
): Promise<TransitionResult> {
  const res = await fetch(`${API_BASE}/leads/${leadId}/transition`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      new_status: newStatus,
      changed_by: changedBy,
      notes: notes ?? null,
    }),
  });

  if (!res.ok) {
    const raw = await res.json().catch(() => null);
    throw new Error(raw?.detail ?? `Status transition failed: ${res.status}`);
  }

  return res.json();
}
