import Link from "next/link";
import TimerDemo from "./TimerDemo";

export const metadata = { title: "Countdown Timer + Typewriter – Interview Guide" };

const CONCEPTS = [
  "useRef",
  "useEffect cleanup",
  "stale closures",
  "functional updates",
  "interval / timeout",
];

export default function Example4Page() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-emerald-600 px-8 py-10 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-emerald-200">Example 4 · 30–35 min</p>
            <h1 className="text-3xl font-bold">Countdown Timer + Typewriter</h1>
            <p className="mt-1 text-emerald-200">useRef · useEffect cleanup · Stale Closures</p>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            Senior Level
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
          The Question
        </p>
        <p className="text-sm leading-relaxed text-gray-700">
          &quot;Build a countdown timer that supports pause and resume, and a typewriter
          that cycles through strings character-by-character. Both must clean up their
          intervals on unmount and avoid stale closure bugs when updating state.&quot;
        </p>
      </div>

      {/* Concept tags */}
      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map(tag => (
          <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {tag}
          </span>
        ))}
      </div>

      {/* Live demo */}
      <TimerDemo />

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <Link href="/example-3" className="text-sm text-gray-500 hover:text-gray-900">
          ← Example 3
        </Link>
        <Link
          href="/example-5"
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Next: Example 5 →
        </Link>
      </div>
    </div>
  );
}
