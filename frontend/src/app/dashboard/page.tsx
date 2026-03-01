"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import type { Lead, MatchedJob } from "@/types";
import { fetchLeads } from "@/lib/api";
import { Skeleton } from "@/components/Skeleton";

// ─── Types ───────────────────────────────────────────────────────────────────

type TabKey = "employer" | "candidate";
type SortKey = "matchScore" | "createdAt";
type SortDir = "asc" | "desc";

interface AugmentedLead extends Lead {
  channel: "quick_apply" | "chat" | "voice";
  matchScore: number;
  matchedField: string;
  candidateNotes?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  "חדש": "bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300",
  "מעקב": "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300",
  "New Lead": "bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300",
  active: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
  closed: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
};

const CHANNEL_CONFIG: Record<string, { label: string; className: string }> = {
  quick_apply: {
    label: "טופס מהיר",
    className: "bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300",
  },
  chat: {
    label: "צ׳אט",
    className: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
  },
  voice: {
    label: "שיחה קולית",
    className: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
  },
};

const MOCK_RECOMMENDED_JOBS: MatchedJob[] = [
  { id: "h1", title: "פקיד/ת קבלה", field: "מלונאות", employer: "רויאל ביץ׳ אילת", salary_range: "6,500–8,000 ₪", housing: true, urgency: "now", match_score: 94 },
  { id: "f1", title: "טבח/ית", field: "מסעדנות", employer: "מסעדת לה קוצ׳ינה", salary_range: "7,000–9,000 ₪", housing: true, urgency: "now", match_score: 87 },
  { id: "s1", title: "מאבטח/ת", field: "אבטחה", employer: "מלון ישרוטל", salary_range: "7,000–9,000 ₪", housing: true, urgency: "now", match_score: 82 },
  { id: "r1", title: "מוכר/ת בחנות", field: "קמעונאות", employer: "מתחם Ice Mall", salary_range: "6,000–7,500 ₪", housing: true, urgency: "now", match_score: 78 },
  { id: "f3", title: "ברמן/ית", field: "מסעדנות", employer: "ביץ׳ בר אילת", salary_range: "6,500–8,500 ₪", housing: true, urgency: "this_week", match_score: 75 },
  { id: "g1", title: "עובד/ת תחנת דלק", field: "תחנות דלק", employer: "פז אילת", salary_range: "6,000–7,000 ₪", housing: true, urgency: "this_week", match_score: 70 },
];

const MOCK_CANDIDATE_STEPS = [
  { key: "submitted", label: "הוגשה מועמדות", date: "28 בפבר 2026", done: true },
  { key: "in_review", label: "בסינון AI", date: "28 בפבר 2026", done: true },
  { key: "matched", label: "הותאמו משרות", date: "1 במרץ 2026", done: true },
  { key: "hired", label: "גויסת!", date: null, done: false },
];
const MOCK_CURRENT_STEP = 2;

