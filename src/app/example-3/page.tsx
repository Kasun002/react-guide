import Link from "next/link";
import TabsDemo from "./TabsDemo";

export const metadata = { title: "Compound Tabs – Interview Guide" };

const CONCEPTS = [
  "createContext",
  "useContext",
  "compound pattern",
  "no prop drilling",
  "roving tabindex",
  "ARIA roles",
  "keyboard nav",
];

export default function Example3Page() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-sky-600 px-8 py-10 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-sky-200">Example 3 · 30–35 min</p>
            <h1 className="text-3xl font-bold">Compound Tabs</h1>
            <p className="mt-1 text-sky-200">Context · No Prop Drilling · Accessibility</p>
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
          &quot;Build a reusable <code className="rounded bg-amber-100 px-1 font-mono text-xs">Tabs</code> component
          using the compound component pattern. Sub-components —{" "}
          <code className="rounded bg-amber-100 px-1 font-mono text-xs">Tabs.List</code>,{" "}
          <code className="rounded bg-amber-100 px-1 font-mono text-xs">Tabs.Tab</code>,{" "}
          <code className="rounded bg-amber-100 px-1 font-mono text-xs">Tabs.Panel</code> — must share
          state through Context, not props. Include keyboard navigation and correct ARIA attributes.&quot;
        </p>
      </div>

      {/* Concept tags */}
      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map(tag => (
          <span key={tag} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            {tag}
          </span>
        ))}
      </div>

      {/* Live demo */}
      <TabsDemo />

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <Link href="/example-2" className="text-sm text-gray-500 hover:text-gray-900">
          ← Example 2
        </Link>
        <Link
          href="/example-4"
          className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Next: Example 4 →
        </Link>
      </div>
    </div>
  );
}
