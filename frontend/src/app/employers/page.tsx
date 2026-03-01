import type { Metadata } from "next";
import EmployerFaq from "./EmployerFaq";

export const metadata: Metadata = {
  title: "למעסיקים — מלאו משרות תוך 48 שעות עם AI | ברק שירותים",
  description:
    "מועמדים מסוננים ומותאמים תוך 48 שעות. גיוס AI למלונות, קמעונאות, אבטחה ומסעדנות באילת. 50+ מעסיקים, 85% שימור, השמה מ-2,500 ₪. ללא התחייבות.",
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
  { value: "50+", label: "מעסיקים פעילים באילת", icon: "🏢" },
  { value: "1,000+", label: "השמות מוצלחות", icon: "✅" },
  { value: "3 ימים", label: "ממשרה פתוחה לעובד במשמרת", icon: "⚡" },
  { value: "85%", label: "שימור אחרי 6 חודשים", icon: "📈" },
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
    title: "שיחה של 5 דקות",
    description: "ספרו לנו איזה תפקיד, כמה עובדים, ומתי צריך. בלי טפסים ארוכים.",
  },
  {
    step: "02",
    title: "AI סורק ומתאים",
    description: "המערכת מסננת אלפי מועמדים, מדרגת לפי התאמה, ובונה רשימה קצרה עם ציון לכל מועמד.",
  },
  {
    step: "03",
    title: "עובדים במשמרת",
    description: "תוך 48 שעות מקבלים מועמדים מסוננים — עם דירה, ארוחות והסעות מסודרים. אתם רק מאשרים.",
  },
];

const AI_FEATURES = [
  {
    icon: "🤖",
    title: "0 שעות סינון ידני",
    description: "צ׳אטבוט AI מנהל שיחת סינון בעברית עם כל מועמד — זמינות, ניסיון, העדפות — ומעביר אליכם רק מתאימים.",
  },
  {
    icon: "🎯",
    title: "90% דיוק בהתאמה",
    description: "אלגוריתם שמדרג כל מועמד לפי ציון התאמה לדרישות שלכם. בלי ניחושים — רק מספרים.",
  },
  {
    icon: "📱",
    title: "15 שניות להגשת מועמדות",
    description: "דפי גיוס ייעודיים לכל קמפיין עם טופס מהיר שממיר — במקום טפסים של 5 דקות שמועמדים נוטשים.",
  },
  {
    icon: "🔍",
    title: "מועמדים שלא פרסמתם עליהם",
    description: "AI שמזהה פוסטים של מחפשי עבודה ברשתות חברתיות ומגיב עם הצעה מותאמת — לפני המתחרים.",
  },
  {
    icon: "📞",
    title: "40% פחות נשירת מועמדים",
    description: "סוכן קולי בעברית שמתקשר למועמדים שהפסיקו להגיב, מחדש עניין ומחזיר אותם לתהליך.",
  },
  {
    icon: "📊",
    title: "שקיפות מלאה בזמן אמת",
    description: "דשבורד עם כל הלידים, סטטוסים ושלבי גיוס — הכל במקום אחד, בלי אקסלים ובלי שיחות סטטוס.",
  },
];

const PRICING_TIERS = [
  {
    name: "ארגוני",
    price: "מותאם אישית",
    unit: "",
    description: "לרשתות מלונות וארגונים עם 10+ משרות",
    features: [
      "כל התכונות של מקצועי",
      "גיוס בכמויות (10+ משרות במקביל)",
      "API לחיבור למערכות HR קיימות",
      "SLA מובטח על זמני אספקה",
      "דוחות אנליטיקה ותחזיות",
      "הדרכת מנהלי גיוס",
      "תמחור volume — ככל שמגייסים יותר, משלמים פחות",
    ],
    highlighted: false,
    cta: "תאמו שיחת ייעוץ",
  },
  {
    name: "מקצועי",
    price: "1,490 ₪",
    unit: "לחודש + 1,500 ₪ להשמה",
    description: "למעסיקים שמגייסים כל חודש ורוצים AI שעובד בשבילם",
    features: [
      "סינון AI אוטומטי — 0 שעות סינון ידני",
      "התאמה חכמה עם ציון לכל מועמד",
      "מועמדים ללא הגבלה",
      "מנהל לקוח ייעודי שמכיר את העסק שלכם",
      "אחריות 30 יום — לא מתאים? מחליפים בחינם",
      "דשבורד בזמן אמת",
      "קמפיינים ממוקדים ברשתות חברתיות",
    ],
    highlighted: true,
    cta: "קבלו מועמדים תוך 48 שעות",
  },
  {
    name: "בסיסי",
    price: "2,500 ₪",
    unit: "להשמה",
    description: "צריכים עובד אחד או שניים? משלמים רק כשמוצאים",
    features: [
      "סינון מועמדים על ידי הצוות שלנו",
      "התאמה לפי דרישות המשרה",
      "עד 5 מועמדים למשרה",
      "תמיכה טלפונית",
      "אחריות 14 יום",
    ],
    highlighted: false,
    cta: "שלחו דרישות משרה",
  },
];

