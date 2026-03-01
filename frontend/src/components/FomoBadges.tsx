"use client";

import { motion } from "framer-motion";
import type { FomoData } from "@/lib/fomo";

/**
 * Full badge set — for card contexts (dashboard, SEO job cards).
 */
export function FomoBadges({ fomo }: { fomo: FomoData }) {
  const urgencyColor =
    fomo.remainingPositions <= 2
      ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
      : "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300";

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="inline-flex items-center gap-1 rounded-full bg-brand-100 dark:bg-brand-900/40 px-2 py-0.5 text-xs font-medium text-brand-700 dark:text-brand-300"
      >
        {fomo.applicantCount} הגישו מועמדות
      </motion.span>

      {fomo.isHighDemand && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="inline-flex items-center gap-1 rounded-full bg-brand-100 dark:bg-brand-900/40 px-2 py-0.5 text-xs font-medium text-brand-700 dark:text-brand-300"
        >
          ביקוש גבוה
        </motion.span>
      )}

      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${urgencyColor}`}
      >
        נותרו {fomo.remainingPositions} משרות
      </motion.span>
    </div>
  );
}

/**
 * Compact single-line strip — for tight layouts (homepage cards, outreach).
 */
export function FomoStrip({ fomo }: { fomo: FomoData }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-2 text-xs text-slate-500 dark:text-slate-400"
    >
      <span className="font-semibold text-brand-600 dark:text-brand-400">
        {fomo.applicantCount} הגישו מועמדות
      </span>
      {" · "}
      <span
        className={
          fomo.remainingPositions <= 2
            ? "font-semibold text-red-600 dark:text-red-400"
            : ""
        }
      >
        נותרו {fomo.remainingPositions} משרות
      </span>
    </motion.p>
  );
}
