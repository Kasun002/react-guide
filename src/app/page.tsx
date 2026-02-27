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
    description: "Explore concepts and patterns in the second section.",
    href: "/example-2",
    color: "bg-violet-50 border-violet-200",
    iconColor: "bg-violet-600",
  },
  {
    number: 3,
    title: "Example 3",
    description: "Hands-on walkthrough of the third use case.",
    href: "/example-3",
    color: "bg-sky-50 border-sky-200",
    iconColor: "bg-sky-600",
  },
  {
    number: 4,
    title: "Example 4",
    description: "Deep dive into advanced topics in section four.",
    href: "/example-4",
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "bg-emerald-600",
  },
  {
    number: 5,
    title: "Example 5",
    description: "Final section covering best practices and next steps.",
    href: "/example-5",
    color: "bg-amber-50 border-amber-200",
    iconColor: "bg-amber-600",
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
          User Guide
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-indigo-100">
          A comprehensive guide with five detailed examples to help you get
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