const COMPARISON_FEATURES = [
  { feature: "סינון מועמדים", enterprise: "AI", pro: "AI", basic: "ידני" },
  { feature: "התאמת משרות", enterprise: "אוטומטי", pro: "אוטומטי", basic: "ידני" },
  { feature: "מועמדים למשרה", enterprise: "ללא הגבלה", pro: "ללא הגבלה", basic: "עד 5" },
  { feature: "אחריות החלפה", enterprise: "60 יום", pro: "30 יום", basic: "14 יום" },
  { feature: "מנהל לקוח ייעודי", enterprise: true, pro: true, basic: false },
  { feature: "דשבורד בזמן אמת", enterprise: true, pro: true, basic: false },
  { feature: "קמפיינים ממוקדים", enterprise: true, pro: true, basic: false },
  { feature: "Facebook Hunter", enterprise: true, pro: true, basic: false },
  { feature: "Voice AI", enterprise: true, pro: false, basic: false },
  { feature: "API למערכות HR", enterprise: true, pro: false, basic: false },
  { feature: "SLA זמני אספקה", enterprise: true, pro: false, basic: false },
];

const EMPLOYER_TESTIMONIALS = [
  {
    name: "רונית כ.",
    role: "מנהלת משאבי אנוש, רשת מלונות",
    metric: "מ-3 שבועות ל-3 ימים",
    quote:
      "עברנו מחיפוש של 3 שבועות למשרה — ל-3 ימים. ה-AI מסנן בדיוק את מי שאנחנו צריכים, ושיעור השימור עלה ב-40% מאז שהתחלנו לעבוד עם ברק.",
    stars: 5,
  },
  {
    name: "אבי מ.",
    role: "בעלים, רשת חנויות קמעונאות",
    metric: "חוסך משרת מגייסת פנימית",
    quote:
      "במקום לקבל 50 קורות חיים ולזרוק 45 — מקבל 5 מועמדים מדויקים שכבר עברו סינון. חוסך לי שעות ביום ומשרה של מגייסת פנימית.",
    stars: 5,
  },
  {
    name: "דני ש.",
    role: "מנהל אבטחה, קניון",
    metric: "3 מאבטחים תוך 48 שעות",
    quote:
      "צריך 3 מאבטחים לשישי? מתקשר ביום רביעי ויש. הם מגיעים מוכנים, עם דירה ואוכל מסודרים — אז לא עוזבים אחרי שבוע.",
    stars: 5,
  },
];

