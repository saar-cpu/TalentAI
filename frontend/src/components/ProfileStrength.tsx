"use client";

import { motion } from "framer-motion";

export interface ProfileItem {
  key: string;
  label: string;
  completed: boolean;
}

export const MOCK_PROFILE_ITEMS: ProfileItem[] = [
  { key: "name", label: "שם מלא", completed: true },
  { key: "phone", label: "מספר טלפון", completed: true },
  { key: "field", label: "תחום עבודה מועדף", completed: true },
  { key: "cv", label: "קורות חיים / ניסיון", completed: true },
  { key: "photo", label: "תמונת פרופיל", completed: false },
  { key: "location", label: "מיקום מגורים נוכחי", completed: false },
];

export default function ProfileStrength({
  items = MOCK_PROFILE_ITEMS,
}: {
  items?: ProfileItem[];
}) {
  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const pct = Math.round((completed / total) * 100);
  const remaining = total - completed;

  const barColor =
    pct >= 80
      ? "bg-green-500"
      : pct >= 50
      ? "bg-brand-500"
      : "bg-orange-400";

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          חוזק הפרופיל
        </h2>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {pct}%
        </span>
      </div>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        השלימו את הפרופיל לקבלת התאמות AI מדויקות יותר
      </p>

      {/* Progress bar */}
      <div className="mt-3 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700">
        <motion.div
          className={`h-2.5 rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Checklist */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
              item.completed
                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400"
            }`}
          >
            {item.completed ? (
              <svg
                className="h-4 w-4 shrink-0 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <div className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-600" />
            )}
            <span className="flex-1">{item.label}</span>
            {!item.completed && (
              <button className="rounded-md bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors">
                השלם/י
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      {remaining > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 rounded-lg bg-brand-50 dark:bg-brand-900/30 px-4 py-3 text-center text-sm font-medium text-brand-700 dark:text-brand-300"
        >
          נותרו {remaining} פרטים להשלמה — ככל שהפרופיל מלא יותר, כך ההתאמות
          מדויקות יותר
        </motion.div>
      )}
    </div>
  );
}
