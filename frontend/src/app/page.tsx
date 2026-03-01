"use client";

import { useState, FormEvent } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "ראשי", href: "#" },
  { label: "משרות", href: "#jobs" },
  { label: "אודות", href: "#about" },
  { label: "בלוג", href: "#blog" },
];

const TOOL_LINKS = [
  { label: "לוח בקרה", href: "/dashboard" },
  { label: "צ׳אט סינון", href: "/outreach" },
  { label: "Facebook Hunter", href: "/fb-hunter" },
  { label: "Voice AI", href: "/voice-test" },
];

const TRUST_STATS = [
  { value: "50+", label: "מעסיקים פעילים", emoji: "🏢" },
  { value: "1,000+", label: "עובדים הושמו", emoji: "👥" },
  { value: "20+", label: "שנות ניסיון", emoji: "📅" },
  { value: "96%", label: "שביעות רצון", emoji: "⭐" },
];

const JOB_CATEGORIES = [
  {
    emoji: "🏨",
    title: "מלונאות",
    roles: ["קבלה", "חדרנות", "שירות חדרים", "קונסיירז׳"],
    href: "#",
  },
  {
    emoji: "🛍️",
    title: "קמעונאות",
    roles: ["מכירות", "קופאות", "מחסנאות", "ניהול סניף"],
    href: "#",
  },
  {
    emoji: "👗",
    title: "אופנה",
    roles: ["יועצות אופנה", "ויזואל", "ניהול חנות"],
    href: "#",
  },
  {
    emoji: "🛡️",
    title: "אבטחה",
    roles: ["מאבטחים", "סדרנים", "בקרת כניסה"],
    href: "#",
  },
  {
    emoji: "🍽️",
    title: "מסעדנות",
    roles: ["מלצרות", "ברמנים", "טבחים", "שטיפה"],
    href: "#",
  },
  {
    emoji: "⛽",
    title: "תחנות דלק",
    roles: ["תדלוקנים", "קופאים", "ניהול משמרת"],
    href: "#",
  },
];

const BENEFITS = [
  {
    emoji: "🏠",
    title: "מגורים מסובסדים",
    description: "דירות מרוהטות במיקום מרכזי באילת במחירים סמליים",
  },
  {
    emoji: "🍽️",
    title: "ארוחות",
    description: "ארוחות חמות במקום העבודה או קרדיט יומי לאוכל",
  },
  {
    emoji: "🚌",
    title: "הסעות חינם",
    description: "הסעות מאורגנות מהמגורים למקום העבודה וחזרה",
  },
  {
    emoji: "💰",
    title: "בונוס התמדה",
    description: "בונוסים חודשיים לעובדים שנשארים לתקופה ארוכה",
  },
  {
    emoji: "💵",
    title: "תשלום במזומן",
    description: "אפשרות למקדמות ותשלום מהיר ללא המתנה",
  },
  {
    emoji: "🤝",
    title: "ליווי אישי",
    description: "מנהל אישי שמלווה אתכם מרגע ההגעה ועד ההשתלבות",
  },
];

const TESTIMONIALS = [
  {
    name: "נועה כ.",
    role: "פקידת קבלה, מלון רויאל ביץ׳",
    quote:
      "הגעתי לאילת בלי לדעת אף אחד. ברק שירותים סידרו לי דירה, עבודה במלון מדהים, ותוך שבוע כבר הרגשתי בבית.",
    stars: 5,
  },
  {
    name: "איתי מ.",
    role: "מאבטח, קניון מול הים",
    quote:
      "אחרי הצבא חיפשתי משהו עם מגורים. קיבלתי עבודה תוך יומיים, דירה מרוהטת, והסעות. ממליץ בחום.",
    stars: 5,
  },
  {
    name: "מיכל ד.",
    role: "מוכרנית, קסטרו אילת",
    quote:
      "הצוות של ברק ממש דואג. כל בעיה שהייתה — טיפלו מהר. המשכורת תמיד בזמן ויש בונוסים נחמדים.",
    stars: 5,
  },
];

