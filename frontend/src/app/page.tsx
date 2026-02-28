export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold tracking-tight text-brand-900">
        ברק שירותים
      </h1>
      <p className="mt-4 max-w-xl text-center text-lg text-gray-600">
        הסוכנות המובילה להשמה באילת. עבודה מיידית, מגורים מסובסדים, ארוחות והסעות בחינם.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/outreach"
          className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          התחל צ׳אט סינון
        </a>
      </div>
    </main>
  );
}
