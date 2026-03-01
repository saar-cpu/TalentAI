"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedCard from "@/components/AnimatedCard";
import { Skeleton } from "@/components/Skeleton";
import { submitQuickApply, sendScreeningMessage } from "@/lib/api";

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
const VAPI_PUBLIC_KEY = "ae93dc6a-a162-4357-b9c2-dfb0561fe3d1";

const DEMO_MATCH_JOBS = [
  { title: "פקיד/ת קבלה", employer: "מלון רויאל ביץ׳", score: 95, salary: "8,200-9,500 ₪" },
  { title: "מאבטח/ת", employer: "קניון מול הים", score: 87, salary: "7,800-8,400 ₪" },
  { title: "מלצר/ית", employer: "מסעדת פאגו פאגו", score: 78, salary: "7,000-9,000 ₪" },
];

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

function HeroCvWidget() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", phone: "", field: "" });

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      try {
        await submitQuickApply({
          name: form.name,
          phone: form.phone,
          field: form.field,
          relocate: true,
          housing: "need",
          startDate: "this_week",
        });
        setStatus("done");
      } catch {
        setStatus("error");
      }
    },
    [form]
  );

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <svg className="h-5 w-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-base font-bold">הגשה מהירה</h3>
      </div>

      {status === "done" ? (
        <div className="py-6 text-center">
          <span className="text-4xl">✅</span>
          <p className="mt-2 text-sm font-semibold">קיבלנו! נחזור תוך שעות</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            type="text"
            required
            placeholder="שם מלא"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none"
          />
          <input
            type="tel"
            required
            placeholder="מספר טלפון"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none"
          />
          <select
            required
            value={form.field}
            onChange={(e) => setForm({ ...form, field: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/70 focus:border-white/40 focus:outline-none [&>option]:text-slate-900"
          >
            <option value="">בחרו תחום</option>
            <option value="hotels">מלונאות</option>
            <option value="retail">קמעונאות</option>
            <option value="fashion">אופנה</option>
            <option value="security">אבטחה</option>
            <option value="restaurants">מסעדנות</option>
            <option value="gas">תחנות דלק</option>
          </select>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-white py-2.5 text-sm font-bold text-brand-700 transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {status === "loading" ? "שולח..." : status === "error" ? "שגיאה — נסו שוב" : "שלחו מועמדות"}
          </button>
        </form>
      )}
    </div>
  );
}

function HeroChatWidget() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "replied">("idle");
  const [reply, setReply] = useState("");

  const handleSend = useCallback(async () => {
    if (!input.trim() || status !== "idle") return;
    const msg = input.trim();
    setInput("");
    setStatus("loading");
    try {
      const res = await sendScreeningMessage({
        chatHistory: [],
        latestMessage: msg,
        jobTitle: "עבודה באילת",
      });
      setReply(res.reply);
      setStatus("replied");
    } catch {
      setReply("שגיאה בחיבור — נסו שוב מאוחר יותר");
      setStatus("replied");
    }
  }, [input, status]);

  return (
    <div className="flex flex-col rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <svg className="h-5 w-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="text-base font-bold">צ׳אט מהיר</h3>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto max-h-[200px] mb-3">
        {/* Static greeting */}
        <div className="rounded-lg rounded-tr-none bg-white/15 px-3 py-2 text-sm">
          היי! מחפשים עבודה באילת? ספרו לי באיזה תחום אתם מתעניינים 😊
        </div>

        {status !== "idle" && (
          <div className="rounded-lg rounded-tl-none bg-brand-400/30 px-3 py-2 text-sm text-end">
            {input || "..."}
          </div>
        )}

        {status === "loading" && (
          <div className="rounded-lg rounded-tr-none bg-white/15 px-3 py-2 text-sm">
            <span className="inline-flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
            </span>
          </div>
        )}

        {status === "replied" && (
          <div className="rounded-lg rounded-tr-none bg-white/15 px-3 py-2 text-sm">
            {reply.slice(0, 120)}{reply.length > 120 ? "..." : ""}
          </div>
        )}
      </div>

      {status === "replied" ? (
        <a
          href="/outreach"
          className="block rounded-lg bg-white py-2.5 text-center text-sm font-bold text-brand-700 transition-transform hover:scale-[1.02]"
        >
          המשיכו בצ׳אט המלא &larr;
        </a>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="כתבו הודעה..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={status === "loading"}
            className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || status === "loading"}
            className="rounded-lg bg-white/20 px-3 py-2 text-sm font-bold transition-colors hover:bg-white/30 disabled:opacity-40"
          >
            &larr;
          </button>
        </div>
      )}
    </div>
  );
}

