import Link from "next/link";

export const metadata = { title: "Example 1 – UserGuide" };

export default function Example1Page() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-indigo-600 px-8 py-10 text-white">
        <p className="mb-1 text-sm font-medium text-indigo-200">Section 1</p>
        <h1 className="text-3xl font-bold">Example 1</h1>
        <p className="mt-2 text-indigo-100">Introduction and overview of the first topic.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Overview</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            This section introduces the foundational concepts you need to understand before
            moving forward. Learn the basics and build a solid foundation for the rest of
            the guide.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Key Points</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
              Understand the core principles
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
              Explore practical applications
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
              Follow step-by-step instructions
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Content</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to Home
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
