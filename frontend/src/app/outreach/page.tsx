"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage, MatchedJob, QuickApplyResponse } from "@/types";
import { sendScreeningMessage, submitQuickApply, submitVoiceApply } from "@/lib/api";
import Vapi from "@vapi-ai/web";

type Mode = "quick" | "chat" | "voice";

const FIELD_OPTIONS = [
  { value: "מלונאות", label: "מלונאות (מלונות, קבלה, חדרנות)" },
  { value: "מכירות", label: "מכירות וקמעונאות (חנויות, קניונים)" },
  { value: "אבטחה", label: "אבטחה ושמירה" },
  { value: "מסעדנות", label: "מסעדנות (מלצרות, בישול, בר)" },
  { value: "תחנות דלק", label: "תחנות דלק" },
  { value: "אחר", label: "אחר / לא יודע/ת עדיין" },
];

const START_OPTIONS = [
  { value: "this_week", label: "השבוע" },
  { value: "two_weeks", label: "תוך שבועיים" },
  { value: "this_month", label: "החודש" },
  { value: "not_sure", label: "עוד לא בטוח/ה" },
];

export default function OutreachPage() {
  const [mode, setMode] = useState<Mode>("quick");

  return (
    <main dir="rtl" className="flex min-h-screen flex-col bg-gradient-to-br from-brand-50 via-white to-brand-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-4 text-center">
        <a href="/" className="text-sm text-brand-600 hover:underline">
          &rarr; חזרה לדף הראשי
        </a>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-900">
          {mode === "quick" ? "הגשה מהירה" : mode === "chat" ? "צ׳אט סינון מועמדים" : "שיחה קולית"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {mode === "quick"
            ? "מלא/י פרטים ונמצא לך עבודה באילת תוך שניות"
            : mode === "chat"
              ? "סינון מועמדים בסגנון WhatsApp מבוסס AI"
              : "ספר/י למגייס/ת שלנו מה את/ה מחפש/ת — בשיחה קצרה"}
        </p>

        {/* Mode toggle */}
        <div className="mt-3 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            onClick={() => setMode("quick")}
            className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === "quick"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            הגשה מהירה
          </button>
          <button
            onClick={() => setMode("chat")}
            className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === "chat"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            צ׳אט עם מגייס/ת
          </button>
          <button
            onClick={() => setMode("voice")}
            className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === "voice"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            שיחה קולית
          </button>
        </div>
      </div>

      {mode === "quick" ? <QuickApplyForm /> : mode === "chat" ? <ChatMode /> : <VoiceApplyMode />}
    </main>
  );
}

/* ===================== QUICK APPLY FORM ===================== */

function QuickApplyForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relocate, setRelocate] = useState<boolean | null>(null);
  const [housing, setHousing] = useState("");
  const [field, setField] = useState("");
  const [cvText, setCvText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuickApplyResponse | null>(null);

  const filledSteps =
    (name && phone ? 1 : 0) +
    (relocate !== null ? 1 : 0) +
    (field ? 1 : 0) +
    (startDate ? 1 : 0);
  const totalSteps = 4;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (relocate === null || !housing || !field || !startDate) return;

    setLoading(true);
    setError(null);

    try {
      const response = await submitQuickApply({
        name,
        phone,
        relocate,
        housing: housing as "need" | "have" | "flexible",
        field,
        startDate: startDate as "this_week" | "two_weeks" | "this_month" | "not_sure",
        cvText,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "משהו השתבש");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md text-center">
          {result.fit === "good_fit" ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">הפרטים התקבלו!</h2>
              <p className="mt-2 text-sm text-slate-600">{result.message}</p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">תודה על ההתעניינות</h2>
              <p className="mt-2 text-sm text-slate-600">{result.message}</p>
            </>
          )}

          {/* Matched job cards */}
          {result.fit === "good_fit" && result.matchedJobs && result.matchedJobs.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-medium text-slate-500">משרות מתאימות שנמצאו</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {result.matchedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-green-200 bg-white p-3 text-right shadow-sm"
                  >
                    <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{job.employer}</p>
                    <p className="mt-1 text-xs font-medium text-brand-600">{job.salary_range}</p>
                    {job.match_score != null && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-200">
                          <div
                            className={`h-1.5 rounded-full ${
                              job.match_score >= 80 ? "bg-green-500" :
                              job.match_score >= 60 ? "bg-yellow-500" : "bg-orange-400"
                            }`}
                            style={{ width: `${job.match_score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{job.match_score}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>{filledSteps} מתוך {totalSteps} שלבים</span>
            <span>{Math.round((filledSteps / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-brand-500 transition-all duration-300"
              style={{ width: `${(filledSteps / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="text-sm font-medium text-slate-700">שם מלא *</span>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="ישראל ישראלי"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              <span className="text-sm font-medium text-slate-700">טלפון *</span>
              <input
                type="tel"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="050-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>

          {/* Relocate */}
          <fieldset>
            <legend className="text-sm font-medium text-slate-700">מוכן/ה לעבור לאילת? *</legend>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setRelocate(true)}
                className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  relocate === true
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                כן, בהחלט
              </button>
              <button
                type="button"
                onClick={() => setRelocate(false)}
                className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  relocate === false
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                לא כרגע
              </button>
            </div>
          </fieldset>

          {/* Housing — only show if relocate=true */}
          {relocate === true && (
            <fieldset>
              <legend className="text-sm font-medium text-slate-700">צריך/ה מגורים מסובסדים? *</legend>
              <div className="mt-2 flex gap-2">
                {[
                  { value: "need", label: "כן, צריך/ה" },
                  { value: "have", label: "יש לי מקום" },
                  { value: "flexible", label: "גמיש/ה" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setHousing(opt.value)}
                    className={`flex-1 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                      housing === opt.value
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* Field of interest */}
          <label>
            <span className="text-sm font-medium text-slate-700">תחום עבודה מועדף *</span>
            <select
              required
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
            >
              <option value="">בחר/י תחום...</option>
              {FIELD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          {/* CV / Skills (optional) */}
          <label>
            <span className="text-sm font-medium text-slate-700">כישורים וניסיון <span className="text-slate-400 font-normal">(לא חובה)</span></span>
            <textarea
              rows={3}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="ספר/י בקצרה על ניסיון עבודה, כישורים, שפות..."
            />
          </label>

          {/* Start date */}
          <fieldset>
            <legend className="text-sm font-medium text-slate-700">מתי יכול/ה להגיע? *</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {START_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStartDate(opt.value)}
                  className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                    startDate === opt.value
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!name || !phone || relocate === null || (!housing && relocate) || !field || !startDate || loading}
            className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-base font-bold text-white shadow-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> שולח/ת...
              </span>
            ) : (
              "מצא/י לי עבודה באילת"
            )}
          </button>

          {/* Benefits reminder */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>מגורים מסובסדים</span>
            <span>ארוחות</span>
            <span>הסעות בחינם</span>
            <span>עבודה מועדפת</span>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===================== CHAT MODE ===================== */

function ChatMode() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screeningComplete, setScreeningComplete] = useState(false);
  const [candidateFit, setCandidateFit] = useState<string | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[] | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading || screeningComplete) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await sendScreeningMessage({
        chatHistory: messages,
        latestMessage: text,
        jobTitle: "עבודה באילת",
        location: "אילת",
      });

      setMessages([...updatedMessages, { role: "assistant", content: response.reply }]);

      if (response.screeningComplete) {
        setScreeningComplete(true);
        setCandidateFit(response.candidateFit);
        if (response.matchedJobs) {
          setMatchedJobs(response.matchedJobs);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "משהו השתבש");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-12">
              שלח/י הודעה כדי להתחיל את השיחה
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-green-500 text-white rounded-bl-md"
                    : "bg-slate-100 text-slate-800 rounded-br-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="w-[60%] space-y-2 rounded-2xl rounded-br-md bg-slate-100 px-4 py-3">
                <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Result banner */}
      {screeningComplete && (
        <div
          className={`border-t px-4 py-3 text-center text-sm font-semibold ${
            candidateFit === "good_fit"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {candidateFit === "good_fit"
            ? "הסינון הושלם — מתאים!"
            : "הסינון הושלם — לא מתאים."}
        </div>
      )}

      {/* Matched job cards */}
      {screeningComplete && candidateFit === "good_fit" && matchedJobs && matchedJobs.length > 0 && (
        <div className="border-t border-green-100 bg-green-50/50 px-4 py-4">
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 text-center text-xs font-medium text-slate-500">משרות מתאימות שנמצאו</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {matchedJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-green-200 bg-white p-3 text-right shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{job.employer}</p>
                  <p className="mt-1 text-xs font-medium text-brand-600">{job.salary_range}</p>
                  {job.match_score != null && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 rounded-full bg-slate-200">
                        <div
                          className={`h-1.5 rounded-full ${
                            job.match_score >= 80 ? "bg-green-500" :
                            job.match_score >= 60 ? "bg-yellow-500" : "bg-orange-400"
                          }`}
                          style={{ width: `${job.match_score}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{job.match_score}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <form
          className="mx-auto flex max-w-2xl gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
            placeholder={screeningComplete ? "הסינון הושלם" : "כתוב/י הודעה…"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={screeningComplete || loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading || screeningComplete}
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            שלח
          </button>
        </form>
      </div>
    </>
  );
}

/* ===================== VOICE APPLY MODE ===================== */

const VAPI_PUBLIC_KEY = "ae93dc6a-a162-4357-b9c2-dfb0561fe3d1";

const VOICE_APPLY_PROMPT = `CRITICAL DIRECTIVE: You MUST think, speak, and generate text EXCLUSIVELY in the Hebrew alphabet (עברית). DO NOT use English letters to write Hebrew words (no transliteration). DO NOT translate to English. Respond with short, natural Israeli Hebrew phrases. כל מילה חייבת להיכתב באותיות עבריות בלבד. אסור להשתמש באותיות לטיניות.

אתה/את מגייס/ת בחברת "ברק שירותים" — סוכנות השמה מובילה באילת. המטרה שלך: לאסוף פרטים מהמועמד/ת בשיחה קצרה וטבעית כדי למצוא לו/ה עבודה מתאימה באילת.

כללים קריטיים:
1. דבר/י רק בעברית. כל מילה באותיות עבריות. אף פעם לא באנגלית או בתעתיק.
2. תשובות קצרות בלבד — משפט אחד או שניים מקסימום.
3. שאל/י שאלה אחת בכל פעם וחכה/י לתשובה.
4. היה/י חם/ה, ידידותי/ת ואנרגטי/ת. סלנג קליל זה בסדר ("אחלה", "יאללה", "מעולה").

מהלך השיחה (שאל שאלה אחת בכל שלב):

שלב 1: "אהלן! אני מהצוות של ברק שירותים. בוא/י נמצא לך עבודה באילת — מה השם שלך?"

שלב 2: "נעים מאוד [שם]! באיזה תחום היית רוצה לעבוד? יש לנו מלונאות, מכירות, אבטחה, מסעדנות, תחנות דלק..."

שלב 3: "אחלה. ואת/ה מוכן/ה לעבור לגור באילת?"

שלב 4: "מתי את/ה יכול/ה להתחיל? השבוע, תוך שבועיים, או בהמשך החודש?"

שלב 5: "מעולה! מה מספר הטלפון שלך כדי שנחזור אליך עם הצעות?"

שלב 6 (סיום): "יאללה [שם], קיבלנו הכל! המגייס/ת שלנו יחזור/תחזור אליך בקרוב עם משרות מתאימות. להתראות באילת!"

טיפול בתשובות:
- אם לא מוכן/ה לעבור: "מבין/ה לגמרי! כרגע אנחנו מגייסים לאילת, אבל אם זה ישתנה — אנחנו פה. בהצלחה!"
- אם לא בטוח/ה: "בלי לחץ! תחשוב/י על זה ותתקשר/י כשתהיו מוכנים."
- אם שואלים שאלות: ענה בקצרה — דירה מ-400 שח, ארוחות ב-5 שח ליום, הסעות חינם, מענק 9,550 שח.`;

const VOICE_APPLY_CONFIG = {
  model: {
    provider: "anthropic" as const,
    model: "claude-sonnet-4-20250514" as const,
    messages: [{ role: "system" as const, content: VOICE_APPLY_PROMPT }],
  },
  voice: { provider: "openai" as const, voiceId: "onyx" },
  firstMessage: "אהלן! אני מהצוות של ברק שירותים. בוא נמצא לך עבודה באילת — מה השם שלך?",
  transcriber: { provider: "openai" as const, model: "gpt-4o-mini-transcribe" as const, language: "he" as const },
};

interface TranscriptMessage {
  role: "assistant" | "user";
  text: string;
}

function VoiceApplyMode() {
  const [callActive, setCallActive] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: string }>({
    text: "לחץ/י להתחיל שיחה עם המגייס/ת",
    type: "idle",
  });
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuickApplyResponse | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const messagesRef = useRef<TranscriptMessage[]>([]);

  const processTranscript = useCallback(async (transcriptMessages: TranscriptMessage[]) => {
    if (transcriptMessages.length === 0) return;

    setLoading(true);
    setError(null);

    // Build full transcript from all messages
    const transcript = transcriptMessages
      .map((m) => `${m.role === "user" ? "מועמד" : "מגייס"}: ${m.text}`)
      .join("\n");

    try {
      const response = await submitVoiceApply(transcript);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בעיבוד השיחה");
    } finally {
      setLoading(false);
    }
  }, []);

  const startCall = useCallback(async () => {
    setStatus({ text: "מתחבר...", type: "connecting" });
    setMessages([]);
    messagesRef.current = [];
    setResult(null);
    setError(null);

    try {
      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setCallActive(true);
        setStatus({ text: "שיחה פעילה — דבר/י!", type: "active" });
      });

      vapi.on("call-end", () => {
        setCallActive(false);
        setStatus({ text: "השיחה הסתיימה — מעבד/ת...", type: "processing" });
        vapiRef.current = null;
        processTranscript(messagesRef.current);
      });

      vapi.on("message", (msg: Record<string, unknown>) => {
        if (msg.type === "transcript" && msg.transcriptType === "final") {
          const newMsg: TranscriptMessage = {
            role: msg.role as "assistant" | "user",
            text: msg.transcript as string,
          };
          messagesRef.current = [...messagesRef.current, newMsg];
          setMessages((prev) => [...prev, newMsg]);
        }
      });

      vapi.on("error", (err: Record<string, unknown>) => {
        console.error("Vapi error:", err);
        setStatus({
          text: "שגיאה: " + ((err.message as string) || JSON.stringify(err)),
          type: "error",
        });
        setCallActive(false);
        vapiRef.current = null;
      });

      await vapi.start(VOICE_APPLY_CONFIG);
    } catch (err) {
      setStatus({
        text: "שגיאה בהתחלת שיחה: " + (err instanceof Error ? err.message : String(err)),
        type: "error",
      });
    }
  }, [processTranscript]);

  const stopCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  }, []);

  // Show result
  if (result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md text-center">
          {result.fit === "good_fit" ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">הפרטים התקבלו!</h2>
              <p className="mt-2 text-sm text-slate-600">{result.message}</p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">תודה על השיחה</h2>
              <p className="mt-2 text-sm text-slate-600">{result.message}</p>
            </>
          )}

          {/* Matched job cards */}
          {result.fit === "good_fit" && result.matchedJobs && result.matchedJobs.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-medium text-slate-500">משרות מתאימות שנמצאו</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {result.matchedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-green-200 bg-white p-3 text-right shadow-sm"
                  >
                    <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{job.employer}</p>
                    <p className="mt-1 text-xs font-medium text-brand-600">{job.salary_range}</p>
                    {job.match_score != null && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-200">
                          <div
                            className={`h-1.5 rounded-full ${
                              job.match_score >= 80 ? "bg-green-500" :
                              job.match_score >= 60 ? "bg-yellow-500" : "bg-orange-400"
                            }`}
                            style={{ width: `${job.match_score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{job.match_score}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8">
      <div className="mx-auto w-full max-w-md text-center">
        {/* Call button */}
        <div className="mt-8">
          <button
            onClick={callActive ? stopCall : startCall}
            disabled={status.type === "connecting" || loading}
            className={`inline-flex h-32 w-32 items-center justify-center rounded-full text-5xl transition-all ${
              callActive
                ? "animate-pulse bg-red-500 hover:bg-red-600"
                : status.type === "connecting" || loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 hover:scale-105"
            }`}
          >
            {callActive ? "🔴" : "📞"}
          </button>
        </div>

        <p className={`mt-4 text-sm font-semibold ${
          status.type === "active" ? "text-green-500" :
          status.type === "error" ? "text-red-500" :
          status.type === "connecting" || status.type === "processing" ? "text-yellow-500" :
          "text-slate-500"
        }`}>
          {status.text}
        </p>

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-6 space-y-2">
            <div className="h-4 w-3/4 mx-auto animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 mx-auto animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2/3 mx-auto animate-pulse rounded bg-slate-200" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Live transcript */}
        {messages.length > 0 && (
          <div className="mt-6 rounded-xl bg-slate-100 p-4 text-right" style={{ maxHeight: 300, overflowY: "auto" }}>
            <h3 className="mb-3 text-xs text-slate-400">תמלול שיחה</h3>
            {messages.map((msg, i) => (
              <div key={i} className="mb-2 text-sm leading-relaxed">
                <span
                  className={`font-bold ${msg.role === "assistant" ? "text-brand-500" : "text-green-500"}`}
                >
                  {msg.role === "assistant" ? "מגייס/ת" : "את/ה"}:
                </span>{" "}
                {msg.text}
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        {!callActive && !loading && !result && messages.length === 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>שיחה של דקה</span>
            <span>בעברית</span>
            <span>נמצא לך עבודה</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== SPINNER ===================== */

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
