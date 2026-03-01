import { Skeleton } from "@/components/Skeleton";

export default function EmployersLoading() {
  return (
    <div dir="rtl" className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <div className="hidden md:flex gap-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="hidden md:block h-9 w-24 rounded-lg" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="bg-gradient-to-bl from-brand-900 to-brand-700 px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="mx-auto h-7 w-48 rounded-full bg-white/20" />
          <Skeleton className="mx-auto h-10 w-full max-w-lg bg-white/20" />
          <Skeleton className="mx-auto h-10 w-3/4 bg-white/20" />
          <Skeleton className="mx-auto h-5 w-2/3 bg-white/20" />
          <div className="flex justify-center gap-3 pt-4">
            <Skeleton className="h-12 w-48 rounded-lg bg-white/20" />
            <Skeleton className="h-12 w-40 rounded-lg bg-white/20" />
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="bg-brand-50 dark:bg-slate-800 px-4 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Cards grid skeleton */}
      <div className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="mx-auto h-8 w-64 mb-2" />
          <Skeleton className="mx-auto h-4 w-48 mb-10" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-3">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
