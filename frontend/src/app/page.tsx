"use client";

import { useState, useEffect, FormEvent } from "react";
import AnimatedCard from "@/components/AnimatedCard";
import { Skeleton } from "@/components/Skeleton";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "ראשי", href: "#" },
  { label: "משרות", href: "#jobs" },
  { label: "אודות", href: "#about" },
  { label: "למעסיקים", href: "/employers" },
  { label: "בלוג", href: "/blog" },
];

const TOOL_LINKS = [
  { label: "לוח בקרה", href: "/dashboard" },
  { label: "צ׳אט סינון", href: "/outreach" },
  { label: "Facebook Hunter", href: "/fb-hunter" },
  { label: "Voice AI", href: "/voice-test" },
];

const TRUST_STATS = [
  { value: "50+", label: "מעסיקים שסומכים עלינו", emoji: "🏢" },
  { value: "1,000+", label: "עובדים שהתחילו דרכנו", emoji: "👥" },
  { value: "20+", label: "שנה ברצף בשטח", emoji: "📅" },
  { value: "96%", label: "ממליצים לחברים", emoji: "⭐" },
];

const JOB_CATEGORIES = [
  {
    emoji: "🏨",
    title: "מלונאות",
    roles: ["קבלה", "חדרנות", "שירות חדרים", "קונסיירז׳"],
    hook: "המלונות הכי יוקרתיים בדרום — טיפים, ארוחות חינם ואווירה בינלאומית",
    href: "#",
  },
  {
    emoji: "🛍️",
    title: "קמעונאות",
    roles: ["מכירות", "קופאות", "מחסנאות", "ניהול סניף"],
    hook: "רשתות ומותגים מובילים עם עמלות ובונוסי מכירה",
    href: "#",
  },
  {
    emoji: "👗",
    title: "אופנה",
    roles: ["יועצות אופנה", "ויזואל", "ניהול חנות"],
    hook: "קסטרו, גולף, רנואר ועוד — הנחות עובדים וקריירה מהירה",
    href: "#",
  },
  {
    emoji: "🛡️",
    title: "אבטחה",
    roles: ["מאבטחים", "סדרנים", "בקרת כניסה"],
    hook: "משמרות גמישות, שכר גבוה ואפשרות לשעות נוספות",
    href: "#",
  },
  {
    emoji: "🍽️",
    title: "מסעדנות",
    roles: ["מלצרות", "ברמנים", "טבחים", "שטיפה"],
    hook: "מסעדות ים, ברים ובתי מלון — טיפים של תיירים ואווירה חיה",
    href: "#",
  },
  {
    emoji: "⛽",
    title: "תחנות דלק",
    roles: ["תדלוקנים", "קופאים", "ניהול משמרת"],
    hook: "עבודה יציבה עם בונוסים חודשיים ומשמרות קבועות",
    href: "#",
  },
];

const BENEFITS = [
  {
    emoji: "🏠",
    title: "דירה מרוהטת מ-400 ש״ח/חודש",
    description:
      "מיזוג, מקרר, כיריים, מכונת כביסה — מוכן להיכנס. במרכז אילת, קרוב לים ולבילויים. בלי להסתבך עם חוזים ושכירות.",
  },
  {
    emoji: "🍽️",
    title: "3 ארוחות ב-5.28 ש״ח ליום",
    description:
      "ארוחות חמות בחדר אוכל ישירות במקום העבודה. תחשבו כמה זה חוסך — כמעט אלפיים שקל בחודש שנשארים בכיס.",
  },
  {
    emoji: "🚌",
    title: "הסעות מהדלת",
    description:
      "נאסף אתכם מהדירה ונחזיר אתכם בסוף המשמרת. בלי אוטובוסים, בלי הוצאות נסיעה, בלי לחפש חנייה.",
  },
  {
    emoji: "💰",
    title: "מענק 9,550 ש״ח אחרי 150 יום",
    description:
      "סטטוס מעודפת מזכה אתכם במענק של 9,550 ש״ח, פטור ממע״מ והפחתת מס הכנסה. יותר כסף נטו מכל עיר אחרת.",
  },
  {
    emoji: "💵",
    title: "כסף בידיים כל שבוע",
    description:
      "אפשרות לתשלום שבועי במזומן ומקדמות בלי המתנה. המשכורת שלכם — בזמן שלכם.",
  },
  {
    emoji: "🤝",
    title: "מנהל אישי שמכיר אתכם בשם",
    description:
      "לא קול סנטר. בן אדם שמקבל אתכם ביום הראשון, מסדר הכל ועונה כשמתקשרים. בעיה? נפתרת תוך שעות.",
  },
];

