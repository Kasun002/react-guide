import Link from "next/link";
import type { Metadata } from "next";
import ProfilerDemo from "./ProfilerDemo";

export const metadata: Metadata = { title: "Example 11 · React Profiler API" };

const CONCEPTS = [
  "Profiler",
  "onRenderCallback",
  "actualDuration",
  "baseDuration",
  "phase (mount / update)",
  "performance measurement",
];

export default function Example11Page() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-orange-600 px-8 py-10 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-orange-200">Example 11 · 30 min</p>
            <h1 className="text-3xl font-bold">React Profiler API</h1>
            <p className="mt-1 text-orange-200">
              Profiler · onRenderCallback · actualDuration · baseDuration
            </p>
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
          &quot;How would you measure which components are the slowest in a React
          tree without installing any third-party library? Walk me through the{" "}
          <code className="rounded bg-amber-100 px-1 font-mono text-xs">Profiler</code>{" "}
          API, what each callback argument means, and how{" "}
          <code className="rounded bg-amber-100 px-1 font-mono text-xs">actualDuration</code>{" "}
          differs from{" "}
          <code className="rounded bg-amber-100 px-1 font-mono text-xs">baseDuration</code>.&quot;
        </p>
      </div>

      {/* Concept tags */}
      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Key insight callout */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="mb-1 text-xs font-semibold text-orange-700">Wrap, don&apos;t instrument</p>
          <p className="text-xs text-gray-600">
            No code changes inside profiled components — just wrap the subtree in{" "}
            <code className="rounded bg-white px-1 font-mono">&lt;Profiler&gt;</code> and
            React reports the timing automatically.
          </p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="mb-1 text-xs font-semibold text-orange-700">actualDuration drops with memo</p>
          <p className="text-xs text-gray-600">
            Memoized children that are bailed out are excluded from{" "}
            <code className="rounded bg-white px-1 font-mono">actualDuration</code>{" "}
            but still counted in{" "}
            <code className="rounded bg-white px-1 font-mono">baseDuration</code>.
          </p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="mb-1 text-xs font-semibold text-orange-700">Profiler is free in dev</p>
          <p className="text-xs text-gray-600">
            React strips profiling overhead from production bundles by default.
            Use a profiling build (<code className="rounded bg-white px-1 font-mono">react-dom/profiling</code>)
            for production measurements.
          </p>
        </div>
      </div>

      {/* Live demo */}
      <ProfilerDemo />

      {/* onRender callback signature */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-5 text-sm">
        <p className="mb-3 font-semibold text-gray-800">onRender Callback — All Parameters</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="pb-2 pr-4 font-semibold">Parameter</th>
                <th className="pb-2 pr-4 font-semibold">Type</th>
                <th className="pb-2 font-semibold">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {[
                ["id", "string", 'The id prop of the <Profiler> — useful when nesting multiple profilers.'],
                ["phase", '"mount" | "update" | "nested-update"', '"mount" on first render, "update" on re-renders, "nested-update" when a child triggers state during render.'],
                ["actualDuration", "number (ms)", "Time spent rendering this commit, skipping bailed-out memoized subtrees."],
                ["baseDuration", "number (ms)", "Estimated full-render cost with no memoization — your worst-case baseline."],
                ["startTime", "number (ms)", "When React began rendering this update (relative to page load)."],
                ["commitTime", "number (ms)", "When React committed the update — useful to correlate with other metrics."],
              ].map(([param, type, desc]) => (
                <tr key={param}>
                  <td className="py-2 pr-4">
                    <code className="rounded bg-white px-1 font-mono text-orange-700">{param}</code>
                  </td>
                  <td className="py-2 pr-4 font-mono text-gray-500">{type}</td>
                  <td className="py-2 text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <Link href="/example-10" className="text-sm text-gray-500 hover:text-gray-900">
          ← Example 10
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          Home →
        </Link>
      </div>
    </div>
  );
}
