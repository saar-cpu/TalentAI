import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SEO_PAGES,
  getPageBySlug,
  getJobsForPage,
} from "@/lib/seo-pages";
import SeoJobsGrid from "./SeoJobsGrid";

// ─── Static Params ───────────────────────────────────────────────────────────

export function generateStaticParams() {
  return SEO_PAGES.map((p) => ({ slug: p.slug }));
}

// ─── Dynamic Metadata ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    openGraph: {
      title: page.ogTitle,
      description: page.ogDescription,
      locale: "he_IL",
      type: "website",
      url: `https://eilatjobs.com/jobs/${page.slug}`,
    },
    alternates: {
      canonical: `https://eilatjobs.com/jobs/${page.slug}`,
    },
  };
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default async function SeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();

  const jobs = getJobsForPage(page);
  const relatedPages = page.relatedSlugs
    .map((s) => getPageBySlug(s))
    .filter(Boolean);

  // JSON-LD structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const jobPostingSchemas = jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `${job.title} ב${job.employer} — ${job.salary_range}`,
    hiringOrganization: {
      "@type": "Organization",
      name: job.employer,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "אילת",
        addressCountry: "IL",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "ILS",
      value: { "@type": "QuantitativeValue", unitText: "MONTH" },
    },
    employmentType: "FULL_TIME",
    datePosted: "2026-02-15",
    validThrough: "2026-06-30",
  }));

  return (
    <div dir="rtl" className="min-h-screen bg-white dark:bg-slate-900">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {jobPostingSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-xl font-bold text-brand-900 dark:text-white"
          >
            ברק שירותים
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
            >
              ראשי
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
            >
              בלוג
            </Link>
            <Link
              href="/outreach"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              הגישו מועמדות
            </Link>
          </nav>
          <Link
            href="/outreach"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 md:hidden"
          >
            הגישו מועמדות
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="mx-auto max-w-6xl px-4 py-3 text-xs text-slate-400 dark:text-slate-500">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400">
          ראשי
        </Link>
        {" / "}
        <span>משרות</span>
        {" / "}
        <span className="text-slate-600 dark:text-slate-300">{page.h1.split("—")[0].trim()}</span>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-bl from-brand-900 via-brand-800 to-brand-700 px-4 py-16 text-white text-center">
        <div className="mx-auto max-w-3xl">
          <span className="text-5xl">{page.heroEmoji}</span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
            {page.h1}
          </h1>
          <p className="mt-3 text-lg text-indigo-100/90">{page.subtitle}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/outreach"
              className="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-lg hover:bg-indigo-50 transition-colors"
            >
              הגישו מועמדות עכשיו
            </Link>
            <a
              href="https://wa.me/972547990065"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-bold text-white backdrop-blur hover:bg-white/10 transition-colors"
            >
              WhatsApp
            </a>
          </div>
          <p className="mt-4 text-sm text-indigo-200/80">
            20+ שנה · 1,000+ עובדים · סוכנות #1 באילת
          </p>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-extrabold text-brand-900 dark:text-white text-center">
          {jobs.length} משרות פתוחות
        </h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          כל המשרות כוללות מגורים מסובסדים, ארוחות והסעות
        </p>
        <div className="mt-8">
          <SeoJobsGrid jobs={jobs} />
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 dark:bg-slate-800 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-brand-900 dark:text-white text-center">
            למה לעבוד באילת דרך ברק שירותים?
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {page.benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm"
              >
                <span className="text-3xl">{b.emoji}</span>
                <h3 className="mt-3 text-lg font-bold text-brand-900 dark:text-white">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-2xl font-extrabold text-brand-900 dark:text-white text-center">
          שאלות נפוצות
        </h2>
        <div className="mt-8 space-y-3">
          {page.faqItems.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <summary className="cursor-pointer px-5 py-4 text-base font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between">
                {faq.q}
                <svg
                  className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Related Pages + Blog */}
      <section className="bg-slate-50 dark:bg-slate-800 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-brand-900 dark:text-white text-center">
            עוד משרות שיעניינו אותך
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {relatedPages.map(
              (rp) =>
                rp && (
                  <Link
                    key={rp.slug}
                    href={`/jobs/${rp.slug}`}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                  >
                    {rp.h1.split("—")[0].trim()}
                  </Link>
                )
            )}
            <Link
              href="/blog"
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              מדריכים לעבודה באילת &larr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-brand-600 px-4 py-12 text-center text-white">
        <h2 className="text-2xl font-extrabold md:text-3xl">
          מוכנים להתחיל לעבוד באילת?
        </h2>
        <p className="mt-2 text-indigo-100">
          דירה, עבודה וארוחות — תוך 3 ימים. הגישו מועמדות עכשיו.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/outreach"
            className="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-lg hover:bg-indigo-50 transition-colors"
          >
            הגישו מועמדות
          </Link>
          <a
            href="https://wa.me/972547990065"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-bold text-white hover:bg-white/10 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 px-4 py-8 text-center text-sm text-indigo-300">
        <p>
          &copy; {new Date().getFullYear()} ברק שירותים — כל הזכויות שמורות
        </p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <Link href="/" className="hover:text-white">
            ראשי
          </Link>
          <Link href="/blog" className="hover:text-white">
            בלוג
          </Link>
          <Link href="/outreach" className="hover:text-white">
            הגשת מועמדות
          </Link>
        </div>
      </footer>
    </div>
  );
}
