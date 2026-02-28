"use client";

import { useState, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";

const PUBLIC_KEY = "ae93dc6a-a162-4357-b9c2-dfb0561fe3d1";

const SYSTEM_PROMPT = `CRITICAL DIRECTIVE: You MUST think, speak, and generate text EXCLUSIVELY in the Hebrew alphabet (עברית). DO NOT use English letters to write Hebrew words (no transliteration). DO NOT translate to English. Respond with short, natural Israeli Hebrew phrases. כל מילה חייבת להיכתב באותיות עבריות בלבד. אסור להשתמש באותיות לטיניות.

אתה תומר, מגייס צעיר ואנרגטי בחברת "ברק שירותים". התפקיד שלך להתקשר ללידים ישנים שהתעניינו בעבר בעבודה באילת, ולבדוק אם הם עדיין רלוונטיים.

כללים קריטיים:
1. דבר רק בעברית. כל מילה באותיות עבריות. אף פעם לא באנגלית או בתעתיק.
2. השתמש בעברית מדוברת וטבעית עם סלנג קליל ("אהלן", "מה קורה", "בכיף").
3. תשובות קצרות בלבד — משפט אחד או שניים מקסימום. חכה לתשובה.
4. אם מפסיקים אותך, תפסיק לדבר מיד ותקשיב.
5. אל תישמע כמו רובוט. אתה תומר — בנאדם אמיתי שמתקשר.
6. התאם את האנרגיה שלך לשיחה. אם עסוקים, תקצר. אם פתוחים, תהיה חם.

מהלך השיחה:

שלב 1 (פתיחה):
"אהלן, מדבר תומר מברק שירותים, מה קורה?"
→ חכה לתשובה.

שלב 2 (הצעה):
"אני מתקשר כי התעניינת אצלנו בעבר לגבי עבודה באילת. לקראת העונה פתחנו מלא תקנים חדשים במלונות עם אחלה מגורים מסובסדים. רציתי לשאול אם אתה עדיין מחפש משהו או שכבר הסתדרת?"
→ חכה לתשובה.

שלב 3 (טיפול בתשובות):

אם כן (עדיין מחפש):
"איזה יופי. תראה, כדי לא לחפור לך עכשיו בטלפון, אני אשלח לך הודעה לוואטסאפ עם כל הפרטים והמשרות הפנויות, סגור?"
→ חכה לתשובה.

אם לא (מצא עבודה / לא רלוונטי):
"וואלה מעולה אחי, שיהיה המון בהצלחה! אם תצטרך משהו בעתיד אנחנו פה. יום טוב!"
→ סיים שיחה.

אם אולי / לא בטוח:
"בלי לחץ, אני רק אשלח לך הודעה בוואטסאפ עם הפרטים ותסתכל כשנוח לך. זה בסדר?"
→ חכה לתשובה.

אם עצבני / לא בזמן טוב:
"סליחה על ההפרעה, אחי. בהצלחה ויום טוב!"
→ סיים שיחה.

שלב 4 (סגירה — הסכים לוואטסאפ):
"יאללה, שולח לך עכשיו. נדבר שם!"
→ סיים שיחה.`;

const ASSISTANT_CONFIG = {
  model: {
    provider: "anthropic" as const,
    model: "claude-sonnet-4-20250514",
    messages: [{ role: "system" as const, content: SYSTEM_PROMPT }],
  },
  voice: {
    provider: "openai" as const,
    voiceId: "onyx",
  },
  firstMessage: "אהלן, מדבר תומר מברק שירותים, מה קורה?",
  transcriber: {
    provider: "openai" as const,
    model: "whisper-1" as const,
    language: "he" as const,
  },
};

interface Message {
  role: "assistant" | "user";
  text: string;
}

export default function VoiceTestPage() {
  const [callActive, setCallActive] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: string }>({
    text: "לחץ להתחיל שיחה עם תומר",
    type: "idle",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const vapiRef = useRef<Vapi | null>(null);

  const startCall = useCallback(async () => {
    setStatus({ text: "מתחבר...", type: "connecting" });

    try {
      const vapi = new Vapi(PUBLIC_KEY);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setCallActive(true);
        setStatus({ text: "שיחה פעילה — תומר מדבר!", type: "active" });
      });

      vapi.on("call-end", () => {
        setCallActive(false);
        setStatus({ text: "השיחה הסתיימה", type: "ended" });
        vapiRef.current = null;
      });

      vapi.on("message", (msg: Record<string, unknown>) => {
        if (msg.type === "transcript" && msg.transcriptType === "final") {
          setMessages((prev) => [
            ...prev,
            { role: msg.role as "assistant" | "user", text: msg.transcript as string },
          ]);
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

      await vapi.start(ASSISTANT_CONFIG);
    } catch (err) {
      setStatus({
        text: "שגיאה בהתחלת שיחה: " + (err instanceof Error ? err.message : String(err)),
        type: "error",
      });
    }
  }, []);

  const stopCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  }, []);

  const statusColors: Record<string, string> = {
    idle: "text-gray-500",
    connecting: "text-yellow-500",
    active: "text-green-500",
    ended: "text-gray-500",
    error: "text-red-500",
  };

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
        <a href="/" className="text-sm text-brand-600 hover:underline">
          &rarr; חזרה לדף הראשי
        </a>

        <h1 className="mt-3 text-3xl font-bold text-brand-900">תומר — ברק שירותים</h1>
        <p className="mt-1 text-sm text-gray-500">Voice AI Re-activation Agent</p>

        <div className="mt-8">
          <button
            onClick={callActive ? stopCall : startCall}
            disabled={status.type === "connecting"}
            className={`inline-flex h-36 w-36 items-center justify-center rounded-full text-5xl transition-all ${
              callActive
                ? "animate-pulse bg-red-500 hover:bg-red-600"
                : status.type === "connecting"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 hover:scale-105"
            }`}
          >
            {callActive ? "🔴" : "📞"}
          </button>
        </div>

        <p className={`mt-4 text-sm font-semibold ${statusColors[status.type] || "text-gray-500"}`}>
          {status.text}
        </p>

        {messages.length > 0 && (
          <div className="mt-6 rounded-xl bg-gray-100 p-4 text-right" style={{ maxHeight: 250, overflowY: "auto" }}>
            <h3 className="mb-3 text-xs text-gray-400">תמלול שיחה</h3>
            {messages.map((msg, i) => (
              <div key={i} className="mb-2 text-sm leading-relaxed">
                <span
                  className={`font-bold ${msg.role === "assistant" ? "text-blue-500" : "text-green-500"}`}
                >
                  {msg.role === "assistant" ? "תומר" : "אתה"}:
                </span>{" "}
                {msg.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
