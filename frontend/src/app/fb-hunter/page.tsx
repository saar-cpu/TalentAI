"use client";

import { useState } from "react";
import { analyzeFbPost } from "@/lib/api";

interface AnalysisResult {
  postText: string;
  isRelevant: boolean;
  response: string;
}

const EXAMPLE_POSTS = [
  "היי חברים, השתחררתי מצהל לפני שבוע ואני מחפש עבודה באילת. מישהו מכיר מקום שמחפש ברמנים? אשמח גם למגורים אם יש",
  "משתחרר בעוד חודש ומחפש עבודה בתחום האבטחה, רצוי באילת או באזור הדרום. מישהו יודע על משהו?",
  "מחפשת עבודה במלון, יש לי ניסיון של שנתיים בקבלה. מעדיפה אילת כי יש לי חברים שם",
  "מוכר פלייסטיישן 5 במצב מעולה, כולל שני שלטים ו-3 משחקים. מחיר: 1500 שח",
];

export default function FbHunterPage() {
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  async function handleAnalyze() {
    const text = postText.trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await analyzeFbPost(text);
      setResults((prev) => [{ postText: text, ...res }, ...prev]);
      setPostText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "משהו השתבש");
    } finally {
      setLoading(false);
    }
  }

  function loadExample(text: string) {
    setPostText(text);
  }

  return (
    <main dir="rtl" className="flex min-h-screen flex-col bg-gradient-to-br from-brand-50 via-white to-brand-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-4 text-center">
        <a href="/" className="text-sm text-brand-600 hover:underline">
          &rarr; חזרה לדף הראשי
        </a>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-900">
          Facebook Hunter Agent
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          ניתוח פוסטים מפייסבוק ויצירת תגובות אותנטיות לגיוס מועמדים
        </p>
      </div>

      {/* Input area */}
      <div className="border-b border-slate-100 bg-white px-4 py-5">
        <div className="mx-auto max-w-2xl">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">טקסט הפוסט מפייסבוק</span>
            <textarea
              className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm leading-relaxed focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
              rows={4}
              placeholder="הדבק/י כאן את טקסט הפוסט מפייסבוק..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              disabled={loading}
            />
          </label>

          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!postText.trim() || loading}
              className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "מנתח..." : "נתח פוסט"}
            </button>

            <span className="text-xs text-slate-400">או נסה דוגמה:</span>
          </div>

          {/* Example posts */}
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_POSTS.map((ex, i) => (
              <button
                key={i}
                onClick={() => loadExample(ex)}
                disabled={loading}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors disabled:opacity-50 max-w-[200px] truncate"
              >
                {ex.slice(0, 40)}…
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          )}

          {results.length === 0 && !loading && (
            <p className="text-center text-sm text-slate-400 py-12">
              הדבק/י פוסט מפייסבוק כדי לקבל תגובה מותאמת לגיוס
            </p>
          )}

          {results.map((result, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              {/* Original post */}
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    f
                  </div>
                  <span className="text-xs font-medium text-slate-500">פוסט מפייסבוק</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{result.postText}</p>
              </div>

              {/* Analysis result */}
              <div className="px-4 py-3">
                {result.isRelevant ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        רלוונטי
                      </span>
                    </div>
                    <div className="rounded-lg bg-brand-50 border border-brand-100 px-4 py-3">
                      <p className="text-xs font-medium text-brand-600 mb-1">תגובה מוצעת:</p>
                      <p className="text-sm text-slate-800 leading-relaxed">{result.response}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(result.response)}
                      className="mt-2 text-xs text-brand-600 hover:text-brand-700 hover:underline"
                    >
                      העתק תגובה
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                      לא רלוונטי
                    </span>
                    <span className="text-xs text-slate-400">הפוסט לא קשור לגיוס עובדים</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