const TESTIMONIALS = [
  {
    name: "נועה כ.",
    role: "פקידת קבלה, מלון רויאל ביץ׳",
    quote:
      "שלחתי קורות חיים ביום ראשון, ביום שלישי כבר הייתי בדירה מרוהטת עם מיזוג. תוך שבוע — עבודה במלון 5 כוכבים, טיפים של תיירים, ואני גרה 3 דקות מהים. אין מצב שהייתי מסדרת את זה לבד.",
    stars: 5,
  },
  {
    name: "איתי מ.",
    role: "מאבטח, קניון מול הים",
    quote:
      "יצאתי מהצבא בלי מושג מה לעשות. חבר המליץ, התקשרתי, ותוך יומיים הייתי באילת עם דירה, עבודה ו-7,200 ש״ח בחודש הראשון. אחרי חצי שנה כבר קיבלתי את מענק המעודפת.",
    stars: 5,
  },
  {
    name: "מיכל ד.",
    role: "מוכרנית, קסטרו אילת",
    quote:
      "מה שהכי הפתיע אותי — שיש מישהו שבאמת עונה לטלפון. ליאור, המנהלת שלי, פתרה לי בעיה עם השכרת הדירה באותו יום. משכורת בזמן, בונוסים, ואני חוסכת 2,000 ש״ח בחודש על אוכל והסעות.",
    stars: 5,
  },
];

const FAQ_ITEMS = [
  {
    question: "כמה עולים המגורים? מה בדיוק כלול?",
    answer:
      "בין 400 ל-800 ש״ח לחודש — תלוי בסוג הדירה ומספר השותפים. כל דירה כוללת מיזוג, מקרר, כיריים ומכונת כביסה. הדירות במרכז אילת, קרוב לים, לקניונים ולקווי ההסעה. אתם מגיעים עם תיק — הכל מוכן.",
  },
  {
    question: "מה זה מענק מעודפת ואיך מקבלים אותו?",
    answer:
      "אחרי 150 ימי עבודה באילת, מקבלים מענק של 9,550 ש״ח ישירות לחשבון. בנוסף — פטור ממע״מ על שירותים מקומיים והפחתת מס הכנסה. בפועל, עובד באילת מרוויח יותר נטו מאותה משכורת ברוטו בתל אביב.",
  },
  {
    question: "אין לי ניסיון — זה בעיה?",
    answer:
      "בכלל לא. רוב המשרות שלנו לא דורשות ניסיון קודם. מקבלים הכשרה מלאה במקום העבודה — מלונות, חנויות ומסעדות רגילים להכשיר עובדים חדשים. יש לכם ניסיון? עוד יותר טוב — נתאים לכם משרה בכירה יותר.",
  },
  {
    question: "כמה מהר אפשר להתחיל לעבוד?",
    answer:
      "בדרך כלל תוך 1-3 ימים מרגע ששולחים קורות חיים. בתקופות שיא (קיץ, חגים) — לפעמים באותו יום. שולחים פרטים, מקבלים שיחה, ובוחרים משרה. ככה פשוט.",
  },
  {
    question: "כמה מרוויחים באילת?",
    answer:
      "השכר נע בין 6,000 ל-12,000 ש״ח בחודש, תלוי בתפקיד, שעות נוספות וטיפים. אבל החישוב האמיתי הוא כמה נשאר: כשהמגורים 400 ש״ח, האוכל 160 ש״ח בחודש ואין הוצאות נסיעה — הנטו שלכם באילת שווה הרבה יותר מהברוטו בגוש דן.",
  },
  {
    question: "מה אם העבודה לא מתאימה לי?",
    answer:
      "זה קורה — וזה בסדר. המנהל האישי שלכם ימצא לכם חלופה תוך ימים ספורים, בלי דרמה. יש לנו 50+ מעסיקים, אז תמיד יש אופציה אחרת. אף אחד לא נתקע.",
  },
  {
    question: "יש הסעות לכל מקומות העבודה?",
    answer:
      "כן. מערך ההסעות שלנו מכסה את כל אזורי התעסוקה — מלונות, קניונים, אזור התעשייה, תחנות דלק. נאסף אתכם מהדירה ונחזיר בסוף המשמרת.",
  },
  {
    question: "איך מגישים מועמדות?",
    answer:
      "שלוש דרכים: טופס מהיר כאן למטה באתר, הודעת וואטסאפ, או שיחת טלפון ל-073-802-0145. הצוות שלנו חוזר תוך שעות — לא ימים.",
  },
];

