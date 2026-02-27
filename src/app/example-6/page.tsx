import Link from "next/link";
import PollTable from "./PollTable";

export const metadata = { title: "Data Polling – Interview Guide" };

const CONCEPTS = [
  "setInterval polling",
  "useCallback",
  "useRef",
  "visibility pause",
  "effect cleanup",
  "silent refresh",
];

export default function Example6Page() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-rose-600 px-8 py-10 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-rose-200">Example 6 · 30–35 min</p>
            <h1 className="text-3xl font-bold">Data Polling</h1>
            <p className="mt-1 text-rose-200">Live Table · Pause on Hidden · Manual Refresh</p>
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
          &quot;Poll a public API every 5 seconds and display live results in a table.
          The first load should show a spinner; subsequent polls must update silently.
          Pause polling when the tab is hidden, resume and refresh immediately when it
          becomes visible again. Clean up all timers on unmount.&quot;
        </p>
      </div>

      {/* Concept tags */}
      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map(tag => (
          <span key={tag} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
            {tag}
          </span>
        ))}
      </div>

      {/* Live demo */}
      <PollTable />

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <Link href="/example-5" className="text-sm text-gray-500 hover:text-gray-900">
          ← Example 5
        </Link>
        <Link href="/example-7" className="rounded-lg bg-rose-600 px-5 py-2 text-sm font-medium text-white hover:bg-rose-700">
          Example 7 →
        </Link>
      </div>
    </div>
  );
}
