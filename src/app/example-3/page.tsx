import Link from "next/link";

export const metadata = { title: "Example 3 – UserGuide" };

export default function Example3Page() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-sky-600 px-8 py-10 text-white">
        <p className="mb-1 text-sm font-medium text-sky-200">Section 3</p>
        <h1 className="text-3xl font-bold">Example 3</h1>
        <p className="mt-2 text-sky-100">Hands-on walkthrough of the third use case.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Overview</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            This section offers a hands-on walkthrough. Follow along with the examples to
            reinforce your understanding through practical application.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Key Points</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
              Follow guided exercises
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
              Build something from scratch
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
              Test and validate your work
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Content</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
          veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>

      <div className="flex items-center justify-between">
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
