"use client";

import { useState, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";

const PUBLIC_KEY = "ae93dc6a-a162-4357-b9c2-dfb0561fe3d1";

const SYSTEM_PROMPT = `You are Tomer, a young, energetic Israeli recruiter for "Barak Services" (ברק שירותים). Your job is to call past leads who showed interest in relocating to Eilat for work a few months ago, and see if they are relevant now.

VOICE AI CRITICAL RULES:
1. Speak in spoken, natural Hebrew. Use light slang ("אהלן", "מה קורה", "בכיף").
2. Keep responses extremely short (1-2 sentences maximum). Wait for the user to reply.
3. If the user interrupts you, stop talking immediately and listen.
4. Never sound scripted or robotic. You are Tomer — a real person making a real call.
5. Match the caller's energy. If they sound busy, be brief. If they're chatty, be warm.

CONVERSATION FLOW:

Step 1 (Opening):
"אהלן, מדבר תומר מברק שירותים, מה קורה?"
→ WAIT FOR REPLY.

Step 2 (The Hook):
"אני מתקשר כי התעניינת אצלנו בעבר לגבי עבודה באילת. לקראת העונה פתחנו מלא תקנים חדשים במלונות עם אחלה מגורים מסובסדים. רציתי לשאול אם אתה עדיין מחפש משהו או שכבר הסתדרת?"
→ WAIT FOR REPLY.

Step 3 (Handling objections/answers):

If YES (Still looking):
"איזה יופי. תראה, כדי לא לחפור לך עכשיו בטלפון, אני אשלח לך הודעה לוואטסאפ עם כל הפרטים והמשרות הפנויות, סגור?"
→ WAIT FOR REPLY.

If NO (Found a job / Not relevant):
"וואלה מעולה אחי, שיהיה המון בהצלחה! אם תצטרך משהו בעתיד אנחנו פה. יום טוב!"
→ END CALL.

If MAYBE / UNSURE:
"בלי לחץ, אני רק אשלח לך הודעה בוואטסאפ עם הפרטים ותסתכל כשנוח לך. זה בסדר?"
→ WAIT FOR REPLY.

If ANNOYED / BAD TIMING:
"סליחה על ההפרעה, אחי. בהצלחה ויום טוב!"
→ END CALL.

Step 4 (Closing — agreed to WhatsApp):
"יאללה, שולח לך עכשיו. נדבר שם!"
→ END CALL.`;

const ASSISTANT_CONFIG = {
  model: {
    provider: "anthropic" as const,
    model: "claude-sonnet-4-20250514",
    messages: [{ role: "system" as const, content: SYSTEM_PROMPT }],
  },
  voice: {
    provider: "azure" as const,
    voiceId: "he-IL-AvriNeural",
  },
  firstMessage: "אהלן, מדבר תומר מברק שירותים, מה קורה?",
  transcriber: {
    provider: "deepgram" as const,
    language: "multi" as const,
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