function HeroVoiceWidget() {
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const vapiRef = useRef<ReturnType<typeof Object> | null>(null);

  const startCall = useCallback(async () => {
    if (callStatus !== "idle") return;
    setCallStatus("connecting");
    try {
      const { default: Vapi } = await import("@vapi-ai/web");
      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;

      vapi.on("call-start", () => setCallStatus("active"));
      vapi.on("call-end", () => setCallStatus("ended"));

      await vapi.start({
        model: {
          provider: "anthropic",
          model: "claude-sonnet-4-20250514",
          messages: [
            {
              role: "system",
              content:
                "אתה תומר, נציג דיגיטלי של ברק שירותים באילת. דבר בעברית בלבד. עזור למועמד למצוא עבודה באילת. שאל שם, תחום עיסוק מועדף, ומתי יכול להתחיל.",
            },
          ],
        },
        voice: { provider: "openai", voiceId: "onyx" },
        transcriber: { provider: "gladia", language: "he" },
      });
    } catch {
      setCallStatus("idle");
    }
  }, [callStatus]);

  const endCall = useCallback(() => {
    if (vapiRef.current && typeof (vapiRef.current as { stop?: () => void }).stop === "function") {
      (vapiRef.current as { stop: () => void }).stop();
    }
    setCallStatus("ended");
  }, []);

  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
      <div className="mb-4 flex w-full items-center gap-2">
        <svg className="h-5 w-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <h3 className="text-base font-bold">שיחה קולית</h3>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-4">
        {callStatus === "ended" ? (
          <div className="text-center">
            <span className="text-4xl">✅</span>
            <p className="mt-2 text-sm font-semibold">תודה! נחזור אליכם בקרוב</p>
          </div>
        ) : (
          <>
            <button
              onClick={callStatus === "active" ? endCall : startCall}
              disabled={callStatus === "connecting"}
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
                callStatus === "active"
                  ? "bg-red-500 animate-pulse hover:bg-red-600"
                  : "bg-white/20 hover:bg-white/30"
              } disabled:opacity-50`}
            >
              {callStatus === "active" ? (
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              )}
            </button>
            <p className="mt-3 text-center text-sm text-indigo-100/80">
              {callStatus === "connecting"
                ? "מתחבר..."
                : callStatus === "active"
                ? "מדברים עם תומר..."
                : "לחצו לשיחה עם תומר, הנציג הדיגיטלי שלנו"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function MatchScorePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="mt-10">
      <p className="mb-4 text-center text-xs font-medium text-indigo-200/70">
        התאמה חכמה — לדוגמה בלבד
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {DEMO_MATCH_JOBS.map((job, i) => (
          <div
            key={job.title}
            className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm"
          >
            <p className="text-sm font-bold">{job.title}</p>
            <p className="text-xs text-indigo-200/70">{job.employer}</p>
            <p className="mt-1 text-xs text-indigo-100/60">{job.salary}</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-200/70">התאמה</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.2 + 0.8 }}
                  className="font-bold text-brand-300"
                >
                  {job.score}%
                </motion.span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-brand-400"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${job.score}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-brand-900 via-brand-800 to-brand-700 px-4 py-16 text-white md:py-24">
      {/* Decorative blur circles */}
      <div className="absolute -top-24 -end-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -start-32 h-96 w-96 rounded-full bg-brand-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Badge */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            20+ שנה, 1,000+ עובדים, סוכנות #1 באילת
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-6 text-center text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
          ברק שירותים מסדרים לכם עבודה, דירה וארוחות באילת –{" "}
          <span className="bg-gradient-to-l from-indigo-200 to-white bg-clip-text text-transparent">
            תוך 3 ימים.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-indigo-100/90 md:text-xl">
          דירה מרוהטת מ-400 ₪ · 3 ארוחות ב-5 ₪ ליום · הסעות חינם · מענק 9,550 ₪
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-center text-base font-semibold text-white md:text-lg">
          הדרך לחיים החדשים שלכם באילת מתחילה כאן.
          <br className="hidden sm:block" />
          בחרו את הדרך המהירה ביותר עבורכם להגשת מועמדות:
        </p>

        {/* 3-widget grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <HeroCvWidget />
          <HeroChatWidget />
          <HeroVoiceWidget />
        </div>

        {/* Match Score Preview */}
        <MatchScorePreview />
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