// ─── Helper ──────────────────────────────────────────────────────────────────

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-green-600 font-bold">✓</span>;
  if (value === false) return <span className="text-slate-300 dark:text-slate-600">—</span>;
  return <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EmployersPage() {
  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="/" className="text-xl font-bold text-brand-900 dark:text-white">
            ברק שירותים
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.active
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
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
              50+ מעסיקים באילת כבר מגייסים ככה
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              מלאו משרות תוך 48 שעות
              <br className="hidden md:block" />
              — בלי לסנן אלפי קורות חיים
            </h1>
            <p className="mt-4 text-lg text-indigo-100 md:text-xl">
              ה-AI שלנו מסנן, מתאים ומדרג מועמדים — ואנחנו מסדרים להם דירה,
              ארוחות והסעות. אתם מקבלים עובדים מוכנים למשמרת, לא ערימת קורות חיים.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#contact"
                className="w-full rounded-lg bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-lg transition-transform hover:scale-105 sm:w-auto"
              >
                קבלו מועמדים מותאמים תוך 48 שעות
              </a>
              <a
                href="#pricing"
                className="w-full rounded-lg border-2 border-white/40 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                ראו מסלולים ומחירים
              </a>
            </div>
            <p className="mt-4 text-sm text-indigo-200">
              ללא התחייבות. משלמים רק על השמה מוצלחת.
            </p>
          </div>
        </section>

        {/* ── Trust Bar ────────────────────────────────────────────── */}
        <section className="bg-brand-50 dark:bg-slate-800 px-4 py-10">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl">{stat.icon}</span>
                <p className="mt-1 text-3xl font-extrabold text-brand-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Problem Section ──────────────────────────────────────── */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
              עדיין מגייסים בשיטות של 2010?
            </h2>
            <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
              רוב המעסיקים באילת מבזבזים זמן וכסף על תהליכי גיוס שבורים
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PAIN_POINTS.map((pain) => (
                <div
                  key={pain.title}
                  className="rounded-xl border border-red-100 dark:border-red-800 bg-red-50/50 dark:bg-red-950/50 p-6 text-center"
                >
                  <span className="text-3xl">{pain.icon}</span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {pain.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {pain.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How AI Works ─────────────────────────────────────────── */}
        <section className="bg-slate-50 dark:bg-slate-800 px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
              משיחה של 5 דקות — לעובד במשמרת
            </h2>
            <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
              3 צעדים. 48 שעות. אפס כאב ראש.
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.step} className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
                    {step.step}
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="absolute start-1/2 top-7 hidden w-full border-t-2 border-dashed border-brand-200 dark:border-brand-800 md:block" />
                  )}
                  <h3 className="mt-4 text-lg font-bold text-brand-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
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
            <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
              מה ה-AI שלנו חוסך לכם?
            </h2>
            <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
              6 כלים שעובדים 24/7 — כדי שהצוות שלכם יתעסק בעבודה, לא בגיוס
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {AI_FEATURES.map((feat) => (
                <div
                  key={feat.title}
                  className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="text-3xl">{feat.icon}</span>
                  <h3 className="mt-3 text-lg font-bold text-brand-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Tiers ────────────────────────────────────────── */}
        <section id="pricing" className="bg-slate-50 dark:bg-slate-800 px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
              משלמים רק על תוצאות
            </h2>
            <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
              בלי חוזים ארוכי טווח. לא מרוצים מההשמה? מחליפים בחינם.
            </p>
            <div className="mx-auto mt-6 max-w-xl rounded-lg border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-slate-800 px-6 py-4 text-center">
              <p className="text-sm font-medium text-brand-900 dark:text-white">
                💡 מעסיק ממוצע באילת מבזבז <strong>8,000-12,000 ₪</strong> על
                פרסום מודעות, סינון קורות חיים וראיונות לכל משרה.
                <br />
                עם ברק — <strong>השמה מלאה מ-2,500 ₪</strong>, כולל סינון, התאמה
                ואחריות.
              </p>
            </div>
            <div className="mt-10 grid items-start gap-6 md:grid-cols-3">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-sm transition-shadow hover:shadow-md ${
                    tier.highlighted
                      ? "relative border-2 border-brand-600 lg:scale-105"
                      : "border border-slate-100 dark:border-slate-700"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="absolute -top-3.5 start-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white">
                      הכי פופולרי
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-brand-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tier.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-brand-900 dark:text-white">
                      {tier.price}
                    </span>
                    {tier.unit && (
                      <span className="mr-1 text-sm text-slate-500 dark:text-slate-400">
                        {tier.unit}
                      </span>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
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
                        : "border border-brand-600 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900"
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
            <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
              השוואת מסלולים
            </h2>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                    <th className="py-3 text-right font-bold text-brand-900 dark:text-white">
                      תכונה
                    </th>
                    <th className="py-3 text-center font-bold text-brand-900 dark:text-white">
                      ארגוני
                    </th>
                    <th className="py-3 text-center font-bold text-brand-600 dark:text-brand-400">
                      מקצועי
                    </th>
                    <th className="py-3 text-center font-bold text-brand-900 dark:text-white">
                      בסיסי
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-slate-100 dark:border-slate-700"
                    >
                      <td className="py-3 text-right text-slate-700 dark:text-slate-300">
                        {row.feature}
                      </td>
                      <td className="py-3 text-center">
                        <CellValue value={row.enterprise} />
                      </td>
                      <td className="py-3 text-center bg-brand-50/50 dark:bg-slate-800/50">
                        <CellValue value={row.pro} />
                      </td>
                      <td className="py-3 text-center">
                        <CellValue value={row.basic} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Employer Testimonials ────────────────────────────────── */}
        <section className="bg-slate-50 dark:bg-slate-800 px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
              למה 50+ מעסיקים באילת בחרו בנו?
            </h2>
            <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
              מלונות, חנויות וחברות אבטחה — כולם חסכו זמן, כסף ותחלופת עובדים
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {EMPLOYER_TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm"
                >
                  <span className="mb-3 inline-block rounded-full bg-green-50 dark:bg-green-950 px-3 py-1 text-xs font-bold text-green-700">
                    {t.metric}
                  </span>
                  <div className="mb-3 text-yellow-400">
                    {"★".repeat(t.stars)}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                    <p className="font-bold text-brand-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-extrabold text-brand-900 dark:text-white">
              שאלות נפוצות למעסיקים
            </h2>
            <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
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
              המשמרת הבאה לא צריכה להיות ריקה
            </h2>
            <p className="mt-3 text-lg text-indigo-100">
              שלחו דרישות משרה עכשיו — ותוך 48 שעות נשלח מועמדים מסוננים.
              <br />
              בלי התחייבות. בלי חוזים. משלמים רק על השמה מוצלחת.
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
            <p className="mt-4 text-sm text-indigo-200">
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
          <p className="mt-2 text-sm text-indigo-200">
            20+ שנה של השמת עובדים באילת. גיוס חכם מבוסס AI.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-indigo-200">
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
          <div className="mt-6 border-t border-white/20 pt-6 text-sm text-indigo-300">
            © {new Date().getFullYear()} ברק שירותים — כל הזכויות שמורות
          </div>
        </div>
      </footer>
    </>
  );
}
