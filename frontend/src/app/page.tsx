export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold tracking-tight text-brand-900">
        TalentAI
      </h1>
      <p className="mt-4 max-w-xl text-center text-lg text-gray-600">
        AI-powered recruitment marketing. Hyper-personalized landing pages,
        intelligent outreach, and candidate intent analytics.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/jobs/demo-job/demo-candidate"
          className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          View Demo Landing Page
        </a>
      </div>
    </main>
  );
}
