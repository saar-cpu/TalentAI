"use client";

import { useState } from "react";
import type { Lead } from "@/types";
import type { LeadStatus } from "@/lib/stateMachine";
import {
  KANBAN_COLUMNS,
  STATUS_LABELS,
  STATUS_COLORS,
  ALLOWED_TRANSITIONS,
  validateTransition,
  isLeadStatus,
} from "@/lib/stateMachine";
import { changeLeadStatus } from "@/lib/api";
import { useToast } from "@/components/Toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KanbanBoardProps {
  leads: Lead[];
  onRefresh: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KanbanBoard({ leads, onRefresh }: KanbanBoardProps) {
  const { toast } = useToast();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<LeadStatus | null>(null);
  const [transitioning, setTransitioning] = useState<string | null>(null);

  // Group leads by status
  const columns: Record<string, Lead[]> = {};
  for (const col of KANBAN_COLUMNS) {
    columns[col] = [];
  }
  // Side statuses bucket
  const sideLeads: Lead[] = [];

  for (const lead of leads) {
    if (KANBAN_COLUMNS.includes(lead.status as LeadStatus)) {
      columns[lead.status] = columns[lead.status] || [];
      columns[lead.status].push(lead);
    } else {
      sideLeads.push(lead);
    }
  }

  // ── Drag handlers ─────────────────────────────────────────

  function handleDragStart(e: React.DragEvent, leadId: string) {
    setDraggingId(leadId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", leadId);
  }

  function handleDragOver(e: React.DragEvent, columnStatus: LeadStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget(columnStatus);
  }

  function handleDragLeave() {
    setDropTarget(null);
  }

  async function handleDrop(e: React.DragEvent, targetStatus: LeadStatus) {
    e.preventDefault();
    setDropTarget(null);
    setDraggingId(null);

    const leadId = e.dataTransfer.getData("text/plain");
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const currentStatus = lead.status as LeadStatus;
    if (currentStatus === targetStatus) return;

    // Client-side validation first (instant feedback)
    const result = validateTransition(currentStatus, targetStatus, {
      screeningScore: lead.screeningScore,
      humanApproved: lead.humanApproved,
    });

    if (!result.valid) {
      toast(result.error!, "error");
      return;
    }

    // Server-side transition
    setTransitioning(leadId);
    try {
      await changeLeadStatus(leadId, targetStatus, "dashboard_user");
      toast(
        `${lead.name}: ${STATUS_LABELS[currentStatus]} → ${STATUS_LABELS[targetStatus]}`,
        "success"
      );
      onRefresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "שגיאה בעדכון סטטוס", "error");
    } finally {
      setTransitioning(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Pipeline columns */}
      <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
        {KANBAN_COLUMNS.map((status) => {
          const colLeads = columns[status] || [];
          const isOver = dropTarget === status;

          return (
            <div
              key={status}
              className={`flex-shrink-0 w-56 snap-start rounded-xl border transition-colors ${
                isOver
                  ? "border-brand-400 bg-brand-50/50 dark:border-brand-500 dark:bg-brand-900/20"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
              }`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column header */}
              <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[status]}`}>
                    {STATUS_LABELS[status]}
                  </span>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    {colLeads.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[120px]">
                {colLeads.map((lead) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    isDragging={draggingId === lead.id}
                    isTransitioning={transitioning === lead.id}
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                  />
                ))}
                {colLeads.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-xs text-slate-400 dark:text-slate-500">
                    {isOver ? "שחרר כאן" : "ריק"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Side statuses (REJECTED, LOST_CONTACT, NO_SHOW) */}
      {sideLeads.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
            נדחו / אבד קשר / לא הגיעו ({sideLeads.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {sideLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs"
              >
                <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  isLeadStatus(lead.status) ? STATUS_COLORS[lead.status] : "bg-slate-100 text-slate-500"
                }`}>
                  {isLeadStatus(lead.status) ? STATUS_LABELS[lead.status] : lead.status}
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{lead.name}</span>
                <span className="text-slate-400" dir="ltr">{lead.phone}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────

function KanbanCard({
  lead,
  isDragging,
  isTransitioning,
  onDragStart,
}: {
  lead: Lead;
  isDragging: boolean;
  isTransitioning: boolean;
  onDragStart: (e: React.DragEvent) => void;
}) {
  const currentStatus = lead.status as LeadStatus;
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];

  return (
    <div
      draggable={!isTransitioning}
      onDragStart={onDragStart}
      className={`rounded-lg border bg-white dark:bg-slate-800 p-2.5 shadow-sm cursor-grab active:cursor-grabbing transition-all ${
        isDragging
          ? "opacity-50 border-brand-400 dark:border-brand-500 ring-2 ring-brand-200 dark:ring-brand-800"
          : isTransitioning
          ? "opacity-60 border-amber-300 dark:border-amber-600"
          : "border-slate-200 dark:border-slate-700 hover:shadow-md"
      }`}
    >
      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
        {lead.name}
      </p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5" dir="ltr">
        {lead.phone}
      </p>
      {lead.jobTitle && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
          {lead.jobTitle}
        </p>
      )}
      {lead.screeningScore != null && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-1.5 rounded-full ${
                lead.screeningScore >= 80 ? "bg-green-500" : lead.screeningScore >= 60 ? "bg-yellow-500" : "bg-orange-400"
              }`}
              style={{ width: `${Math.min(lead.screeningScore, 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{lead.screeningScore}</span>
        </div>
      )}

      {/* Allowed transitions hint */}
      {allowed.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {allowed.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[9px] rounded bg-slate-100 dark:bg-slate-700 px-1 py-0.5 text-slate-400 dark:text-slate-500"
            >
              → {STATUS_LABELS[s]}
            </span>
          ))}
        </div>
      )}

      {isTransitioning && (
        <div className="mt-1.5 text-[10px] text-amber-600 dark:text-amber-400 animate-pulse">
          מעדכן...
        </div>
      )}
    </div>
  );
}
