import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "כמה נשאר בכיס? חישוב שכר אמיתי לעובד באילת 2026 | ברק שירותים",
  description:
    "חישוב שכר מלא לעובד באילת 2026 — ברוטו, נטו, הוצאות מחייה, מענקים והטבות מס. השוואה מול תל אביב עם מספרים אמיתיים.",
  openGraph: {
    title: "כמה נשאר בכיס? חישוב שכר אמיתי לעובד באילת 2026",
    description:
      "ברוטו 7,500 — אבל אחרי מגורים ב-400 ש״ח, אוכל ב-160 ש״ח ואפס נסיעות? בואו נעשה את החשבון.",
    type: "article",
    locale: "he_IL",
  },
};

const WHATSAPP_URL = "https://wa.me/9720738020145";
const PHONE_URL = "tel:+9720738020145";

export default function EilatSalaryGuidePage() {
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
            <Link
              href="/blog"
              className="text-sm font-medium text-brand-600 dark:text-brand-400"
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

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400">
            ראשי
          </Link>
          {" / "}
          <Link href="/blog" className="hover:text-brand-600 dark:hover:text-brand-400">
            בלוג
          </Link>
          {" / "}
          <span className="text-slate-600 dark:text-slate-400">חישוב שכר באילת 2026</span>
        </nav>

        {/* Hero */}
        <header className="mb-10">
          <span className="inline-block rounded-full bg-brand-50 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
            שכר ומענקים
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-brand-900 dark:text-white md:text-4xl">
            כמה נשאר בכיס? חישוב שכר אמיתי לעובד באילת 2026
          </h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
            ברוטו 7,500 — אבל אחרי מגורים ב-400 ש״ח, אוכל ב-160 ש״ח ואפס
            נסיעות? בואו נעשה את החשבון. עם מספרים אמיתיים, טבלאות והשוואה מול תל אביב.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            <span>20 בינואר 2026</span>
            <span>·</span>
            <span>קריאה של 7 דקות</span>
          </div>
        </header>

        {/* ── Article body ── */}
        <article className="prose-article space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed">

          {/* 1. הקדמה */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              למה &quot;כמה מרוויחים&quot; זו השאלה הלא נכונה
            </h2>
            <p>
              כשמישהו שואל &quot;כמה מרוויחים באילת?&quot; — התשובה תמיד
              מאכזבת: 6,000-8,000 ש״ח ברוטו למשרת כניסה. זה נשמע בינוני.
              אבל זו השאלה הלא נכונה.
            </p>
            <p>
              השאלה הנכונה היא: <strong className="text-brand-900 dark:text-white">כמה נשאר בכיס בסוף החודש?</strong> כי
              באילת, ההוצאות שלכם נמוכות בצורה דרמטית — ומה שנשאר הוא
              הרבה, הרבה יותר ממה שחושבים. בואו נעשה את החשבון ביחד.
            </p>
          </section>

          {/* 2. שכר לפי תחום */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              טווחי שכר לפי תחום (ברוטו, 2026)
            </h2>
            <p>
              אלו טווחי השכר הנפוצים למשרות כניסה באילת. שכר בפועל תלוי
              בניסיון, שעות נוספות, טיפים ומעסיק ספציפי:
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-50 dark:bg-slate-800 text-brand-900 dark:text-white">
                    <th className="px-4 py-3 text-right font-semibold">תחום</th>
                    <th className="px-4 py-3 text-right font-semibold">שכר בסיס</th>
                    <th className="px-4 py-3 text-right font-semibold">עם שעות נוספות/טיפים</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr>
                    <td className="px-4 py-3 font-medium">🏨 מלונאות</td>
                    <td className="px-4 py-3">6,500-7,500 ש״ח</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">8,000-12,000 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">🛍️ קמעונאות</td>
                    <td className="px-4 py-3">6,000-7,000 ש״ח</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">7,500-9,500 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">🛡️ אבטחה</td>
                    <td className="px-4 py-3">7,000-8,000 ש״ח</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">9,000-11,000 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">🍽️ מסעדנות</td>
                    <td className="px-4 py-3">6,000-7,000 ש״ח</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">8,000-13,000 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">⛽ תחנות דלק</td>
                    <td className="px-4 py-3">6,500-7,500 ש״ח</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">8,000-10,000 ש״ח</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              * מלצרים ומלצריות עם טיפים יכולים להגיע ל-200-400 ש״ח נוספים
              ביום בעונת התיירות (יולי-אוגוסט, חגים).
            </p>
          </section>

          {/* 3. השוואת הוצאות */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              הוצאות חודשיות: אילת מול תל אביב
            </h2>
            <p>
              כאן מתחיל הקסם. ניקח עובד שמרוויח 7,500 ש״ח ברוטו בשני
              המקומות ונשווה מה נשאר:
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-50 dark:bg-slate-800 text-brand-900 dark:text-white">
                    <th className="px-4 py-3 text-right font-semibold">סעיף</th>
                    <th className="px-4 py-3 text-right font-semibold">תל אביב</th>
                    <th className="px-4 py-3 text-right font-semibold">אילת (דרך ברק)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr>
                    <td className="px-4 py-3 font-medium">שכר ברוטו</td>
                    <td className="px-4 py-3">7,500 ש״ח</td>
                    <td className="px-4 py-3">7,500 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">נטו (אחרי מס)</td>
                    <td className="px-4 py-3">6,400 ש״ח</td>
                    <td className="px-4 py-3">6,600 ש״ח *</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">שכירות</td>
                    <td className="px-4 py-3 text-red-500">−3,200 ש״ח</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400">−400 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">אוכל</td>
                    <td className="px-4 py-3 text-red-500">−1,500 ש״ח</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400">−160 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">נסיעות</td>
                    <td className="px-4 py-3 text-red-500">−400 ש״ח</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400">0 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">חשבונות (חשמל, מים, אינטרנט)</td>
                    <td className="px-4 py-3 text-red-500">−500 ש״ח</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400">−100 ש״ח</td>
                  </tr>
                  <tr className="bg-brand-50 dark:bg-slate-800 font-bold">
                    <td className="px-4 py-3 text-brand-900 dark:text-white">נשאר בכיס</td>
                    <td className="px-4 py-3 text-red-600">800 ש״ח</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 text-lg">5,940 ש״ח</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              * נקודות זיכוי נוספות לעובדי אזור פיתוח מפחיתות את ניכוי המס.
            </p>
            <div className="mt-4 rounded-xl bg-brand-50 dark:bg-slate-800 p-5 border border-brand-100 dark:border-slate-700">
              <p className="font-bold text-brand-900 dark:text-white text-lg">
                הפער: 5,140 ש״ח בחודש
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                על אותו שכר ברוטו בדיוק, עובד באילת דרך ברק שירותים חוסך 5,140 ש״ח
                יותר בחודש. זה 61,680 ש״ח בשנה. בלי לעבוד שעה נוספת אחת.
              </p>
            </div>
          </section>

          {/* 4. מענק מעודפת */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              מענק מעודפת: 9,550 ש״ח בונוס
            </h2>
            <p>
              אחרי 150 ימי עבודה באילת (כ-5 חודשים), אתם זכאים למענק
              של <strong>9,550 ש״ח</strong> ישירות לחשבון הבנק. המענק ניתן
              מהמדינה כחלק מתוכנית &quot;עבודה מועדפת&quot; לעידוד תעסוקה
              בפריפריה.
            </p>
            <p className="font-semibold text-brand-900 dark:text-white">
              הטבות מס נוספות:
            </p>
            <ul className="list-disc space-y-1 ps-6">
              <li>
                <strong>פטור ממע״מ</strong> — על שירותים ומוצרים מקומיים
                (17% פחות על שכירות, מסעדות, קניות)
              </li>
              <li>
                <strong>נקודות זיכוי נוספות</strong> — שמפחיתות את ניכוי מס
                ההכנסה מהמשכורת
              </li>
              <li>
                <strong>בפועל:</strong> על אותו ברוטו, הנטו שלכם באילת גבוה יותר
              </li>
            </ul>
            <div className="mt-4 rounded-xl bg-green-50 dark:bg-green-950 p-5 border border-green-200 dark:border-green-800">
              <p className="font-bold text-green-800 dark:text-green-300">
                חישוב שנתי מלא (שנה ראשונה באילת):
              </p>
              <ul className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-400">
                <li>חיסכון חודשי: 5,140 × 12 = <strong>61,680 ש״ח</strong></li>
                <li>מענק מעודפת: <strong>9,550 ש״ח</strong></li>
                <li>חיסכון מע״מ (הערכה): <strong>~3,000 ש״ח</strong></li>
                <li className="border-t border-green-200 dark:border-green-700 pt-1 font-bold text-green-900 dark:text-green-200">
                  סה״כ יתרון שנתי: ~74,230 ש״ח
                </li>
              </ul>
            </div>
          </section>

          {/* 5. טיפים וטריקים */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              5 טריקים למקסם את ההכנסה באילת
            </h2>
            <ol className="list-decimal space-y-3 ps-6">
              <li>
                <strong className="text-brand-900 dark:text-white">עבדו בתחום עם טיפים.</strong>{" "}
                מלצרות ובר-בתי מלון יכולים להוסיף 3,000-6,000 ש״ח בחודש
                בטיפים בעונה. פקידי קבלה מקבלים טיפים של תיירים בדולרים.
              </li>
              <li>
                <strong className="text-brand-900 dark:text-white">אל תפחדו משעות נוספות.</strong>{" "}
                בעונת שיא (יולי-אוגוסט, פסח, סוכות) יש ביקוש ענק. שעות
                נוספות משולמות 125%-150% — אפשר להוסיף 2,000-4,000 ש״ח בחודש.
              </li>
              <li>
                <strong className="text-brand-900 dark:text-white">שמרו על 150 ימי עבודה.</strong>{" "}
                אל תעזבו לפני שמגיע המענק. 150 יום = כ-5 חודשים. זה 9,550
                ש״ח שמחכים לכם.
              </li>
              <li>
                <strong className="text-brand-900 dark:text-white">בקשו מקדמות.</strong>{" "}
                דרך ברק שירותים אפשר לקבל תשלום שבועי במזומן ומקדמות. לא
                חייבים לחכות לסוף החודש.
              </li>
              <li>
                <strong className="text-brand-900 dark:text-white">נצלו את הפטור ממע״מ.</strong>{" "}
                קניות באילת פטורות ממע״מ — 17% פחות. קנו ביגוד, אלקטרוניקה
                וציוד באילת במקום להזמין אונליין.
              </li>
            </ol>
          </section>

          {/* 6. שכר לפי ניסיון */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              איך השכר גדל עם הזמן?
            </h2>
            <p>
              אילת מתגמלת נאמנות. ככל שנשארים יותר — השכר עולה, האחריות
              גדלה, והאפשרויות נפתחות:
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-50 dark:bg-slate-800 text-brand-900 dark:text-white">
                    <th className="px-4 py-3 text-right font-semibold">תקופה</th>
                    <th className="px-4 py-3 text-right font-semibold">תפקיד טיפוסי</th>
                    <th className="px-4 py-3 text-right font-semibold">שכר צפוי</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr>
                    <td className="px-4 py-3 font-medium">0-3 חודשים</td>
                    <td className="px-4 py-3">עובד כניסה</td>
                    <td className="px-4 py-3">6,000-7,500 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">3-6 חודשים</td>
                    <td className="px-4 py-3">עובד מנוסה + מענק</td>
                    <td className="px-4 py-3">7,000-9,000 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">6-12 חודשים</td>
                    <td className="px-4 py-3">אחראי משמרת / בכיר</td>
                    <td className="px-4 py-3">8,500-11,000 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">שנה+</td>
                    <td className="px-4 py-3">מנהל צוות / סופרוויזר</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">10,000-14,000 ש״ח</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              מלונות רשתיים (דן, ישרוטל, פתאל) מציעים מסלולי קידום
              מובנים — כולל הכשרות, ניהול ומעבר בין סניפים בארץ ובעולם.
            </p>
          </section>

          {/* 7. מה לא מספרים */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              מה לא מספרים על שכר באילת?
            </h2>
            <p>
              בואו נהיה כנים — יש דברים שחשוב לדעת לפני שמגיעים:
            </p>
            <ul className="list-disc space-y-2 ps-6">
              <li>
                <strong>עונתיות:</strong> בחורף (נובמבר-פברואר) יש פחות
                תיירים. פחות טיפים, פחות שעות נוספות. אבל עבודה יציבה
                כן — מלונות ומסעדות עובדים כל השנה.
              </li>
              <li>
                <strong>עלויות בילויים:</strong> אילת היא עיר נופש. ברים,
                מועדונים וצלילות עולים כסף. אם לא שמים גבול — הבילויים
                יכולים לאכול את החיסכון.
              </li>
              <li>
                <strong>חום:</strong> בקיץ 40+ מעלות. העבודה בתוך מבנים
                ממוזגים, אבל צריך להתרגל.
              </li>
              <li>
                <strong>ריחוק מהמרכז:</strong> טיסה פנימית 45 דקות, נסיעה
                3.5 שעות. חופשות אצל המשפחה דורשות תכנון.
              </li>
            </ul>
            <p className="mt-3 font-semibold text-brand-900 dark:text-white">
              השורה התחתונה: מי שמגיע לעבוד ולחסוך — אילת היא המקום הכי
              רווחי בארץ לצעירים. מי שמגיע רק לבלות — עדיף ללכת לחופשה.
            </p>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-gradient-to-bl from-brand-900 to-brand-700 px-6 py-10 text-center text-white">
            <h2 className="text-2xl font-extrabold">
              רוצים לראות את המספרים האלה בתלוש שלכם?
            </h2>
            <p className="mt-2 text-indigo-100">
              שלחו פרטים ונחזור עם הצעת עבודה אישית — כולל שכר צפוי, סוג
              דירה ותאריך התחלה
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/outreach"
                className="w-full rounded-lg bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-lg transition-transform hover:scale-105 sm:w-auto"
              >
                הגישו מועמדות עכשיו
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-lg border-2 border-white/40 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                WhatsApp 💬
              </a>
            </div>
          </section>
        </article>

        {/* Related */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8">
          <h3 className="text-lg font-bold text-brand-900 dark:text-white">מדריכים נוספים</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Link
              href="/blog/guide-moving-to-eilat"
              className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-bold text-brand-900 dark:text-white">
                השתחררת? המדריך המלא למעבר לאילת ב-2026
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                דירה, עבודה, חברים, ים — תוך שבוע
              </p>
            </Link>
            <Link
              href="/outreach"
              className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-bold text-brand-900 dark:text-white">
                הגשת מועמדות מהירה
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                טופס, צ׳אט או שיחה קולית — בחרו מה נוח
              </p>
            </Link>
          </div>
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-brand-600 bg-brand-600 p-3 text-center md:hidden">
        <Link
          href="/outreach"
          className="block w-full rounded-lg bg-white py-2.5 text-sm font-bold text-brand-700"
        >
          רוצה הצעת עבודה באילת
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-brand-900 px-4 py-8 text-center text-sm text-indigo-300 pb-20 md:pb-8">
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