const BLOG_POSTS = [
  {
    title: "השתחררת? המדריך המלא למעבר לאילת ב-2026",
    excerpt:
      "דירה, עבודה, חברים, ים — תוך שבוע. כל מה שאף אחד לא מספר על המעבר לאילת אחרי צבא, כולל מספרים אמיתיים.",
    date: "2026-02-15",
    slug: "guide-moving-to-eilat",
  },
  {
    title: "5 סיבות שעבודה במלון עדיפה על הייטק (לפחות בגיל 21)",
    excerpt:
      "טיפים של 200 ש״ח ביום, אווירה בינלאומית, ואפס הוצאות מחייה. למה אלפי צעירים בוחרים מלונאות באילת.",
    date: "2026-02-01",
    slug: "5-reasons-hotel-industry",
  },
  {
    title: "כמה נשאר בכיס? חישוב שכר אמיתי לעובד באילת 2026",
    excerpt:
      "ברוטו 7,500 — אבל אחרי מגורים ב-400 ש״ח, אוכל ב-160 ש״ח ואפס נסיעות? בואו נעשה את החשבון.",
    date: "2026-01-20",
    slug: "eilat-salary-guide-2026",
  },
];

const WHATSAPP_URL = "https://wa.me/9720738020145";
const PHONE_NUMBER = "073-802-0145";
const PHONE_URL = "tel:+9720738020145";

// ─── Components ──────────────────────────────────────────────────────────────

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <a href="#" className="text-xl font-bold text-brand-900 dark:text-white">
          ברק שירותים
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:text-brand-600 dark:hover:text-brand-400"
            >
              {link.label}
            </a>
          ))}
          {/* Tools dropdown */}
          <div className="group relative">
            <button className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:text-brand-600 dark:hover:text-brand-400">
              כלים ▾
            </button>
            <div className="invisible absolute start-0 top-full w-44 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 py-1 shadow-lg group-hover:visible">
              {TOOL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-brand-50 dark:hover:bg-brand-900 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Desktop CTA + phone */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={PHONE_URL}
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
          >
            📞 {PHONE_NUMBER}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
          >
            WhatsApp 💬
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-2xl md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="תפריט"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 border-t border-slate-100 dark:border-slate-700 pt-2">
            <p className="pb-1 text-xs font-semibold text-slate-400">כלים</p>
            {TOOL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <a
              href={PHONE_URL}
              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              📞 {PHONE_NUMBER}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-green-500 py-2 text-center text-sm font-semibold text-white"
            >
              WhatsApp 💬
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-bl from-brand-900 to-brand-700 px-4 py-20 text-center text-white md:py-28">
      <div className="mx-auto max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur">
          20+ שנה, 1,000+ עובדים, סוכנות #1 באילת
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
          עבודה, דירה, ארוחות והסעות —
          <br className="hidden md:block" />
          תוך 3 ימים באילת
        </h1>
        <p className="mt-4 text-lg text-indigo-100 md:text-xl">
          דירה מרוהטת מ-400 ש״ח. 3 ארוחות ב-5 ש״ח ליום. הסעות מהדלת.
          מענק 9,550 ש״ח. ואנחנו מסדרים הכל — אתם רק צריכים להגיע.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#apply"
            className="w-full rounded-lg bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-lg transition-transform hover:scale-105 sm:w-auto"
          >
            רוצה הצעת עבודה תוך 24 שעות
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-lg border-2 border-white/40 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            שאלות? דברו איתנו עכשיו 💬
          </a>
        </div>
      </div>
    </section>
  );
}