const CANDIDATE_NOTES = [
  "שירות צבאי קרבי, מוכן להתחיל מיד",
  "ניסיון שנתיים במלונאות, אנגלית שוטפת",
  "בוגר קורס אבטחה, רישיון נהיגה",
  "ניסיון בבישול, גמיש בשעות",
  "ניסיון במכירות קמעונאיות, יעדים גבוהים",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function augmentLead(lead: Lead, index: number): AugmentedLead {
  const channels: Array<"quick_apply" | "chat" | "voice"> = ["quick_apply", "chat", "voice"];
  const channel =
    lead.source === "whatsapp_screening"
      ? "chat"
      : lead.source === "website"
      ? "quick_apply"
      : channels[index % 3];

  const hash = lead.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const matchScore = 60 + (hash % 39);

  const fields = ["מלונאות", "קמעונאות", "אבטחה", "מסעדנות", "תחנות דלק"];
  const matchedField = lead.jobTitle
    ? fields.find((f) => lead.jobTitle!.includes(f)) || fields[index % fields.length]
    : fields[index % fields.length];

  return {
    ...lead,
    channel,
    matchScore,
    matchedField,
    candidateNotes: CANDIDATE_NOTES[index % CANDIDATE_NOTES.length],
  };
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("employer");
  const [statusFilter, setStatusFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("matchScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLeads(100, 0, statusFilter || undefined);
      setLeads(res.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בטעינת לידים");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const augmentedLeads = useMemo(
    () => leads.map((l, i) => augmentLead(l, i)),
    [leads]
  );

  const displayedLeads = useMemo(() => {
    let result = [...augmentedLeads];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.matchedField?.toLowerCase().includes(q)
      );
    }

    if (channelFilter) {
      result = result.filter((l) => l.channel === channelFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "matchScore") cmp = a.matchScore - b.matchScore;
      else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [augmentedLeads, searchQuery, channelFilter, sortKey, sortDir]);

  const stats = useMemo(() => {
    const total = augmentedLeads.length;
    const avgScore = total
      ? Math.round(augmentedLeads.reduce((s, l) => s + l.matchScore, 0) / total)
      : 0;
    const quickApply = augmentedLeads.filter((l) => l.channel === "quick_apply").length;
    const voice = augmentedLeads.filter((l) => l.channel === "voice").length;
    return { total, avgScore, quickApply, voice };
  }, [augmentedLeads]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const isInitialLoad = loading && !leads.length;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            {/* Left: title */}
            <div className="min-w-0">
              <a href="/" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                &rarr; חזרה לדף הראשי
              </a>
              <h1 className="mt-1 text-2xl font-bold text-brand-900 dark:text-white truncate">
                לוח בקרה
              </h1>
            </div>

            {/* Center: tabs */}
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              {([
                { key: "employer" as TabKey, label: "מעסיקים" },
                { key: "candidate" as TabKey, label: "מועמדים" },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative rounded-md px-5 py-2 text-sm font-semibold transition-colors ${
                    activeTab === tab.key
                      ? "text-brand-700 dark:text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-0 rounded-md bg-white dark:bg-slate-700 shadow-sm"
                      transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Right: refresh */}
            <button
              onClick={loadLeads}
              disabled={loading}
              className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {loading ? "טוען..." : "רענן"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "employer" ? (
            <motion.div
              key="employer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {isInitialLoad ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm space-y-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))
                ) : (
                  <>
                    <EnhancedStatCard label="סה״כ מועמדים" value={stats.total} color="bg-brand-600" icon="users" />
                    <EnhancedStatCard label="ציון התאמה ממוצע" value={stats.avgScore} color="bg-green-500" icon="chart" suffix="%" />
                    <EnhancedStatCard label="טופס מהיר" value={stats.quickApply} color="bg-brand-500" icon="form" />
                    <EnhancedStatCard label="שיחה קולית" value={stats.voice} color="bg-purple-500" icon="voice" />
                  </>
                )}
              </div>

              {/* Filters */}
              <div className="mt-4">
                {isInitialLoad ? (
                  <div className="flex flex-wrap gap-3">
                    <Skeleton className="flex-1 min-w-[200px] h-10 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <input
                      type="text"
                      placeholder="חיפוש לפי שם, טלפון, תחום..."
                      className="flex-1 min-w-[200px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                      className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">כל הסטטוסים</option>
                      <option value="חדש">חדש</option>
                      <option value="מעקב">מעקב</option>
                      <option value="New Lead">New Lead</option>
                    </select>
                    <select
                      className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      value={channelFilter}
                      onChange={(e) => setChannelFilter(e.target.value)}
                    >
                      <option value="">כל הערוצים</option>
                      <option value="quick_apply">טופס מהיר</option>
                      <option value="chat">צ׳אט</option>
                      <option value="voice">שיחה קולית</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* Table */}
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                        <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">שם</th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">טלפון</th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">תחום</th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">ערוץ</th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">סטטוס</th>
                        <SortableHeader label="התאמה" sortKey="matchScore" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                        <SortableHeader label="תאריך" sortKey="createdAt" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                      </tr>
                    </thead>
                    <tbody>
                      {isInitialLoad ? (
                        Array.from({ length: 7 }).map((_, i) => (
                          <tr key={i} className="border-b border-slate-50 dark:border-slate-700">
                            <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-5 w-14 rounded-full" /></td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Skeleton className="h-2 w-20 rounded-full" />
                                <Skeleton className="h-4 w-8" />
                              </div>
                            </td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                          </tr>
                        ))
                      ) : displayedLeads.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">
                            {searchQuery || channelFilter ? "לא נמצאו תוצאות" : "אין מועמדים עדיין"}
                          </td>
                        </tr>
                      ) : (
                        displayedLeads.map((lead, i) => (
                          <LeadRow
                            key={lead.id}
                            lead={lead}
                            index={i}
                            expanded={expandedId === lead.id}
                            onToggle={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {displayedLeads.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 text-xs text-slate-500 dark:text-slate-400">
                    מציג {displayedLeads.length} מתוך {augmentedLeads.length} מועמדים
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="candidate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CandidateView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function EnhancedStatCard({
  label,
  value,
  color,
  icon,
  suffix,
}: {
  label: string;
  value: number;
  color: string;
  icon: "users" | "chart" | "form" | "voice";
  suffix?: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    users: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    chart: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    form: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    voice: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
    >
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white`}>
        {icons[icon]}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
        {value}{suffix}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </motion.div>
  );
}

function SortableHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const isActive = currentSort === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <svg
          className={`h-3.5 w-3.5 transition-transform ${isActive ? "text-brand-500" : "text-slate-300 dark:text-slate-600"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          {isActive && currentDir === "asc" ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          )}
        </svg>
      </span>
    </th>
  );
}

function MatchScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            score >= 85 ? "bg-green-500" : score >= 70 ? "bg-yellow-500" : "bg-orange-400"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-8 text-start" dir="ltr">
        {score}%
      </span>
    </div>
  );
}

function LeadRow({
  lead,
  index,
  expanded,
  onToggle,
}: {
  lead: AugmentedLead;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const ch = CHANNEL_CONFIG[lead.channel];
  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: Math.min(index * 0.03, 0.6) }}
        onClick={onToggle}
        className="border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
      >
        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{lead.name}</td>
        <td className="px-4 py-3 text-slate-600 dark:text-slate-400" dir="ltr">{lead.phone}</td>
        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{lead.matchedField}</td>
        <td className="px-4 py-3">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ch.className}`}>
            {ch.label}
          </span>
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              STATUS_COLORS[lead.status ?? ""] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            {lead.status || "—"}
          </span>
        </td>
        <td className="px-4 py-3">
          <MatchScoreBar score={lead.matchScore} />
        </td>
        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
          {formatDate(lead.createdAt)}
        </td>
      </motion.tr>

      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <td colSpan={7} className="px-2 py-2">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">פרטי מועמד</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">הערות:</span> {lead.candidateNotes}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">מיקום:</span> {lead.location || "אילת"}
                    </p>
                    <a
                      href={`tel:${lead.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      התקשרו: {lead.phone}
                    </a>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">ציון התאמה</h4>
                    <div className="flex items-center gap-3">
                      <div className="h-3 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className={`h-3 rounded-full ${
                            lead.matchScore >= 85 ? "bg-green-500" : lead.matchScore >= 70 ? "bg-yellow-500" : "bg-orange-400"
                          }`}
                          style={{ width: `${lead.matchScore}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{lead.matchScore}%</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">תחום:</span> {lead.matchedField}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">ערוץ:</span> {CHANNEL_CONFIG[lead.channel].label}
                    </p>
                  </div>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Candidate View ──────────────────────────────────────────────────────────

function CandidateView() {
  const jobsRef = useRef<HTMLDivElement>(null);
  const jobsInView = useInView(jobsRef, { once: true, margin: "-50px" });

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">סטטוס המועמדות שלך</h2>

        {/* Desktop timeline */}
        <div className="hidden sm:flex items-start justify-between">
          {MOCK_CANDIDATE_STEPS.map((step, i) => (
            <div key={step.key} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div className={`h-0.5 flex-1 ${i <= MOCK_CURRENT_STEP ? "bg-brand-500" : "bg-slate-200 dark:bg-slate-600"}`} />
                )}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                    step.done
                      ? "border-brand-500 bg-brand-600 text-white"
                      : i === MOCK_CURRENT_STEP + 1
                      ? "border-brand-300 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 animate-pulse"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {step.done ? "✓" : i + 1}
                </div>
                {i < MOCK_CANDIDATE_STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 ${i < MOCK_CURRENT_STEP ? "bg-brand-500" : "bg-slate-200 dark:bg-slate-600"}`} />
                )}
              </div>
              <p className={`mt-2 text-xs font-semibold ${step.done ? "text-brand-700 dark:text-brand-300" : "text-slate-400"}`}>
                {step.label}
              </p>
              {step.date && <p className="text-xs text-slate-400">{step.date}</p>}
            </div>
          ))}
        </div>

        {/* Mobile timeline */}
        <div className="sm:hidden space-y-4">
          {MOCK_CANDIDATE_STEPS.map((step, i) => (
            <div key={step.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    step.done
                      ? "bg-brand-600 text-white"
                      : "border-2 border-slate-300 dark:border-slate-600 text-slate-400"
                  }`}
                >
                  {step.done ? "✓" : i + 1}
                </div>
                {i < MOCK_CANDIDATE_STEPS.length - 1 && (
                  <div className={`w-0.5 h-6 ${i < MOCK_CURRENT_STEP ? "bg-brand-500" : "bg-slate-200 dark:bg-slate-600"}`} />
                )}
              </div>
              <div>
                <p className={`text-sm font-semibold ${step.done ? "text-brand-700 dark:text-brand-300" : "text-slate-400"}`}>
                  {step.label}
                </p>
                {step.date && <p className="text-xs text-slate-400">{step.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">הותאמו משרות</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">סטטוס נוכחי</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">1 ימים</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">מאז הגשת מועמדות</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">6 משרות</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">משרות מתאימות</p>
        </motion.div>
      </div>

      {/* Recommended jobs */}
      <div ref={jobsRef}>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">משרות מומלצות עבורך</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MOCK_RECOMMENDED_JOBS.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 16 }}
              animate={jobsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{job.employer}</p>
                </div>
                <div className="flex gap-1.5">
                  {job.housing && (
                    <span className="inline-flex rounded-full bg-green-100 dark:bg-green-900/50 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                      כולל מגורים
                    </span>
                  )}
                  {job.urgency === "now" && (
                    <span className="inline-flex rounded-full bg-red-100 dark:bg-red-900/50 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                      דחוף
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">{job.salary_range}</span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {job.field}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">ציון התאמה</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{job.match_score}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <motion.div
                    className={`h-2 rounded-full ${
                      (job.match_score ?? 0) >= 85 ? "bg-green-500" : (job.match_score ?? 0) >= 70 ? "bg-yellow-500" : "bg-orange-400"
                    }`}
                    initial={{ width: 0 }}
                    animate={jobsInView ? { width: `${job.match_score}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