const FAQ_ITEMS = [
  {
    question: "מה כוללת חבילת המגורים?",
    answer:
      "החבילה כוללת דירה מרוהטת עם מיזוג, מקרר, כיריים ומכונת כביסה. הדירות ממוקמות במרכז אילת, קרוב לקווי ההסעה ולמרכזי הבילוי.",
  },
  {
    question: "כמה עולים המגורים?",
    answer:
      "המגורים מסובסדים באופן משמעותי. העלות החודשית היא סמלית — בין 400 ל-800 ש״ח לחודש, תלוי בסוג הדירה ומספר השותפים.",
  },
  {
    question: "האם צריך ניסיון קודם?",
    answer:
      "לרוב המשרות לא נדרש ניסיון קודם. אנחנו מספקים הכשרה מלאה במקום העבודה. יש משרות שדורשות ניסיון — נתאים לכם את המשרה המתאימה.",
  },
  {
    question: "מהי מעודפת (סטטוס מועדפת)?",
    answer:
      "מעודפת הוא סטטוס שמעניק הטבות מס לתושבי אילת ואזור הערבה. זה כולל פטור ממע״מ על שירותים מסוימים והפחתת מס הכנסה — כלומר יותר כסף נטו בכיס.",
  },
  {
    question: "כמה זמן לוקח למצוא עבודה?",
    answer:
      "בדרך כלל תוך 1-3 ימי עסקים מרגע שליחת קורות החיים. בתקופות שיא (קיץ, חגים) ההשמה יכולה להיות אפילו ביום הפנייה.",
  },
  {
    question: "האם יש הסעות לכל מקומות העבודה?",
    answer:
      "כן, אנחנו מפעילים מערך הסעות מאורגן שמכסה את כל אזורי התעסוקה העיקריים — מלונות, מרכזי קניות, אזור התעשייה ועוד.",
  },
  {
    question: "מה קורה אם העבודה לא מתאימה לי?",
    answer:
      "אנחנו מבינים שלא כל התאמה מושלמת. אם העבודה לא מתאימה, המנהל האישי שלכם ימצא לכם חלופה מהירה — בדרך כלל תוך ימים ספורים.",
  },
  {
    question: "איך מגישים מועמדות?",
    answer:
      "אפשר לשלוח קורות חיים דרך הטופס באתר, ליצור קשר בוואטסאפ, או להתקשר ישירות. צוות הגיוס שלנו יחזור אליכם תוך שעות.",
  },
];