function TrustBar({ loading }: { loading: boolean }) {
  return (
    <section className="bg-brand-50 dark:bg-slate-800 px-4 py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))
          : TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl">{stat.emoji}</span>
                <p className="mt-1 text-3xl font-extrabold text-brand-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
      </div>
    </section>
  );
}

function JobCategoryCard({
  emoji,
  title,
  roles,
  hook,
}: {
  emoji: string;
  title: string;
  roles: string[];
  hook: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md">
      <span className="text-3xl">{emoji}</span>
      <h3 className="mt-3 text-lg font-bold text-brand-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{hook}</p>
      <p className="mt-2 text-xs text-slate-400">{roles.join(" · ")}</p>
    </div>
  );
}

function JobCategories({ loading }: { loading: boolean }) {
  return (
    <section id="jobs" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
          באיזה תחום תרצו לעבוד?
        </h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          50+ מעסיקים פעילים. משרות פתוחות עכשיו. בחרו תחום — ונתאים לכם עבודה.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))
            : JOB_CATEGORIES.map((cat, i) => (
                <AnimatedCard key={cat.title} index={i}>
                  <JobCategoryCard
                    emoji={cat.emoji}
                    title={cat.title}
                    roles={cat.roles}
                    hook={cat.hook}
                  />
                </AnimatedCard>
              ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <span className="text-3xl">{emoji}</span>
      <h3 className="mt-3 text-lg font-bold text-brand-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function WhyBarak({ loading }: { loading: boolean }) {
  return (
    <section id="about" className="bg-slate-50 dark:bg-slate-800 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
          לא רק עבודה — חבילה שלמה לחיים באילת
        </h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          מה שמעסיקים אחרים מבטיחים, אנחנו מסדרים עוד לפני שמגיעים
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))
            : BENEFITS.map((b, i) => (
                <AnimatedCard key={b.title} index={i}>
                  <BenefitCard
                    emoji={b.emoji}
                    title={b.title}
                    description={b.description}
                  />
                </AnimatedCard>
              ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  name,
  role,
  quote,
  stars,
}: {
  name: string;
  role: string;
  quote: string;
  stars: number;
}) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-3 text-yellow-400">{"★".repeat(stars)}</div>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-3">
        <p className="font-bold text-brand-900 dark:text-white">{name}</p>
        <p className="text-xs text-slate-400">{role}</p>
      </div>
    </div>
  );
}

