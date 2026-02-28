"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/types";
import { sendScreeningMessage } from "@/lib/api";

export default function ScreeningChatPage() {
  const [jobTitle, setJobTitle] = useState("עבודה באילת");
  const [location, setLocation] = useState("אילת");
  const [candidateName, setCandidateName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screeningComplete, setScreeningComplete] = useState(false);
  const [candidateFit, setCandidateFit] = useState<string | null>(null);

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
        candidateName: candidateName || undefined,
        jobTitle,
        location: location || undefined,
      });

      setMessages([...updatedMessages, { role: "assistant", content: response.reply }]);

      if (response.screeningComplete) {
        setScreeningComplete(true);
        setCandidateFit(response.candidateFit);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "משהו השתבש");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="flex min-h-screen flex-col bg-gradient-to-br from-brand-50 via-white to-brand-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-4 text-center">
        <a href="/" className="text-sm text-brand-600 hover:underline">
          &rarr; חזרה לדף הראשי
        </a>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-900">
          צ׳אט סינון מועמדים
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          סינון מועמדים בסגנון WhatsApp מבוסס AI
        </p>
      </div>

      {/* Config bar */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl flex-wrap gap-3">
          <label className="flex-1 min-w-[160px]">
            <span className="text-xs font-medium text-gray-600">תפקיד</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </label>
          <label className="flex-1 min-w-[140px]">
            <span className="text-xs font-medium text-gray-600">מיקום</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
          <label className="flex-1 min-w-[140px]">
            <span className="text-xs font-medium text-gray-600">שם המועמד/ת</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="לא חובה"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-12">
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
                    : "bg-gray-100 text-gray-800 rounded-br-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-br-md bg-gray-100 px-4 py-2.5 text-sm text-gray-400 flex items-center gap-2">
                <Spinner /> מקליד/ה…
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

      {/* Error */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <form
          className="mx-auto flex max-w-2xl gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
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
    </main>
  );
}

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
