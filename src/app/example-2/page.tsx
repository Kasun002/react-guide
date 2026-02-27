import Link from "next/link";

export const metadata = { title: "Example 2 – UserGuide" };

export default function Example2Page() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-violet-600 px-8 py-10 text-white">
        <p className="mb-1 text-sm font-medium text-violet-200">Section 2</p>
        <h1 className="text-3xl font-bold">Example 2</h1>
        <p className="mt-2 text-violet-100">Explore concepts and patterns in the second section.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Overview</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Building on what you learned in Example 1, this section dives deeper into
            patterns and best practices. Discover how concepts connect to real-world usage.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Key Points</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
              Recognize common design patterns
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
              Apply patterns in your projects
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
              Avoid common pitfalls
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Content</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

      <div className="flex items-center justify-between">
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
