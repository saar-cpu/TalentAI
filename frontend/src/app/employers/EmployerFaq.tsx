"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "איך תהליך הגיוס עובד?",
    answer:
      "שולחים לנו דרישות משרה — הצוות שלנו + מערכת AI מסננים מועמדים מתוך מאגר של אלפי צעירים. תוך 48 שעות מקבלים פרופילים מותאמים עם ציון התאמה. אתם רק בוחרים ומראיינים.",
  },
  {
    question: "מה ההבדל בינכם לבין לוח דרושים רגיל?",
    answer:
      "בלוח דרושים אתם מקבלים מאות קורות חיים לא רלוונטיים ומבזבזים שעות על סינון. אצלנו — ה-AI מסנן, מתאים ומדרג. אתם מקבלים רק מועמדים שעברו סינון מקדים ומתאימים לדרישות שלכם.",
  },
  {
    question: "כמה זמן לוקח למלא משרה?",
    answer:
      "בממוצע 3 ימי עבודה מרגע קבלת הדרישות. במשרות דחופות (אבטחה, מלונאות בעונה) — לפעמים באותו יום. אנחנו מחזיקים מאגר מועמדים זמינים שכבר עברו סינון.",
  },
  {
    question: "מה קורה אם עובד עוזב תוך תקופה קצרה?",
    answer:
      "בחבילת מקצועי וארגוני — מחליפים בחינם תוך 30 יום. בנוסף, שיעור השימור שלנו עומד על 85% אחרי 6 חודשים, הרבה מעל הממוצע בענף, כי אנחנו מתאימים נכון מההתחלה.",
  },
  {
    question: "האם אתם מטפלים גם בדיור והסעות?",
    answer:
      "כן. אנחנו מספקים לעובדים דיור מסובסד (מ-400 ש״ח/חודש), ארוחות והסעות — מה שמוריד דרמטית את שיעור הנטישה ומבטיח שהעובדים מגיעים למשמרות בזמן.",
  },
  {
    question: "לאילו תחומים אתם מגייסים?",
    answer:
      "מלונאות, קמעונאות, אבטחה, מסעדנות, תחנות דלק ועוד. אם יש לכם תחום ייחודי — דברו איתנו. עם 20+ שנה באילת, יש לנו מאגר לכמעט כל סוג משרה.",
  },
  {
    question: "איך מתחילים?",
    answer:
      "פשוט שולחים הודעת WhatsApp או מתקשרים. נקבע שיחה קצרה, נבין את הדרישות שלכם, ותוך 48 שעות מתחילים לשלוח מועמדים מותאמים. בלי חוזים ארוכי טווח — משלמים רק על תוצאות.",
  },
];

export default function EmployerFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="border-b border-slate-200">
          <button
            className="flex w-full items-center justify-between py-4 text-right"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="text-base font-semibold text-brand-900">
              {item.question}
            </span>
            <span className="ms-4 shrink-0 text-xl text-slate-400">
              {openIndex === i ? "−" : "+"}
            </span>
          </button>
          {openIndex === i && (
            <p className="pb-4 text-sm leading-relaxed text-slate-600">
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