function Testimonials({ loading }: { loading: boolean }) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
          הם הגיעו בלי לדעת אף אחד. תשמעו מה קרה.
        </h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          עובדים אמיתיים, מספרים אמיתיים, בלי פילטרים
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))
            : TESTIMONIALS.map((t, i) => (
                <AnimatedCard key={t.name} index={i}>
                  <TestimonialCard
                    name={t.name}
                    role={t.role}
                    quote={t.quote}
                    stars={t.stars}
                  />
                </AnimatedCard>
              ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <button
        className="flex w-full items-center justify-between py-4 text-right"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-brand-900 dark:text-white">
          {question}
        </span>
        <span className="ms-4 shrink-0 text-xl text-slate-400">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{answer}</p>
      )}
    </div>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="bg-slate-50 dark:bg-slate-800 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
          שאלות ששואלים כל יום (ותשובות כנות)
        </h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          הכל שקוף — מחירים, תנאים ומה שבאמת חשוב לדעת לפני שמגיעים
        </p>
        <div className="mt-10">
          {FAQ_ITEMS.map((item) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreviewCard({
  title,
  excerpt,
  date,
  href,
}: {
  title: string;
  excerpt: string;
  date: string;
  href?: string;
}) {
  const card = (
    <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-xs text-slate-400">{date}</p>
      <h3 className="mt-2 text-lg font-bold text-brand-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{excerpt}</p>
      <span className="mt-3 inline-block text-sm font-semibold text-brand-600 dark:text-brand-400">
        קראו עוד ←
      </span>
    </div>
  );
  if (href) {
    return <a href={href}>{card}</a>;
  }
  return card;
}

function BlogPreview({ loading }: { loading: boolean }) {
  return (
    <section id="blog" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
          מדריכים שחוסכים טעויות
        </h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          מה שהיינו רוצים שמישהו יספר לנו לפני שעברנו לאילת
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            : BLOG_POSTS.map((post, i) => (
                <AnimatedCard key={post.slug} index={i}>
                  <BlogPreviewCard
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.date}
                    href={post.slug === "guide-moving-to-eilat" || post.slug === "eilat-salary-guide-2026" ? `/blog/${post.slug}` : undefined}
                  />
                </AnimatedCard>
              ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="/blog"
            className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700"
          >
            כל המדריכים ←
          </a>
        </div>
      </div>
    </section>
  );
}

function QuickApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    field: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="apply" className="bg-brand-50 dark:bg-slate-800 px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <span className="text-5xl">✅</span>
          <h2 className="mt-4 text-2xl font-extrabold text-brand-900 dark:text-white">
            קיבלנו — מחזירים תוך שעות
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            הפרטים שלכם אצלנו. צוות הגיוס יתקשר בהקדם עם הצעות עבודה
            שמתאימות לכם. רוצים לזרז? דברו איתנו ישירות:
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
          >
            פתחו צ׳אט בוואטסאפ 💬
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="bg-brand-50 dark:bg-slate-800 px-4 py-16">
      <div className="mx-auto max-w-lg">
        <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
          30 שניות — וההרפתקה מתחילה
        </h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          השאירו שם, טלפון ותחום — ונחזור עם הצעת עבודה אישית תוך שעות
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="שם מלא"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <input
            type="tel"
            placeholder="מספר טלפון"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <select
            required
            value={formData.field}
            onChange={(e) =>
              setFormData({ ...formData, field: e.target.value })
            }
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-500 dark:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">בחרו תחום עיסוק</option>
            <option value="hotels">מלונאות</option>
            <option value="retail">קמעונאות</option>
            <option value="fashion">אופנה</option>
            <option value="security">אבטחה</option>
            <option value="restaurants">מסעדנות</option>
            <option value="gas">תחנות דלק</option>
            <option value="other">אחר</option>
          </select>
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-700"
          >
            קבלו הצעת עבודה תוך 24 שעות
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-900 px-4 py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-bold">ברק שירותים</h3>
          <p className="mt-2 text-sm text-indigo-200">
            20+ שנה של השמת עובדים באילת. דירה, עבודה, ארוחות והסעות — חבילה
            אחת. 1,000+ עובדים שהתחילו דרכנו ונשארו.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold">צרו קשר</h4>
          <ul className="mt-2 space-y-2 text-sm text-indigo-200">
            <li>
              <a href={PHONE_URL} className="hover:text-white">
                📞 {PHONE_NUMBER}
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                💬 WhatsApp
              </a>
            </li>
            <li>📍 אילת, ישראל</li>
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-bold">קישורים</h4>
          <ul className="mt-2 space-y-2 text-sm text-indigo-200">
            <li>
              <a href="#jobs" className="hover:text-white">
                משרות
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-white">
                אודות
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-white">
                שאלות נפוצות
              </a>
            </li>
            <li>
              <a href="/employers" className="hover:text-white">
                למעסיקים
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-white">
                בלוג
              </a>
            </li>
            <li>
              <a href="#apply" className="hover:text-white">
                הגשת מועמדות
              </a>
            </li>
          </ul>
        </div>

        {/* Internal tools */}
        <div>
          <h4 className="font-bold">כלים פנימיים</h4>
          <ul className="mt-2 space-y-2 text-sm text-indigo-200">
            {TOOL_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/20 pt-6 text-center text-sm text-indigo-300">
        © {new Date().getFullYear()} ברק שירותים — כל הזכויות שמורות
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const loading = !mounted;

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustBar loading={loading} />
        <JobCategories loading={loading} />
        <WhyBarak loading={loading} />
        <Testimonials loading={loading} />
        <FaqSection />
        <BlogPreview loading={loading} />
        <QuickApplicationForm />
      </main>
      <Footer />
    </>
  );
}
