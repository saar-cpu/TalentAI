import type { Metadata } from "next";
import EmployerFaq from "./EmployerFaq";

export const metadata: Metadata = {
  title: "למעסיקים — גיוס עובדים באילת עם AI | ברק שירותים",
  description:
    "מועמדים מסוננים, מותאמים ומוכנים — תוך 48 שעות. גיוס מבוסס AI למלונות, קמעונאות, אבטחה ומסעדנות באילת. 50+ מעסיקים סומכים עלינו.",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const WHATSAPP_EMPLOYER_URL =
  "https://wa.me/9720738020145?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%A1%D7%99%D7%A7%20%D7%95%D7%9E%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%20%D7%92%D7%99%D7%95%D7%A1";
const PHONE_NUMBER = "073-802-0145";
const PHONE_URL = "tel:+9720738020145";
const EMAIL = "jobs@eilatjobs.com";

const NAV_LINKS = [
  { label: "ראשי", href: "/" },
  { label: "למעסיקים", href: "/employers", active: true },
  { label: "בלוג", href: "/blog" },
];

const TRUST_STATS = [
  { value: "50+", label: "מעסיקים פעילים", icon: "🏢" },
  { value: "1,000+", label: "השמות מוצלחות", icon: "✅" },
  { value: "3 ימים", label: "זמן אספקה ממוצע", icon: "⚡" },
  { value: "96%", label: "שביעות רצון", icon: "⭐" },
];

const PAIN_POINTS = [
  {
    icon: "🐌",
    title: "חיפוש איטי ומתיש",
    description: "שבועות של פרסום מודעות, סינון קורות חיים ותיאום ראיונות — בזמן שהמשמרות ריקות.",
  },
  {
    icon: "📄",
    title: "קורות חיים לא רלוונטיים",
    description: "עשרות פניות מאנשים שלא מתאימים, לא זמינים, או לא מתכוונים להגיע.",
  },
  {
    icon: "🚪",
    title: "תחלופה גבוהה",
    description: "עובדים שעוזבים אחרי שבועיים כי לא מצאו דירה, לא הגיעו הסעות, או שהתפקיד לא התאים.",
  },
  {
    icon: "📵",
    title: "תקשורת שבורה",
    description: "סוכנויות שלא עונות, לא מעדכנות, ולא לוקחות אחריות אחרי ההשמה.",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "שלחו דרישות",
    description: "ספרו לנו איזה תפקיד, כמה עובדים, ומתי צריך. שיחה של 5 דקות.",
  },
  {
    step: "02",
    title: "ה-AI מסנן ומתאים",
    description: "המערכת סורקת את מאגר המועמדים, מסננת לפי כישורים ומתאימה לדרישות שלכם.",
  },
  {
    step: "03",
    title: "מועמדים מוכנים",
    description: "תוך 48 שעות מקבלים פרופילים מותאמים. אתם רק בוחרים ומראיינים.",
  },
];

const AI_FEATURES = [
  {
    icon: "🤖",
    title: "צ׳אטבוט סינון חכם",
    description: "AI שמנהל שיחת סינון בעברית עם כל מועמד — זמינות, ניסיון, העדפות — לפני שמגיע אליכם.",
  },
  {
    icon: "🎯",
    title: "התאמת משרות אוטומטית",
    description: "אלגוריתם שמתאים בין דרישות המשרה לכישורי המועמד ומדרג לפי אחוז התאמה.",
  },
  {
    icon: "📱",
    title: "דפי נחיתה ממוקדים",
    description: "דפי גיוס ייעודיים לכל קמפיין — עם טופס מהיר שממיר ב-15 שניות במקום דקות.",
  },
  {
    icon: "🔍",
    title: "Facebook Hunter",
    description: "AI שמזהה פוסטים של מחפשי עבודה ברשתות חברתיות ומגיב עם הצעה מותאמת.",
  },
  {
    icon: "📞",
    title: "Voice AI לשימור",
    description: "סוכן קולי בעברית שמתקשר למועמדים שנשרו, מחדש עניין ומחזיר אותם לתהליך.",
  },
  {
    icon: "📊",
    title: "דשבורד בזמן אמת",
    description: "מעקב אחרי כל הלידים, סטטוסים ושלבי גיוס — הכל במקום אחד, בלי אקסלים.",
  },
];

const PRICING_TIERS = [
  {
    name: "בסיסי",
    price: "2,500 ₪",
    unit: "להשמה",
    description: "למעסיקים עם צרכים נקודתיים",
    features: [
      "סינון מועמדים ידני",
      "התאמה לפי דרישות בסיסיות",
      "עד 5 מועמדים למשרה",
      "תמיכה טלפונית",
      "אחריות 14 יום",
    ],
    highlighted: false,
    cta: "התחילו עכשיו",
  },
  {
    name: "מקצועי",
    price: "1,490 ₪",
    unit: "לחודש + 1,500 ₪ להשמה",
    description: "הפתרון המלא לגיוס שוטף",
    features: [
      "סינון AI אוטומטי",
      "התאמה חכמה לפי ציון",
      "מועמדים ללא הגבלה",
      "מנהל לקוח ייעודי",
      "אחריות 30 יום + החלפה",
      "דשבורד בזמן אמת",
      "קמפיינים ממוקדים",
    ],
    highlighted: true,
    cta: "הצטרפו עכשיו",
  },
  {
    name: "ארגוני",
    price: "מותאם אישית",
    unit: "",
    description: "לרשתות מלונות וארגונים גדולים",
    features: [
      "כל התכונות של מקצועי",
      "גיוס בכמויות (10+ משרות)",
      "API למערכות HR",
      "SLA זמני אספקה",
      "דוחות אנליטיקה מתקדמים",
      "הדרכת מנהלים",
      "תמחור volume מוזל",
    ],
    highlighted: false,
    cta: "דברו איתנו",
  },
];

const COMPARISON_FEATURES = [
  { feature: "סינון מועמדים", basic: true, pro: "AI", enterprise: "AI" },
  { feature: "התאמת משרות", basic: "ידני", pro: "אוטומטי", enterprise: "אוטומטי" },
  { feature: "מועמדים למשרה", basic: "עד 5", pro: "ללא הגבלה", enterprise: "ללא הגבלה" },
  { feature: "אחריות החלפה", basic: "14 יום", pro: "30 יום", enterprise: "60 יום" },
  { feature: "מנהל לקוח ייעודי", basic: false, pro: true, enterprise: true },
  { feature: "דשבורד בזמן אמת", basic: false, pro: true, enterprise: true },
  { feature: "קמפיינים ממוקדים", basic: false, pro: true, enterprise: true },
  { feature: "Facebook Hunter", basic: false, pro: true, enterprise: true },
  { feature: "Voice AI", basic: false, pro: false, enterprise: true },
  { feature: "API למערכות HR", basic: false, pro: false, enterprise: true },
  { feature: "SLA זמני אספקה", basic: false, pro: false, enterprise: true },
];

const EMPLOYER_TESTIMONIALS = [
  {
    name: "רונית כ.",
    role: "מנהלת משאבי אנוש, רשת מלונות",
    quote:
      "עברנו מחיפוש של 3 שבועות למשרה — ל-3 ימים. ה-AI מסנן בדיוק את מי שאנחנו צריכים, ושיעור השימור עלה ב-40% מאז שהתחלנו לעבוד עם ברק.",
    stars: 5,
  },
  {
    name: "אבי מ.",
    role: "בעלים, רשת חנויות קמעונאות",
    quote:
      "במקום לקבל 50 קורות חיים ולזרוק 45 — מקבל 5 מועמדים מדויקים שכבר עברו סינון. חוסך לי שעות ביום ומשרה של מגייסת פנימית.",
    stars: 5,
  },
  {
    name: "דני ש.",
    role: "מנהל אבטחה, קניון",
    quote:
      "צריך 3 מאבטחים לשישי? מתקשר ביום רביעי ויש. הם מגיעים מוכנים, עם דירה ואוכל מסודרים — אז לא עוזבים אחרי שבוע.",
    stars: 5,
  },
];

// ─── Helper ──────────────────────────────────────────────────────────────────

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-green-600 font-bold">✓</span>;
  if (value === false) return <span className="text-gray-300">—</span>;
  return <span className="text-sm text-gray-700">{value}</span>;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EmployersPage() {
  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="/" className="text-xl font-bold text-brand-900">
            ברק שירותים
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.active
                    ? "text-brand-600"
                    : "text-gray-600 hover:text-brand-600"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="hidden rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 md:inline-block"
          >
            צרו קשר
          </a>
        </div>
      </header>

      <main>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-bl from-brand-900 to-brand-700 px-4 py-20 text-center text-white md:py-28">
          <div className="mx-auto max-w-3xl">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur">
              פתרון גיוס מבוסס AI למעסיקים באילת
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              מועמדים מסוננים, מותאמים ומוכנים
              <br className="hidden md:block" />
              — תוך 48 שעות
            </h1>
            <p className="mt-4 text-lg text-blue-100 md:text-xl">
              חסכו שבועות של סינון ותיאומים. ה-AI שלנו מתאים לכם בדיוק את העובדים
              שאתם צריכים — עם דיור, ארוחות והסעות מסודרים מראש.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#contact"
                className="w-full rounded-lg bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-lg transition-transform hover:scale-105 sm:w-auto"
              >
                קבלו הצעת מחיר
              </a>
              <a
                href="#pricing"
                className="w-full rounded-lg border-2 border-white/40 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                ראו מסלולים ומחירים
              </a>
            </div>
          </div>
        </section>

        {/* ── Trust Bar ────────────────────────────────────────────── */}
        <section className="bg-brand-50 px-4 py-10">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl">{stat.icon}</span>
                <p className="mt-1 text-3xl font-extrabold text-brand-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Problem Section ──────────────────────────────────────── */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900">
              עדיין מגייסים בשיטות של 2010?
            </h2>
            <p className="mt-2 text-center text-gray-500">
              רוב המעסיקים באילת מבזבזים זמן וכסף על תהליכי גיוס שבורים
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PAIN_POINTS.map((pain) => (
                <div
                  key={pain.title}
                  className="rounded-xl border border-red-100 bg-red-50/50 p-6 text-center"
                >
                  <span className="text-3xl">{pain.icon}</span>
                  <h3 className="mt-3 text-lg font-bold text-gray-900">
                    {pain.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {pain.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How AI Works ─────────────────────────────────────────── */}
        <section className="bg-gray-50 px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900">
              איך זה עובד?
            </h2>
            <p className="mt-2 text-center text-gray-500">
              3 צעדים מדרישות משרה למועמד מוכן
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.step} className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
                    {step.step}
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="absolute start-1/2 top-7 hidden w-full border-t-2 border-dashed border-brand-200 md:block" />
                  )}
                  <h3 className="mt-4 text-lg font-bold text-brand-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI Features ──────────────────────────────────────────── */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900">
              טכנולוגיה שעובדת בשבילכם
            </h2>
            <p className="mt-2 text-center text-gray-500">
              6 כלי AI שמייעלים את הגיוס — ועובדים 24/7
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {AI_FEATURES.map((feat) => (
                <div
                  key={feat.title}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="text-3xl">{feat.icon}</span>
                  <h3 className="mt-3 text-lg font-bold text-brand-900">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Tiers ────────────────────────────────────────── */}
        <section id="pricing" className="bg-gray-50 px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900">
              מסלולים ומחירים
            </h2>
            <p className="mt-2 text-center text-gray-500">
              משלמים רק על תוצאות. בלי חוזים ארוכי טווח.
            </p>
            <div className="mt-10 grid items-start gap-6 md:grid-cols-3">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md ${
                    tier.highlighted
                      ? "relative border-2 border-brand-600 lg:scale-105"
                      : "border border-gray-100"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="absolute -top-3.5 start-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white">
                      הכי פופולרי
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-brand-900">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-brand-900">
                      {tier.price}
                    </span>
                    {tier.unit && (
                      <span className="mr-1 text-sm text-gray-500">
                        {tier.unit}
                      </span>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="mt-0.5 text-green-500">✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={`mt-8 block rounded-lg py-3 text-center text-sm font-bold transition-colors ${
                      tier.highlighted
                        ? "bg-brand-600 text-white hover:bg-brand-700"
                        : "border border-brand-600 text-brand-600 hover:bg-brand-50"
                    }`}
                  >
                    {tier.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ─────────────────────────────────────── */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900">
              השוואת מסלולים
            </h2>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 text-right font-bold text-brand-900">
                      תכונה
                    </th>
                    <th className="py-3 text-center font-bold text-brand-900">
                      בסיסי
                    </th>
                    <th className="py-3 text-center font-bold text-brand-600">
                      מקצועי
                    </th>
                    <th className="py-3 text-center font-bold text-brand-900">
                      ארגוני
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-gray-100"
                    >
                      <td className="py-3 text-right text-gray-700">
                        {row.feature}
                      </td>
                      <td className="py-3 text-center">
                        <CellValue value={row.basic} />
                      </td>
                      <td className="py-3 text-center bg-brand-50/50">
                        <CellValue value={row.pro} />
                      </td>
                      <td className="py-3 text-center">
                        <CellValue value={row.enterprise} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Employer Testimonials ────────────────────────────────── */}
        <section className="bg-gray-50 px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900">
              מעסיקים מספרים
            </h2>
            <p className="mt-2 text-center text-gray-500">
              מלונות, חנויות וחברות אבטחה — כולם חסכו זמן וכסף
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {EMPLOYER_TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-3 text-yellow-400">
                    {"★".repeat(t.stars)}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <p className="font-bold text-brand-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900">
              שאלות נפוצות למעסיקים
            </h2>
            <p className="mt-2 text-center text-gray-500">
              הכל שקוף — תהליך, מחירים ותנאים
            </p>
            <div className="mt-10">
              <EmployerFaq />
            </div>
          </div>
        </section>

        {/* ── Contact CTA ──────────────────────────────────────────── */}
        <section
          id="contact"
          className="bg-gradient-to-bl from-brand-900 to-brand-700 px-4 py-16 text-center text-white"
        >
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold">
              מוכנים לגייס חכם יותר?
            </h2>
            <p className="mt-3 text-lg text-blue-100">
              שלחו הודעה, התקשרו או כתבו — ונחזור עם הצעה מותאמת תוך שעות
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={WHATSAPP_EMPLOYER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-lg bg-green-500 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 sm:w-auto"
              >
                WhatsApp למעסיקים 💬
              </a>
              <a
                href={PHONE_URL}
                className="w-full rounded-lg border-2 border-white/40 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                📞 {PHONE_NUMBER}
              </a>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              ✉️{" "}
              <a href={`mailto:${EMAIL}`} className="underline hover:text-white">
                {EMAIL}
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* ── Sticky Mobile CTA ──────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-green-600 bg-green-500 p-3 text-center md:hidden">
        <a
          href={WHATSAPP_EMPLOYER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm font-bold text-white"
        >
          💬 דברו איתנו ב-WhatsApp
        </a>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-brand-900 px-4 py-10 text-white md:pb-10 pb-20">
        <div className="mx-auto max-w-6xl text-center">
          <a href="/" className="text-lg font-bold">
            ברק שירותים
          </a>
          <p className="mt-2 text-sm text-blue-200">
            20+ שנה של השמת עובדים באילת. גיוס חכם מבוסס AI.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-blue-200">
            <a href="/" className="hover:text-white">
              ראשי
            </a>
            <a href="/employers" className="hover:text-white">
              למעסיקים
            </a>
            <a href="/blog" className="hover:text-white">
              בלוג
            </a>
          </div>
          <div className="mt-6 border-t border-white/20 pt-6 text-sm text-blue-300">
            © {new Date().getFullYear()} ברק שירותים — כל הזכויות שמורות
          </div>
        </div>
      </footer>
    </>
  );
}
