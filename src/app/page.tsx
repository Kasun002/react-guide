import Link from "next/link";

const examples = [
  {
    number: 1,
    title: "Example 1",
    description: "Large data table — search, sort, pagination, useDeferredValue & useMemo.",
    href: "/example-1",
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "bg-indigo-600",
  },
  {
    number: 2,
    title: "Example 2",
    description: "Custom useFetch hook — AbortController, useReducer, cache & race conditions.",
    href: "/example-2",
    color: "bg-violet-50 border-violet-200",
    iconColor: "bg-violet-600",
  },
  {
    number: 3,
    title: "Example 3",
    description: "Compound Tabs — Context API, no prop drilling, ARIA & keyboard nav.",
    href: "/example-3",
    color: "bg-sky-50 border-sky-200",
    iconColor: "bg-sky-600",
  },
  {
    number: 4,
    title: "Example 4",
    description: "Countdown timer + typewriter — useRef, stale closures, effect cleanup.",
    href: "/example-4",
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "bg-emerald-600",
  },
  {
    number: 5,
    title: "Example 5",
    description: "Recursive file tree — clean recursion, per-node state, memo & stable keys.",
    href: "/example-5",
    color: "bg-amber-50 border-amber-200",
    iconColor: "bg-amber-600",
  },
  {
    number: 6,
    title: "Example 6",
    description: "Data polling — live table, visibility pause, silent refresh & cleanup.",
    href: "/example-6",
    color: "bg-rose-50 border-rose-200",
    iconColor: "bg-rose-600",
  },
  {
    number: 7,
    title: "Example 7",
    description: "Todo list — useCallback + memo combo, stable refs, when NOT to use either.",
    href: "/example-7",
    color: "bg-purple-50 border-purple-200",
    iconColor: "bg-purple-600",
  },
  {
    number: 8,
    title: "Example 8",
    description: "Redux Toolkit cart — createSlice, Immer mutations, useSelector & useDispatch.",
    href: "/example-8",
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "bg-indigo-700",
  },
  {
    number: 9,
    title: "Example 9",
    description: "Context API cart — useReducer, split context pattern, custom hooks vs Redux.",
    href: "/example-9",
    color: "bg-teal-50 border-teal-200",
    iconColor: "bg-teal-700",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 px-10 py-20 text-center text-white">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-200">
          Welcome
        </p>
        <h1 className="mb-4 text-5xl font-bold leading-tight">
          React Guide
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-indigo-100">
          A comprehensive guide with nine detailed examples to help you get
          started quickly and confidently.
        </p>
        <Link
          href="/example-1"
          className="inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-700 shadow transition hover:shadow-md hover:bg-indigo-50"
        >
          Get Started →
        </Link>
      </section>

      {/* Cards */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Browse Examples</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((ex) => (
            <Link
              key={ex.href}
              href={ex.href}
              className={`group flex flex-col gap-4 rounded-xl border p-6 transition hover:-translate-y-0.5 hover:shadow-md ${ex.color}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${ex.iconColor} text-white text-sm font-bold`}
              >
                {ex.number}
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-indigo-700">
                  {ex.title}
                </h3>
                <p className="text-sm text-gray-600">{ex.description}</p>
              </div>
              <span className="mt-auto text-sm font-medium text-indigo-600 group-hover:underline">
                View →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
