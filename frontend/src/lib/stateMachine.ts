// ─── Lead Status State Machine ────────────────────────────────────────────────
// Strict, deterministic state machine for lead lifecycle management.
// Every status transition must be validated here BEFORE hitting the DB.
// This file is the single source of truth for transition rules.

export const LEAD_STATUSES = [
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
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

// ─── Hebrew Labels (for UI display) ──────────────────────────────────────────

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW_LEAD: "ליד חדש",
  CONTACTED: "נוצר קשר",
  SCREENING_IN_PROGRESS: "בסינון",
  FIT_FOR_INTERVIEW: "מתאים לראיון",
  INTERVIEW_BOOKED: "ראיון נקבע",
  ARRIVED: "הגיע לראיון",
  HIRED: "התקבל",
  STARTED: "התחיל לעבוד",
  NO_SHOW: "לא הגיע",
  REJECTED: "נדחה",
  LOST_CONTACT: "אבד קשר",
};

// ─── Visual Config (for Kanban columns & badges) ─────────────────────────────

export const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW_LEAD: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  CONTACTED: "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300",
  SCREENING_IN_PROGRESS: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
  FIT_FOR_INTERVIEW: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
  INTERVIEW_BOOKED: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300",
  ARRIVED: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
  HIRED: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
  STARTED: "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300",
  NO_SHOW: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
  REJECTED: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
  LOST_CONTACT: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
};

// ─── Transition Rules ────────────────────────────────────────────────────────
// Defines which statuses each status can transition TO.
// If a transition is not listed here, it is ILLEGAL.

export const ALLOWED_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW_LEAD: ["CONTACTED", "REJECTED", "LOST_CONTACT"],
  CONTACTED: ["SCREENING_IN_PROGRESS", "REJECTED", "LOST_CONTACT"],
  SCREENING_IN_PROGRESS: ["FIT_FOR_INTERVIEW", "REJECTED", "LOST_CONTACT"],
  FIT_FOR_INTERVIEW: ["INTERVIEW_BOOKED", "REJECTED", "LOST_CONTACT"],
  INTERVIEW_BOOKED: ["ARRIVED", "NO_SHOW", "REJECTED", "LOST_CONTACT"],
  ARRIVED: ["HIRED", "REJECTED", "LOST_CONTACT"],
  HIRED: ["STARTED", "REJECTED", "LOST_CONTACT"],
  STARTED: [],  // Terminal state
  NO_SHOW: ["CONTACTED", "REJECTED", "LOST_CONTACT"],  // Can re-engage
  REJECTED: [],  // Terminal state
  LOST_CONTACT: ["CONTACTED"],  // Can re-engage if they respond
};

// ─── Guardrail Conditions ────────────────────────────────────────────────────
// Extra conditions that must be met for certain transitions.
// The lead data is checked against these before allowing the move.

export interface LeadGuardData {
  screeningScore?: number | null;
  humanApproved?: boolean;
}

interface GuardrailRule {
  check: (data: LeadGuardData) => boolean;
  errorMessage: string;
}

const GUARDRAILS: Partial<Record<LeadStatus, GuardrailRule>> = {
  FIT_FOR_INTERVIEW: {
    check: (data) => data.screeningScore != null && data.screeningScore > 0,
    errorMessage: "לא ניתן להעביר ל״מתאים לראיון״ ללא ציון סינון (screening_score)",
  },
  HIRED: {
    check: (data) => data.humanApproved === true,
    errorMessage: "לא ניתן להעביר ל״התקבל״ ללא אישור ידני (human_approved)",
  },
};

// ─── Validation ──────────────────────────────────────────────────────────────

export interface TransitionResult {
  valid: boolean;
  error?: string;
}

export function validateTransition(
  currentStatus: LeadStatus,
  newStatus: LeadStatus,
  guardData: LeadGuardData = {}
): TransitionResult {
  // Rule 1: No self-transition
  if (currentStatus === newStatus) {
    return { valid: false, error: `הליד כבר בסטטוס "${STATUS_LABELS[currentStatus]}"` };
  }

  // Rule 2: Transition must be in allowed list
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed.includes(newStatus)) {
    return {
      valid: false,
      error: `מעבר לא חוקי: "${STATUS_LABELS[currentStatus]}" → "${STATUS_LABELS[newStatus]}"`,
    };
  }

  // Rule 3: Guardrail conditions
  const guardrail = GUARDRAILS[newStatus];
  if (guardrail && !guardrail.check(guardData)) {
    return { valid: false, error: guardrail.errorMessage };
  }

  return { valid: true };
}

export function isLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUSES.includes(value as LeadStatus);
}

// ─── Kanban Column Order (for the board) ─────────────────────────────────────
// The "happy path" pipeline columns shown left-to-right.
// REJECTED and LOST_CONTACT are side-statuses, not displayed as main columns.

export const KANBAN_COLUMNS: LeadStatus[] = [
  "NEW_LEAD",
  "CONTACTED",
  "SCREENING_IN_PROGRESS",
  "FIT_FOR_INTERVIEW",
  "INTERVIEW_BOOKED",
  "ARRIVED",
  "HIRED",
  "STARTED",
];
