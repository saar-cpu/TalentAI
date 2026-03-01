"use client";

import { motion } from "framer-motion";
import type { MatchedJob } from "@/types";
import { getFomoData } from "@/lib/fomo";
import { FomoBadges } from "@/components/FomoBadges";

export default function SeoJobsGrid({ jobs }: { jobs: MatchedJob[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {jobs.map((job, i) => {
        const fomo = getFomoData(job.id);
        return (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {job.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {job.employer}
                </p>
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

            <p className="mt-2 text-sm font-semibold text-brand-600 dark:text-brand-400">
              {job.salary_range}
            </p>

            <FomoBadges fomo={fomo} />

            <a
              href="/outreach"
              className="mt-3 block rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              הגישו מועמדות
            </a>
          </motion.div>
        );
      })}
    </div>
  );
}
