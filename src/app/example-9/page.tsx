import Link from "next/link";
import { CartProvider } from "@/context/CartContext";
import CartDemo from "./CartDemo";

export const metadata = { title: "Context Cart – Interview Guide" };

const CONCEPTS = [
  "createContext",
  "useReducer",
  "split context pattern",
  "useContext",
  "custom hooks",
  "co-located selectors",
];

export default function Example9Page() {
  return (
    // CartProvider wraps only this page — same scoping principle as Redux StoreProvider
    <CartProvider>
      <div className="space-y-6">

        {/* Header */}
        <div className="rounded-xl bg-teal-700 px-8 py-10 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-sm font-medium text-teal-300">Example 9 · 30–40 min</p>
              <h1 className="text-3xl font-bold">Context API — Shopping Cart</h1>
              <p className="mt-1 text-teal-200">createContext · useReducer · split context pattern</p>
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
            &quot;Build the same shopping cart as Example 8 but using React Context + useReducer
            instead of Redux. Use the split-context pattern to avoid unnecessary re-renders.
            Co-locate plain selector functions with the context. Explain the trade-offs vs Redux.&quot;
          </p>
        </div>

        {/* Concept tags */}
        <div className="flex flex-wrap gap-2">
          {CONCEPTS.map(tag => (
            <span key={tag} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              {tag}
            </span>
          ))}
        </div>

        {/* vs Redux callout */}
        <div className="rounded-xl border border-teal-200 bg-teal-50 px-6 py-4 text-sm text-teal-800 space-y-1">
          <p className="font-semibold">Context vs Redux — key trade-offs</p>
          <ul className="list-disc pl-5 space-y-1 text-teal-700">
            <li><strong>Context:</strong> zero extra deps, built-in, great for low-frequency updates.</li>
            <li><strong>Redux:</strong> surgical re-renders via <code>useSelector</code>, DevTools time-travel, middleware.</li>
            <li>Split context (state + dispatch in separate providers) closes most of the re-render gap.</li>
          </ul>
        </div>

        {/* Live demo */}
        <CartDemo />

        {/* Nav */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <Link href="/example-8" className="text-sm text-gray-500 hover:text-gray-900">
            ← Example 8
          </Link>
          <Link href="/" className="rounded-lg bg-teal-700 px-5 py-2 text-sm font-medium text-white hover:bg-teal-800">
            Home →
          </Link>
        </div>
      </div>
    </CartProvider>
  );
}
