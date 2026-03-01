import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "המדריך המלא למעבר לאילת אחרי צבא 2026 | ברק שירותים",
  description:
    "עבודה באילת אחרי צבא — דירה מרוהטת מ-400 ₪, 3 ארוחות ב-5 ₪ ליום, מענק 9,550 ₪, הסעות חינם. המדריך המלא עם מספרים אמיתיים, צ׳קליסט ומשרות פתוחות.",
  openGraph: {
    title: "השתחררת? המדריך המלא למעבר לאילת 2026",
    description:
      "דירה, עבודה, ארוחות, הסעות — תוך 3 ימים. כל מה שאף אחד לא מספר על המעבר לאילת אחרי צבא.",
    type: "article",
    locale: "he_IL",
  },
};

const WHATSAPP_URL = "https://wa.me/9720738020145";
const PHONE_NUMBER = "073-802-0145";
const PHONE_URL = "tel:+9720738020145";

export default function GuideMovingToEilatPage() {
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
          <span className="text-slate-600 dark:text-slate-400">מעבר לאילת אחרי צבא</span>
        </nav>

        {/* Hero */}
        <header className="mb-10">
          <span className="inline-block rounded-full bg-brand-50 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
            מדריך מלא
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-brand-900 dark:text-white md:text-4xl">
            השתחררת? המדריך המלא למעבר לאילת ב-2026
          </h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
            דירה, עבודה, חברים, ים — תוך שבוע. כל מה שאף אחד לא מספר על
            המעבר לאילת אחרי צבא, כולל מספרים אמיתיים.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            <span>15 בפברואר 2026</span>
            <span>·</span>
            <span>קריאה של 8 דקות</span>
          </div>
        </header>

        {/* ── Article body ── */}
        <article className="prose-article space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* 1. למה דווקא אילת */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              למה דווקא אילת?
            </h2>
            <p>
              יש משהו שמשתחררים לא שומעים מספיק: אילת היא לא רק עיר נופש —
              היא מכונת תעסוקה. עם יותר מ-14,000 חדרי מלון, עשרות קניונים
              וחנויות פטורות ממע״מ, ומאות מסעדות ובתי קפה, העיר מייצרת ביקוש
              קבוע למאות עובדים חדשים — כל חודש.
            </p>
            <p>
              בכל רגע נתון יש באילת 300+ משרות פתוחות בתחומים שלא דורשים
              ניסיון: מלונאות, קמעונאות, אבטחה, מסעדנות, תחנות דלק ועוד. אבל
              ההזדמנות האמיתית היא לא רק העבודה — אלא החבילה שמגיעה איתה:
              דירה מסובסדת, ארוחות, הסעות ומענקים שלא קיימים בשום מקום אחר
              בארץ.
            </p>
            <p>
              בשונה מתל אביב או באר שבע, אילת מציעה למשתחררים דבר נדיר: את
              האפשרות לחסוך כסף אמיתי כבר מהחודש הראשון, בלי הורים שמממנים,
              בלי הלוואות ובלי לחיות על הקצה. ובינתיים — ים, שמש, בילויים
              וקהילה צעירה של אנשים בדיוק כמוכם.
            </p>
          </section>

          {/* 2. עבודה מועדפת */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              עבודה מועדפת — מה זה בכלל?
            </h2>
            <p>
              &quot;עבודה מועדפת&quot; (או &quot;מעודפת&quot;) היא סטטוס
              ממשלתי שמעניקים לעובדים באזורי פיתוח כמו אילת. המטרה: לעודד
              צעירים לעבור לפריפריה ולסגור פערי כוח אדם. בפועל, זה אומר כסף
              בכיס — הרבה יותר ממה שהייתם מקבלים על אותה עבודה במרכז.
            </p>
            <p className="font-semibold text-brand-900 dark:text-white">
              מי זכאי? כמעט כולם:
            </p>
            <ul className="list-disc space-y-1 ps-6">
              <li>
                גילאי 18-35 (אם יש לכם תעודת שחרור — אתם כמעט בטוח זכאים)
              </li>
              <li>מגורים ועבודה בפועל באילת</li>
              <li>150 ימי עבודה לפחות (כ-5 חודשים של משמרות רגילות)</li>
              <li>עבודה דרך חברת כוח אדם מורשית (כמו ברק שירותים)</li>
            </ul>
            <p className="font-semibold text-brand-900 dark:text-white mt-4">
              ההטבות בפועל:
            </p>
            <ul className="list-disc space-y-1 ps-6">
              <li>
                <strong>מענק של 9,550 ש״ח</strong> — ישירות לחשבון הבנק אחרי
                150 יום
              </li>
              <li>
                <strong>פטור ממע״מ</strong> — על שירותים ומוצרים מקומיים
                (שכירות, מסעדות, חנויות)
              </li>
              <li>
                <strong>הפחתת מס הכנסה</strong> — נקודות זיכוי נוספות שמקטינות
                את הניכוי מהמשכורת
              </li>
              <li>
                <strong>בפועל: יותר נטו</strong> מאותו ברוטו בתל אביב או
                ירושלים
              </li>
            </ul>
          </section>

          {/* 3. מגורים מסובסדים */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              מגורים מסובסדים — מה כלול ובכמה?
            </h2>
            <p>
              נשכח רגע מהשכירות בגוש דן. באילת, דרך ברק שירותים, אתם מקבלים
              דירה מרוהטת ומוכנה למגורים — בלי ערבים, בלי חוזה שנתי, ובלי
              להסתבך. מגיעים עם תיק, נכנסים, מתחילים לעבוד.
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-brand-50 dark:bg-slate-800 text-brand-900 dark:text-white">
                  <tr>
                    <th className="px-4 py-3 text-right font-semibold">
                      סוג דירה
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      עלות חודשית
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      מה כלול
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr>
                    <td className="px-4 py-3">דירה משותפת (3-4 שותפים)</td>
                    <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400">
                      300–400 ש״ח
                    </td>
                    <td className="px-4 py-3">
                      מיזוג, מקרר, כיריים, מכונת כביסה, אינטרנט
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">דירה משותפת (2 שותפים)</td>
                    <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400">
                      400–600 ש״ח
                    </td>
                    <td className="px-4 py-3">
                      כנ״ל + חדר גדול יותר, שקט יחסי
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">סטודיו / יחיד (זמינות מוגבלת)</td>
                    <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400">
                      600–800 ש״ח
                    </td>
                    <td className="px-4 py-3">
                      דירה עצמאית, פרטיות מלאה
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              לשם השוואה: שכירות ממוצעת לחדר בתל אביב — 2,500-3,500 ש״ח.
              באילת דרכנו — 300-600 ש״ח, כולל הכל. ההפרש? נשאר בכיס.
            </p>
            <p>
              כל הדירות ממוקמות במרכז אילת, בהליכה מהים, קרוב לקניונים,
              מסעדות וקווי ההסעה. לא צריך רכב, לא צריך אוטובוס — הכל קרוב.
            </p>
          </section>

          {/* 4. תחומי עבודה */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              תחומי עבודה — מה מחכה לך?
            </h2>
            <p>
              אילת היא עיר תיירות ושירותים, וזה אומר מגוון רחב של משרות —
              רובן לא דורשות ניסיון קודם. הנה הפירוט:
            </p>

            <div className="space-y-6 mt-4">
              <div>
                <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                  🏨 מלונאות — השדרה הראשית
                </h3>
                <p>
                  פקידי קבלה, חדרנות, שירות חדרים, קונסיירז׳, בריכות וספא.
                  המלונות הגדולים (רויאל ביץ׳, דן, ישרוטל, פתאל) מגייסים כל
                  הזמן. השכר נע בין 6,500 ל-9,000 ש״ח + טיפים שיכולים להוסיף
                  1,000-2,000 ש״ח בחודש. ארוחות חינם במלון, ולפעמים גם גישה
                  לחדר כושר ובריכה.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                  🛡️ אבטחה — שכר גבוה, משמרות גמישות
                </h3>
                <p>
                  מאבטחים בקניונים, מלונות, אירועים ותחנות דלק. שכר התחלתי
                  7,000-8,000 ש״ח, עם שעות נוספות אפשר להגיע ל-10,000+.
                  משמרות 8-12 שעות, אפשרות לבחור ימים. מתאים למי שרוצה
                  להרוויח מקסימום ולהשאיר זמן חופשי לים ולבילויים.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                  🍽️ מסעדנות — טיפים + אווירה
                </h3>
                <p>
                  מלצרות, ברמנים, טבחים, שטיפה. מסעדות הים של אילת ובתי הקפה
                  לאורך הטיילת מגייסים כל עונה. שכר בסיס 5,500-7,000 ש״ח +
                  טיפים של 100-300 ש״ח ביום (בעיקר מתיירים). מלצרים טובים
                  מגיעים ל-12,000+ בחודשי שיא.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                  🛍️ קמעונאות ואופנה — בונוסים ובילויים
                </h3>
                <p>
                  קסטרו, גולף, רנואר, H&M, אמריקן איגל ועוד — כולם באילת
                  ומגייסים מוכרנים, קופאים ומנהלי סניפים. שכר 5,500-7,500 ש״ח
                  + עמלות מכירה + הנחות עובדים (20-40%). מתאים למי שאוהב אנשים
                  ואופנה.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                  ⛽ תחנות דלק — יציבות ובונוסים
                </h3>
                <p>
                  תדלוקנים, קופאים, ניהול משמרת. עבודה יציבה עם שכר 6,000-7,500
                  ש״ח ובונוסים חודשיים. משמרות קבועות, פחות עומס מאשר מלונאות
                  או מסעדנות. אופציה טובה למי שמעדיף שקט יחסי.
                </p>
              </div>
            </div>
          </section>

          {/* 5. כמה נשאר בכיס */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              כמה נשאר בכיס? חישוב אמיתי
            </h2>
            <p>
              הסיפור האמיתי של אילת הוא לא כמה מרוויחים — אלא כמה נשאר.
              בואו נשווה עובד טיפוסי באילת מול תל אביב:
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-brand-50 dark:bg-slate-800 text-brand-900 dark:text-white">
                  <tr>
                    <th className="px-4 py-3 text-right font-semibold">
                      סעיף
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      אילת (דרך ברק)
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      תל אביב
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr>
                    <td className="px-4 py-3">שכר ברוטו</td>
                    <td className="px-4 py-3">7,500 ש״ח</td>
                    <td className="px-4 py-3">7,500 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">ניכויי מס ופנסיה</td>
                    <td className="px-4 py-3">−900 ש״ח *</td>
                    <td className="px-4 py-3">−1,200 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">שכירות</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">
                      −400 ש״ח
                    </td>
                    <td className="px-4 py-3 text-red-500">−3,000 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">אוכל</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">
                      −160 ש״ח
                    </td>
                    <td className="px-4 py-3 text-red-500">−1,500 ש״ח</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">נסיעות</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">
                      0 ש״ח
                    </td>
                    <td className="px-4 py-3 text-red-500">−400 ש״ח</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800 font-bold">
                    <td className="px-4 py-3">נשאר בכיס</td>
                    <td className="px-4 py-3 text-green-600 text-lg">
                      6,040 ש״ח
                    </td>
                    <td className="px-4 py-3 text-red-500 text-lg">
                      1,400 ש״ח
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              * ניכוי מופחת בזכות נקודות זיכוי נוספות לעובדי אזור מועדף.
              הנתונים להמחשה — השכר בפועל תלוי בתפקיד ובשעות.
            </p>
            <p className="mt-3 font-semibold text-brand-900 dark:text-white">
              ההפרש: 4,640 ש״ח בחודש. כמעט 56,000 ש״ח בשנה — על אותו שכר
              בדיוק.
            </p>
            <p>
              ואם מוסיפים את מענק המעודפת (9,550 ש״ח אחרי 5 חודשים) — מגיעים
              לחיסכון של 65,000+ ש״ח בשנה הראשונה. זה כסף רציני, במיוחד
              למשתחררים שרוצים לצבור הון התחלתי.
            </p>
          </section>

          {/* 6. צ׳קליסט */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              צ׳קליסט: 10 דברים לסדר לפני שמגיעים
            </h2>
            <p>
              כדי שהמעבר יהיה חלק — הנה רשימה של מה לסדר לפני ואחרי ההגעה:
            </p>
            <ol className="list-decimal space-y-3 ps-6 mt-4">
              <li>
                <strong>שלחו פרטים דרך הטופס המהיר</strong> — שם, טלפון,
                תחום. מקבלים שיחה תוך שעות.
              </li>
              <li>
                <strong>הכינו צילום תעודת זהות + תעודת שחרור</strong> — צריך
                לרישום לעבודה ולמעונות. אפשר בסריקה בנייד.
              </li>
              <li>
                <strong>פתחו חשבון בנק</strong> (אם אין) — צריך לקבלת משכורת.
                כל הבנקים באילת, אפשר גם דיגיטלי.
              </li>
              <li>
                <strong>ארזו קל</strong> — הדירה מרוהטת. תביאו בגדים,
                מטענים, מגבת ים. הכל השאר קיים.
              </li>
              <li>
                <strong>הגיעו לאילת</strong> — אוטובוס 394 מתל אביב (6
                שעות, ~70 ש״ח), או טיסה פנימית (~200 ש״ח עם הזמנה מוקדמת).
              </li>
              <li>
                <strong>קבלו מפתח לדירה</strong> — המנהל האישי שלכם ייפגש
                אתכם, יראה את הדירה ויסדר הכל.
              </li>
              <li>
                <strong>התחילו עבודה</strong> — בדרך כלל כבר ביום למחרת.
                הכשרה במקום העבודה, בלי לחץ.
              </li>
              <li>
                <strong>הירשמו לביטוח לאומי</strong> כעובד — המעסיק מסדר את
                רוב הניירת, אתם רק חותמים.
              </li>
              <li>
                <strong>הגישו בקשה למעודפת</strong> — אנחנו מנחים אתכם
                בתהליך. אחרי 150 יום — 9,550 ש״ח.
              </li>
              <li>
                <strong>תיהנו</strong> — אתם בעיר עם 360 ימי שמש, ים
                בטורקיז, ובילויים כל לילה. עשיתם את הצעד הנכון.
              </li>
            </ol>
          </section>

          {/* 7. החיים באילת */}
          <section>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">
              החיים באילת — לא רק עבודה
            </h2>
            <p>
              כן, מגיעים בשביל העבודה. אבל נשארים בגלל החיים. הנה מה שמחכה
              מעבר למשמרות:
            </p>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-bold text-brand-900 dark:text-white">🏖️ ים כל השנה</h3>
                <p>
                  מים של 22-28 מעלות כל 12 החודשים. שונית אלמוגים, צלילה
                  חופשית, סאפ, קייאק. הים הוא ה&quot;פארק&quot; שלכם — 5
                  דקות מהדירה, בחינם, כל יום.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-brand-900 dark:text-white">🎉 בילויים וחיי לילה</h3>
                <p>
                  ברים על הטיילת, מסיבות חוף, אירועים כל שבוע. הקהילה באילת
                  צעירה (גיל ממוצע 20-30 של העובדים), כולם חדשים, כולם רוצים
                  לצאת. קל מאוד להיכנס לחברה.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-brand-900 dark:text-white">🚴 ספורט ואקסטרים</h3>
                <p>
                  צניחה חופשית, ג׳יפים במדבר, סנפלינג בנחל שחורת, רכיבת
                  אופניים בהר גבנונית, ויוגה על החוף. אילת היא גן שעשועים
                  לאוהבי אדרנלין וטבע.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-brand-900 dark:text-white">🤝 קהילה</h3>
                <p>
                  יש פה אלפי משתחררים בדיוק כמוכם. אנשים מכל הארץ, מכל
                  הרקעים, עם דבר אחד משותף: הגיעו בשביל ההזדמנות, ונשארו
                  בגלל החיים. הרבה חברויות (וזוגות) נולדים דווקא כאן.
                </p>
              </div>
            </div>
          </section>

          {/* 8. CTA */}
          <section className="rounded-2xl bg-gradient-to-bl from-brand-900 to-brand-700 p-8 text-center text-white">
            <h2 className="text-2xl font-extrabold md:text-3xl">
              מוכנים? ככה מתחילים
            </h2>
            <p className="mt-3 text-indigo-100">
              3 דרכים להגיש מועמדות — בחרו מה שהכי נוח לכם:
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/outreach"
                className="w-full rounded-lg bg-white px-6 py-3 text-base font-bold text-brand-700 shadow-lg transition-transform hover:scale-105 sm:w-auto"
              >
                טופס מהיר — 30 שניות
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-lg border-2 border-white/40 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                WhatsApp 💬
              </a>
              <a
                href={PHONE_URL}
                className="w-full rounded-lg border-2 border-white/40 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                📞 {PHONE_NUMBER}
              </a>
            </div>
            <p className="mt-4 text-sm text-indigo-200">
              שולחים פרטים — מקבלים שיחה תוך שעות עם הצעת עבודה אישית.
            </p>
          </section>
        </article>
      </main>

      {/* Sticky bottom CTA bar */}
      <div className="sticky bottom-0 z-40 border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-4 py-3 backdrop-blur md:hidden">
        <Link
          href="/outreach"
          className="block w-full rounded-lg bg-brand-600 py-3 text-center text-base font-bold text-white hover:bg-brand-700"
        >
          הגישו מועמדות — 30 שניות
        </Link>
      </div>

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
