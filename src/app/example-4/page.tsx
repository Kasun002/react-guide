import Link from "next/link";

export const metadata = { title: "Example 4 – UserGuide" };

export default function Example4Page() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-emerald-600 px-8 py-10 text-white">
        <p className="mb-1 text-sm font-medium text-emerald-200">Section 4</p>
        <h1 className="text-3xl font-bold">Example 4</h1>
        <p className="mt-2 text-emerald-100">Deep dive into advanced topics in section four.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Overview</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Ready to go deeper? This section covers advanced concepts and techniques that
            power users and developers rely on to push the boundaries of what is possible.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Key Points</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              Advanced configuration options
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              Performance optimisation tips
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              Debugging and troubleshooting
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Content</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed
          quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque
          porro quisquam est qui dolorem ipsum quia dolor sit amet.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/example-3" className="text-sm text-gray-500 hover:text-gray-900">
          ← Example 3
        </Link>
        <Link
          href="/example-5"
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Next: Example 5 →
        </Link>
      </div>
    </div>
  );
}
