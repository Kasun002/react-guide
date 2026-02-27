import Link from "next/link";
import { StoreProvider } from "@/store/StoreProvider";
import CartDemo from "./CartDemo";

export const metadata = { title: "Redux Toolkit Cart – Interview Guide" };

const CONCEPTS = [
  "configureStore",
  "createSlice",
  "Immer mutations",
  "useSelector",
  "useDispatch",
  "co-located selectors",
];

export default function Example8Page() {
  return (
    // StoreProvider wraps only this page — not the entire app layout
    <StoreProvider>
      <div className="space-y-6">

        {/* Header */}
        <div className="rounded-xl bg-indigo-700 px-8 py-10 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-sm font-medium text-indigo-300">Example 8 · 30–40 min</p>
              <h1 className="text-3xl font-bold">Redux Toolkit — Shopping Cart</h1>
              <p className="mt-1 text-indigo-200">createSlice · useSelector · useDispatch</p>
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
            &quot;Set up Redux Toolkit with a cart slice that supports add, remove, increment,
            decrement, and clear. Connect it to a product catalog UI. Co-locate selectors
            with the slice. Explain how Immer enables mutation-style reducer logic.&quot;
          </p>
        </div>

        {/* Concept tags */}
        <div className="flex flex-wrap gap-2">
          {CONCEPTS.map(tag => (
            <span key={tag} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              {tag}
            </span>
          ))}
        </div>

        {/* Live demo */}
        <CartDemo />

        {/* Nav */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <Link href="/example-7" className="text-sm text-gray-500 hover:text-gray-900">
            ← Example 7
          </Link>
          <Link href="/example-9" className="rounded-lg bg-indigo-700 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-800">
            Example 9 →
          </Link>
        </div>
      </div>
    </StoreProvider>
  );
}
