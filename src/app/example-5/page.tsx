import Link from "next/link";
import FileTree from "./FileTree";

export const metadata = { title: "Recursive File Tree – Interview Guide" };

const CONCEPTS = [
  "recursion",
  "per-node state",
  "React.memo",
  "stable keys",
  "conditional render",
];

export default function Example5Page() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-amber-500 px-8 py-10 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-amber-100">Example 5 · 30–35 min</p>
            <h1 className="text-3xl font-bold">Recursive File Tree</h1>
            <p className="mt-1 text-amber-100">Recursion · Per-node State · Memo · Keys</p>
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
          &quot;Build a collapsible file-tree component from a nested data structure.
          Each folder must manage its own open/closed state independently — no lifted state,
          no prop drilling. Wrap nodes with <code className="rounded bg-amber-100 px-1 font-mono text-xs">React.memo</code> so
          toggling one folder does not re-render its siblings.&quot;
        </p>
      </div>

      {/* Concept tags */}
      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map(tag => (
          <span key={tag} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            {tag}
          </span>
        ))}
      </div>

      {/* Live demo */}
      <FileTree />

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <Link href="/example-4" className="text-sm text-gray-500 hover:text-gray-900">
          ← Example 4
        </Link>
        <Link href="/example-6" className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600">
          Example 6 →
        </Link>
      </div>
    </div>
  );
}