const BLOG_POSTS = [
  {
    title: "המדריך המלא למעבר לאילת אחרי צבא",
    excerpt:
      "כל מה שצריך לדעת על מעבר לאילת — מגורים, עבודה, חיי לילה ומה באמת מחכה לכם בעיר הדרומית.",
    date: "2026-02-15",
    slug: "guide-moving-to-eilat",
  },
  {
    title: "5 סיבות לעבוד במלונאות באילת",
    excerpt:
      "תעשיית המלונאות באילת מציעה הזדמנויות ייחודיות — מקריירה בינלאומית ועד טיפים שמנים. הנה למה כדאי.",
    date: "2026-02-01",
    slug: "5-reasons-hotel-industry",
  },
  {
    title: "כמה באמת מרוויחים באילת? מדריך שכר 2026",
    excerpt:
      "פירוט שכר לפי תחום — מלונאות, קמעונאות, אבטחה ומסעדנות. כולל טיפים, בונוסים והטבות מעודפת.",
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
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <a href="#" className="text-xl font-bold text-brand-900">
          ברק שירותים
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
          {/* Tools dropdown */}
          <div className="group relative">
            <button className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600">
              כלים ▾
            </button>
            <div className="invisible absolute start-0 top-full w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg group-hover:visible">
              {TOOL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600"
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
            className="text-sm font-medium text-gray-600 hover:text-brand-600"
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
        <div className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-sm text-gray-700 hover:text-brand-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 border-t border-gray-100 pt-2">
            <p className="pb-1 text-xs font-semibold text-gray-400">כלים</p>
            {TOOL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-sm text-gray-700 hover:text-brand-600"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <a
              href={PHONE_URL}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-sm font-medium text-gray-700"
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
          🏆 הסוכנות המובילה להשמה באילת
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
          עבודה עם מגורים באילת
        </h1>
        <p className="mt-4 text-lg text-blue-100 md:text-xl">
          משרות מיידיות במלונאות, קמעונאות, אבטחה ומסעדנות — כולל דירה
          מסובסדת, ארוחות, הסעות וליווי אישי.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#apply"
            className="w-full rounded-lg bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-lg transition-transform hover:scale-105 sm:w-auto"
          >
            שלחו קורות חיים 📄
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-lg border-2 border-white/40 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            דברו איתנו בוואטסאפ 💬
          </a>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="bg-brand-50 px-4 py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
        {TRUST_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <span className="text-2xl">{stat.emoji}</span>
            <p className="mt-1 text-3xl font-extrabold text-brand-900">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600">{stat.label}</p>
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
}: {
  emoji: string;
  title: string;
  roles: string[];
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <span className="text-3xl">{emoji}</span>
      <h3 className="mt-3 text-lg font-bold text-brand-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{roles.join(" · ")}</p>
    </div>
  );
}

function JobCategories() {
  return (
    <section id="jobs" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-brand-900">
          תחומי העסקה
        </h2>
        <p className="mt-2 text-center text-gray-500">
          מגוון משרות בתחומים המובילים באילת
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {JOB_CATEGORIES.map((cat) => (
            <JobCategoryCard
              key={cat.title}
              emoji={cat.emoji}
              title={cat.title}
              roles={cat.roles}
            />
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
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <span className="text-3xl">{emoji}</span>
      <h3 className="mt-3 text-lg font-bold text-brand-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}

function WhyBarak() {
  return (
    <section id="about" className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-brand-900">
          למה ברק שירותים?
        </h2>
        <p className="mt-2 text-center text-gray-500">
          חבילה מלאה לעובד — לא רק משרה
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <BenefitCard
              key={b.title}
              emoji={b.emoji}
              title={b.title}
              description={b.description}
            />
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
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-3 text-yellow-400">{"★".repeat(stars)}</div>
      <p className="text-sm leading-relaxed text-gray-600">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="font-bold text-brand-900">{name}</p>
        <p className="text-xs text-gray-400">{role}</p>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-brand-900">
          מה אומרים העובדים שלנו
        </h2>
        <p className="mt-2 text-center text-gray-500">
          סיפורים אמיתיים מעובדים שהגיעו דרכנו
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard
              key={t.name}
              name={t.name}
              role={t.role}
              quote={t.quote}
              stars={t.stars}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex w-full items-center justify-between py-4 text-right"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-brand-900">
          {question}
        </span>
        <span className="ms-4 shrink-0 text-xl text-gray-400">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-gray-600">{answer}</p>
      )}
    </div>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-extrabold text-brand-900">
          שאלות נפוצות
        </h2>
        <p className="mt-2 text-center text-gray-500">
          תשובות לשאלות שנשאלות הכי הרבה
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
}: {
  title: string;
  excerpt: string;
  date: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-xs text-gray-400">{date}</p>
      <h3 className="mt-2 text-lg font-bold text-brand-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{excerpt}</p>
      <span className="mt-3 inline-block text-sm font-semibold text-brand-600">
        קראו עוד ←
      </span>
    </div>
  );
}

function BlogPreview() {
  return (
    <section id="blog" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-brand-900">
          מהבלוג שלנו
        </h2>
        <p className="mt-2 text-center text-gray-500">
          טיפים, מדריכים ועדכונים על עבודה ומגורים באילת
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <BlogPreviewCard
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
            />
          ))}
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
      <section id="apply" className="bg-brand-50 px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <span className="text-5xl">✅</span>
          <h2 className="mt-4 text-2xl font-extrabold text-brand-900">
            הפרטים נקלטו בהצלחה!
          </h2>
          <p className="mt-2 text-gray-600">
            צוות הגיוס שלנו יחזור אליכם תוך שעות ספורות. בינתיים, אפשר לדבר
            איתנו ישירות:
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
    <section id="apply" className="bg-brand-50 px-4 py-16">
      <div className="mx-auto max-w-lg">
        <h2 className="text-center text-3xl font-extrabold text-brand-900">
          הגישו מועמדות עכשיו
        </h2>
        <p className="mt-2 text-center text-gray-500">
          השאירו פרטים ונחזור אליכם תוך שעות
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
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <input
            type="tel"
            placeholder="מספר טלפון"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <select
            required
            value={formData.field}
            onChange={(e) =>
              setFormData({ ...formData, field: e.target.value })
            }
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
            שלחו מועמדות 🚀
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
          <p className="mt-2 text-sm text-blue-200">
            הסוכנות המובילה להשמת עובדים באילת. מעל 20 שנות ניסיון בגיוס,
            השמה וליווי עובדים.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold">צרו קשר</h4>
          <ul className="mt-2 space-y-2 text-sm text-blue-200">
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
          <ul className="mt-2 space-y-2 text-sm text-blue-200">
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
              <a href="#blog" className="hover:text-white">
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
          <ul className="mt-2 space-y-2 text-sm text-blue-200">
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
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/20 pt-6 text-center text-sm text-blue-300">
        © {new Date().getFullYear()} ברק שירותים — כל הזכויות שמורות
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <JobCategories />
        <WhyBarak />
        <Testimonials />
        <FaqSection />
        <BlogPreview />
        <QuickApplicationForm />
      </main>
      <Footer />
    </>
  );
}
