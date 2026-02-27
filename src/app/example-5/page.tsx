import Link from "next/link";

export const metadata = { title: "Example 5 – UserGuide" };

export default function Example5Page() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-amber-500 px-8 py-10 text-white">
        <p className="mb-1 text-sm font-medium text-amber-100">Section 5</p>
        <h1 className="text-3xl font-bold">Example 5</h1>
        <p className="mt-2 text-amber-100">Final section covering best practices and next steps.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Overview</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            You have made it to the final section! Here we recap best practices, share
            recommended next steps, and point you towards additional resources to continue
            your journey.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Key Points</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Recap of all five examples
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Best practices checklist
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Resources and further reading
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Content</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
          praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
          excepturi sint occaecati cupiditate non provident.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">You are all done!</h2>
        <p className="mb-4 text-sm text-gray-600">
          You have completed all five examples. Head back to the home page or revisit any
          section at any time.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="flex items-center justify-start">
        <Link href="/example-4" className="text-sm text-gray-500 hover:text-gray-900">
          ← Example 4
        </Link>
      </div>
    </div>
  );
}
