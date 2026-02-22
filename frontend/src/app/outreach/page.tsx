"use client";

import { useState } from "react";
import type { CandidateProfile, OutreachSequence } from "@/types";
import { generateOutreach } from "@/lib/api";

const DEFAULT_CANDIDATE: CandidateProfile = {
  id: "demo-candidate",
  name: "Sarah Chen",
  headline: "Senior Full-Stack Engineer | React & Python",
  skills: ["React", "TypeScript", "Python", "Node.js", "PostgreSQL", "AWS"],
  experienceLevel: "senior",
  yearsOfExperience: 7,
  interests: ["AI/ML", "developer tools", "open source"],
  currentRole: "Senior Software Engineer",
  currentCompany: "Stripe",
  location: "San Francisco, CA",
};

const DEFAULT_JOB_DESCRIPTION = `Staff Software Engineer - AI Platform

We're building the next generation of AI-powered developer tools. You'll lead a small team designing and shipping core platform services that thousands of engineers rely on daily.

Requirements:
- 6+ years of software engineering experience
- Strong proficiency in Python and TypeScript
- Experience building and scaling distributed systems
- Passion for developer experience and tooling

Benefits:
- Competitive salary ($200k-$280k) + equity
- Remote-friendly with offices in SF and NYC
- Generous PTO and learning budget`;

const CHANNEL_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  linkedin: { label: "LinkedIn", bg: "bg-blue-100", text: "text-blue-700" },
  email: { label: "Email", bg: "bg-green-100", text: "text-green-700" },
};

export default function OutreachPage() {
  const [candidate, setCandidate] = useState(DEFAULT_CANDIDATE);
  const [jobDescription, setJobDescription] = useState(DEFAULT_JOB_DESCRIPTION);
  const [result, setResult] = useState<OutreachSequence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const seq = await generateOutreach(candidate, jobDescription);
      setResult(seq);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function updateCandidate<K extends keyof CandidateProfile>(
    key: K,
    value: CandidateProfile[K]
  ) {
    setCandidate((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <a
            href="/"
            className="text-sm text-brand-600 hover:underline"
          >
            &larr; Back to Home
          </a>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-brand-900">
            Outreach Generator
          </h1>
          <p className="mt-2 text-gray-600">
            Generate a personalized 3-step outreach sequence for any candidate.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
          <h2 className="text-lg font-semibold text-brand-900 mb-4">
            Candidate Profile
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" value={candidate.name} onChange={(v) => updateCandidate("name", v)} />
            <Field label="Headline" value={candidate.headline} onChange={(v) => updateCandidate("headline", v)} />
            <Field label="Current Role" value={candidate.currentRole ?? ""} onChange={(v) => updateCandidate("currentRole", v)} />
            <Field label="Current Company" value={candidate.currentCompany ?? ""} onChange={(v) => updateCandidate("currentCompany", v)} />
            <Field label="Location" value={candidate.location ?? ""} onChange={(v) => updateCandidate("location", v)} />
            <Field
              label="Experience Level"
              value={candidate.experienceLevel}
              onChange={(v) => updateCandidate("experienceLevel", v as CandidateProfile["experienceLevel"])}
            />
            <Field
              label="Years of Experience"
              value={String(candidate.yearsOfExperience)}
              onChange={(v) => updateCandidate("yearsOfExperience", Number(v) || 0)}
            />
            <Field
              label="Skills (comma-separated)"
              value={candidate.skills.join(", ")}
              onChange={(v) => updateCandidate("skills", v.split(",").map((s) => s.trim()).filter(Boolean))}
            />
            <div className="sm:col-span-2">
              <Field
                label="Interests (comma-separated)"
                value={candidate.interests.join(", ")}
                onChange={(v) => updateCandidate("interests", v.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-brand-900 mt-6 mb-4">
            Job Description
          </h2>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Spinner />}
            {loading ? "Generating…" : "Generate Outreach"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-brand-900">
              Outreach Sequence
            </h2>
            {result.steps.map((step) => {
              const ch = CHANNEL_STYLES[step.channel] ?? CHANNEL_STYLES.email;
              return (
                <div
                  key={step.stepNumber}
                  className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                      {step.stepNumber}
                    </span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-medium ${ch.bg} ${ch.text}`}
                    >
                      {ch.label}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">
                      Send after {step.sendAfterDays} day{step.sendAfterDays !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {step.subject && (
                    <p className="mb-2 text-sm font-semibold text-gray-800">
                      Subject: {step.subject}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <input
        type="text"
        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
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
