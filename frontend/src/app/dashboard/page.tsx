"use client";

import { useState, useEffect, useCallback } from "react";
import type { Lead } from "@/types";
import { fetchLeads } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  "חדש": "bg-blue-100 text-blue-700",
  "מעקב": "bg-yellow-100 text-yellow-700",
  "New Lead": "bg-blue-100 text-blue-700",
  "active": "bg-green-100 text-green-700",
  "closed": "bg-gray-100 text-gray-500",
};

const SOURCE_LABELS: Record<string, string> = {
  whatsapp_screening: "צ׳אט WhatsApp",
  facebook_hunter: "Facebook Hunter",
  AllJobs: "AllJobs",
  website: "אתר",
};

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

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filtered = leads.filter((lead) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(q) ||
      lead.phone?.includes(q) ||
      lead.jobTitle?.toLowerCase().includes(q) ||
      lead.location?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "חדש" || l.status === "New Lead").length,
    active: leads.filter((l) => l.recruitmentStatus === "active").length,
    whatsapp: leads.filter((l) => l.source === "whatsapp_screening").length,
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <a href="/" className="text-sm text-brand-600 hover:underline">
                &rarr; חזרה לדף הראשי
              </a>
              <h1 className="mt-1 text-2xl font-bold text-brand-900">לוח בקרה — לידים</h1>
            </div>
            <button
              onClick={loadLeads}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {loading ? "טוען..." : "רענן"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="סה״כ לידים" value={stats.total} color="bg-brand-600" />
          <StatCard label="לידים חדשים" value={stats.new} color="bg-blue-500" />
          <StatCard label="פעילים" value={stats.active} color="bg-green-500" />
          <StatCard label="מ-WhatsApp" value={stats.whatsapp} color="bg-emerald-500" />
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-6xl px-4 pb-3">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="חיפוש לפי שם, טלפון, תפקיד..."
            className="flex-1 min-w-[200px] rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">כל הסטטוסים</option>
            <option value="חדש">חדש</option>
            <option value="מעקב">מעקב</option>
            <option value="New Lead">New Lead</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto max-w-6xl px-4 pb-3">
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mx-auto max-w-6xl px-4 pb-8">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">שם</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">טלפון</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">תפקיד</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">מיקום</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">מקור</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">סטטוס</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">תאריך</th>
                </tr>
              </thead>
              <tbody>
                {loading && !leads.length ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      טוען לידים...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      {searchQuery ? "לא נמצאו תוצאות" : "אין לידים עדיין"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-gray-600 direction-ltr" dir="ltr">
                        {lead.phone}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{lead.jobTitle || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.location || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="text-gray-500 text-xs">
                          {SOURCE_LABELS[lead.source ?? ""] || lead.source || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            STATUS_COLORS[lead.status ?? ""] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {lead.status || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
              מציג {filtered.length} מתוך {leads.length} לידים
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${color} text-white text-sm font-bold`}>
        {value}
      </div>
      <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
}
