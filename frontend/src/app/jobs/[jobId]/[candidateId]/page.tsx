import { fetchLandingPageData } from "@/lib/api";
import type { PersonalizedLandingData } from "@/types";

// --- Mock data used when the backend is not running ---
function getMockData(jobId: string, candidateId: string): PersonalizedLandingData {
  return {
    jobId,
    candidateId,
    headline: "This Role Was Made for You",
    subheadline:
      "We analyzed your background and believe you'd thrive as a Senior Engineer on our platform team.",
    whyYouFit: [
      "Your 6+ years of distributed systems experience maps directly to our core challenges.",
      "Your open-source contributions show the ownership mentality we value.",
      "Your background in fintech aligns with our mission in financial infrastructure.",
    ],
    personalizedBenefits: [
      "Work on systems processing 1M+ requests/sec — the scale you've been building toward.",
      "A $12K annual learning budget to fuel the curiosity your conference talks demonstrate.",
      "Fully remote with async-first culture — matching the flexibility you've optimized for.",
    ],
    callToAction: "Let's Talk — Book a 15-min Chat With the Hiring Manager",
    tone: "confident-yet-warm",
  };
}

interface PageProps {
  params: Promise<{ jobId: string; candidateId: string }>;
}

export default async function PersonalizedLandingPage({ params }: PageProps) {
  const { jobId, candidateId } = await params;

  let data: PersonalizedLandingData;
  try {
    data = await fetchLandingPageData(jobId, candidateId);
  } catch {
    // Fallback to mock data when backend is unavailable
    data = getMockData(jobId, candidateId);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 to-white">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-600">
          Opportunity crafted for you
        </p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-brand-900">
          {data.headline}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-slate-600">
          {data.subheadline}
        </p>
      </section>

      {/* Why You Fit */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="text-2xl font-bold text-brand-900">
          Why You&apos;re a Great Fit
        </h2>
        <ul className="mt-6 space-y-4">
          {(data.whyYouFit ?? []).map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-slate-700">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Personalized Benefits */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="text-2xl font-bold text-brand-900">
          What&apos;s In It For You
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-1">
          {(data.personalizedBenefits ?? []).map((benefit, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-slate-700">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <a
          href={`/apply?job=${jobId}&candidate=${candidateId}`}
          className="inline-block rounded-xl bg-brand-600 px-10 py-4 text-lg font-semibold text-white shadow-lg hover:bg-brand-700 transition-colors"
        >
          {data.callToAction}
        </a>
      </section>
    </main>
  );
}
