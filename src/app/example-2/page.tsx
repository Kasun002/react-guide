import Link from "next/link";
import FetchDemo from "./FetchDemo";

export const metadata = { title: "Custom useFetch Hook – Interview Guide" };

const CONCEPTS = [
  "useReducer",
  "AbortController",
  "race conditions",
  "unmount safety",
  "request cache",
  "useEffect cleanup",
];

export default function Example2Page() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-violet-600 px-8 py-10 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-violet-200">Example 2 · 30–35 min</p>
            <h1 className="text-3xl font-bold">Custom useFetch Hook</h1>
            <p className="mt-1 text-violet-200">Cache · Abort · Error</p>
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
          &quot;Build a reusable <code className="rounded bg-amber-100 px-1 font-mono text-xs">useFetch</code> hook
          that manages loading / data / error state with <code className="rounded bg-amber-100 px-1 font-mono text-xs">useReducer</code>,
          cancels in-flight requests when the URL changes or the component unmounts,
          and caches results so repeated calls for the same URL are instant.&quot;
        </p>
      </div>

      {/* Concept tags */}
      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map(tag => (
          <span key={tag} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            {tag}
          </span>
        ))}
      </div>

      {/* Live demo */}
      <FetchDemo />

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <Link href="/example-1" className="text-sm text-gray-500 hover:text-gray-900">
          ← Example 1
        </Link>
        <Link
          href="/example-3"
          className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Next: Example 3 →
        </Link>
      </div>
    </div>
  );
}
