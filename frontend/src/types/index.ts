export interface CandidateProfile {
  id: string;
  name: string;
  headline: string;
  skills: string[];
  experienceLevel: "junior" | "mid" | "senior" | "lead" | "executive";
  yearsOfExperience: number;
  interests: string[];
  currentRole?: string;
  currentCompany?: string;
  location?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  benefits: string[];
  location: string;
  salaryRange?: string;
}

export interface PersonalizedLandingData {
  jobId: string;
  candidateId: string;
  headline: string;
  subheadline: string;
  whyYouFit: string[];
  personalizedBenefits: string[];
  callToAction: string;
  tone: string;
}

export interface OutreachSequence {
  candidateId: string;
  jobId: string;
  steps: OutreachStep[];
}

export interface OutreachStep {
  stepNumber: number;
  channel: "email" | "linkedin";
  subject?: string;
  body: string;
  sendAfterDays: number;
}

export interface EngagementEvent {
  candidateId: string;
  jobId: string;
  eventType: "page_view" | "click" | "apply" | "reply";
  timestamp: string;
  metadata?: Record<string, unknown>;
}
