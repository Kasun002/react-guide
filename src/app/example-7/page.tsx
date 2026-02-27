import Link from "next/link";
import TodoList from "./TodoList";

export const metadata = { title: "Todo — useCallback & memo – Interview Guide" };

const CONCEPTS = [
  "useCallback",
  "React.memo",
  "stable references",
  "functional updates",
  "when NOT to memo",
];

export default function Example7Page() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-purple-600 px-8 py-10 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-purple-200">Example 7 · 30 min</p>
            <h1 className="text-3xl font-bold">Todo List</h1>
            <p className="mt-1 text-purple-200">useCallback · memo · Stable References</p>
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
          &quot;Build a todo app where adding a new item does <strong>not</strong> re-render
          every existing row. Use <code className="rounded bg-amber-100 px-1 font-mono text-xs">React.memo</code> and{" "}
          <code className="rounded bg-amber-100 px-1 font-mono text-xs">useCallback</code> together
          to keep child renders minimal. Explain when useCallback gives no benefit.&quot;
        </p>
      </div>

      {/* Concept tags */}
      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map(tag => (
          <span key={tag} className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
            {tag}
          </span>
        ))}
      </div>

      {/* Key insight callout */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <p className="mb-1 text-xs font-semibold text-purple-700">memo alone</p>
          <p className="text-xs text-gray-600">
            Fails — inline handlers are new references every render, so memo&apos;s
            shallow comparison always sees changed props.
          </p>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <p className="mb-1 text-xs font-semibold text-purple-700">useCallback alone</p>
          <p className="text-xs text-gray-600">
            Useless — without memo the child re-renders regardless of whether
            the function reference is stable.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="mb-1 text-xs font-semibold text-emerald-700">memo + useCallback</p>
          <p className="text-xs text-gray-600">
            Works — stable refs pass memo&apos;s shallow check, so unchanged rows
            are skipped entirely.
          </p>
        </div>
      </div>

      {/* Live demo */}
      <TodoList />

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <Link href="/example-6" className="text-sm text-gray-500 hover:text-gray-900">
          ← Example 6
        </Link>
        <Link href="/example-8" className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-700">
          Example 8 →
        </Link>
      </div>
    </div>
  );
}
