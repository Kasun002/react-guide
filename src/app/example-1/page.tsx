import Link from "next/link";
import DataTable from "./DataTable";

export const metadata = { title: "Large Data Table – Interview Guide" };

const CONCEPTS = [
  "useDeferredValue",
  "useMemo",
  "useEffect",
  "proper keys",
  "loading state",
  "error state",
];

export default function Example1Page() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-indigo-600 px-8 py-10 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-indigo-200">
              Example 1 · 30–40 min
            </p>
            <h1 className="text-3xl font-bold">Large Data Table</h1>
            <p className="mt-1 text-indigo-200">Search · Sort · Pagination</p>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            Senior Level
          </span>
        </div>
      </div>

      {/* The interview question */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
          The Question
        </p>
        <p className="text-sm leading-relaxed text-gray-700">
          &quot;Build a data table that loads 500 user records, supports live search
          across name / email / role, column sorting, and pagination with a
          configurable page size. The search input must stay responsive even
          while filtering large datasets.&quot;
        </p>
      </div>

      {/* React concept tags */}
      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* The component under test */}
      <DataTable />

      {/* Page navigation */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Home
        </Link>
        <Link
          href="/example-2"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Next: Example 2 →
        </Link>
      </div>
    </div>
  );
}
