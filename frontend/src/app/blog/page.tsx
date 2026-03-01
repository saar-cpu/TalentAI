import type { Metadata } from "next";
import Link from "next/link";
import AnimatedCard from "@/components/AnimatedCard";

export const metadata: Metadata = {
  title: "בלוג — מדריכים לעבודה ומעבר לאילת | ברק שירותים",
  description:
    "מדריכים מעשיים למעבר לאילת: שכר, דיור, מענקים, תחומי עבודה וטיפים ממי שכבר עבר. מאת ברק שירותים — 20+ שנה של השמת עובדים באילת.",
};

const BLOG_POSTS = [
  {
    title: "השתחררת? המדריך המלא למעבר לאילת ב-2026",
    excerpt:
      "דירה, עבודה, חברים, ים — תוך שבוע. כל מה שאף אחד לא מספר על המעבר לאילת אחרי צבא, כולל מספרים אמיתיים.",
    date: "15 בפברואר 2026",
    slug: "guide-moving-to-eilat",
    tag: "מדריך מלא",
    ready: true,
  },
  {
    title: "5 סיבות שעבודה במלון עדיפה על הייטק (לפחות בגיל 21)",
    excerpt:
      "טיפים של 200 ש״ח ביום, אווירה בינלאומית, ואפס הוצאות מחייה. למה אלפי צעירים בוחרים מלונאות באילת.",
    date: "1 בפברואר 2026",
    slug: "5-reasons-hotel-industry",
    tag: "מלונאות",
    ready: false,
  },
  {
    title: "כמה נשאר בכיס? חישוב שכר אמיתי לעובד באילת 2026",
    excerpt:
      "ברוטו 7,500 — אבל אחרי מגורים ב-400 ש״ח, אוכל ב-160 ש״ח ואפס נסיעות? בואו נעשה את החשבון.",
    date: "20 בינואר 2026",
    slug: "eilat-salary-guide-2026",
    tag: "שכר ומענקים",
    ready: false,
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-brand-900 dark:text-white">
            ברק שירותים
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
            >
              ראשי
            </Link>
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">בלוג</span>
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

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Page header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-brand-900 dark:text-white md:text-4xl">
            מדריכים שחוסכים טעויות
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            מה שהיינו רוצים שמישהו יספר לנו לפני שעברנו לאילת
          </p>
        </div>

        {/* Article cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post, i) => {
            const content = (
              <div className="group rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-full bg-brand-50 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
                    {post.tag}
                  </span>
                  <span className="text-xs text-slate-400">{post.date}</span>
                </div>
                <h2 className="mt-3 text-lg font-bold text-brand-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-600 dark:text-brand-400">
                  {post.ready ? "קראו עוד ←" : "בקרוב"}
                </span>
              </div>
            );

            if (post.ready) {
              return (
                <AnimatedCard key={post.slug} index={i}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block"
                  >
                    {content}
                  </Link>
                </AnimatedCard>
              );
            }

            return (
              <AnimatedCard key={post.slug} index={i}>
                <div className="opacity-75 cursor-default">
                  {content}
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-900 px-4 py-8 text-center text-sm text-indigo-300">
        <p>
          © {new Date().getFullYear()} ברק שירותים — כל הזכויות שמורות
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
    </>
  );
}
