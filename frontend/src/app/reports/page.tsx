"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { fetchLeads } from "@/lib/api";
import type { Lead } from "@/types";
import { Skeleton } from "@/components/Skeleton";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
  "#4f46e5", // indigo-600
  "#0ea5e9", // sky-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#64748b", // slate-500
];

const ACCEPTED_STATUSES = new Set(["HIRED", "STARTED"]);

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchLeads(500, 0);
        setLeads(res.leads);
      } catch (err) {
        setError(err instanceof Error ? err.message : "שגיאה בטעינת נתונים");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Aggregations ──────────────────────────────────────────

  const { pieData, barData, totalLeads, withSource, topSource } = useMemo(() => {
    const sourceMap = new Map<string, { total: number; accepted: number }>();

    for (const lead of leads) {
      const src = lead.leadSource || "לא צוין";
      const entry = sourceMap.get(src) || { total: 0, accepted: 0 };
      entry.total++;
      if (ACCEPTED_STATUSES.has(lead.status ?? "")) {
        entry.accepted++;
      }
      sourceMap.set(src, entry);
    }

    const pieData = Array.from(sourceMap.entries()).map(([name, { total }]) => ({
      name,
      value: total,
    }));

    const barData = Array.from(sourceMap.entries()).map(([name, { total, accepted }]) => ({
      name,
      "סה״כ לידים": total,
      "התקבלו": accepted,
    }));

    const withSource = leads.filter((l) => l.leadSource).length;

    let topSource = "—";
    let topCount = 0;
    for (const [name, { total }] of sourceMap) {
      if (name !== "לא צוין" && total > topCount) {
        topSource = name;
        topCount = total;
      }
    }

    return { pieData, barData, totalLeads: leads.length, withSource, topSource };
  }, [leads]);

  // ── Render ────────────────────────────────────────────────

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <a href="/dashboard" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            &rarr; חזרה ללוח בקרה
          </a>
          <h1 className="mt-1 text-2xl font-bold text-brand-900 dark:text-white">
            דוחות — ניתוח מקורות גיוס
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KpiCard label="סה״כ לידים" value={totalLeads} color="bg-indigo-600" />
            <KpiCard label="לידים עם מקור" value={withSource} color="bg-emerald-500" />
            <KpiCard label="מקור מוביל" value={topSource} color="bg-sky-500" />
          </div>
        )}

        {/* Charts */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm"
            >
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                התפלגות לידים לפי מקור
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={(props: PieLabelRenderProps) =>
                      `${props.name ?? ""} (${(((props.percent as number) ?? 0) * 100).toFixed(0)}%)`
                    }
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, "לידים"]}
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg, #fff)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      direction: "rtl",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm"
            >
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                לידים לפי מקור — סה״כ מול התקבלו
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg, #fff)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      direction: "rtl",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ direction: "rtl", fontSize: 13 }}
                  />
                  <Bar dataKey="סה״כ לידים" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="התקבלו" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Empty state */}
        {!loading && leads.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            אין נתונים להצגה. הוסיפו לידים דרך לוח הבקרה.
          </div>
        )}
      </div>
    </main>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
    >
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white`}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </motion.div>
  );
}
