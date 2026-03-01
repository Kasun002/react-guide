/* eslint-disable react-hooks/purity */
"use client";

/**
 * Profiler Demo — Measure React Render Performance
 *
 * Concepts:
 *  - Profiler          : built-in React component that times its subtree
 *  - onRenderCallback  : fired after every commit with timing data
 *  - actualDuration    : real ms spent rendering the profiled subtree
 *  - baseDuration      : estimated cost without any memoization
 *  - phase             : "mount" | "update" | "nested-update"
 *
 * Why memo + useCallback here?
 *  setRecords() causes ProfilerDemo to re-render. Without memo, that would
 *  also re-render the Profiler subtree → onRender fires → setRecords again →
 *  infinite loop. Wrapping ProfiledTree in memo and stabilising onRender with
 *  useCallback([]) breaks the cycle: records state changes don't reach the
 *  Profiler because its props haven't changed.
 */

import {
  Profiler,
  type ProfilerOnRenderCallback,
  useState,
  useRef,
  useCallback,
  memo,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Phase = "mount" | "update" | "nested-update";

type RenderRecord = {
  id: number;
  phase: Phase;
  actualDuration: number;
  baseDuration: number;
};

// ── Style maps ─────────────────────────────────────────────────────────────────

const PHASE_STYLE: Record<Phase, string> = {
  mount: "border-emerald-200 bg-emerald-50 text-emerald-700",
  update: "border-blue-200 bg-blue-50 text-blue-700",
  "nested-update": "border-amber-200 bg-amber-50 text-amber-700",
};

// ── SlowList — intentionally slow to make profiling visible ───────────────────
//
// A synchronous spin burns ~4 ms so the Profiler has visible numbers to report.
// In a real app this "slowness" would come from a large list, heavy computation,
// or many child components — the Profiler helps you find it.

function SlowList({ items }: { items: string[] }) {
  const t = performance.now();
  while (performance.now() - t < 4) { /* deliberate spin */ }

  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-gray-700"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

// ── ProfiledTree — isolated behind memo ───────────────────────────────────────
//
// Keeping the Profiler in its own memo'd component is the key fix.
// When ProfilerDemo re-renders due to setRecords(), this component bails out
// (same items/counter/onRender props) so the Profiler never fires onRender.

const ProfiledTree = memo(function ProfiledTree({
  items,
  counter,
  onRender,
}: {
  items: string[];
  counter: number;
  onRender: ProfilerOnRenderCallback;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Profiled Subtree
      </p>

      {/* Everything inside <Profiler> is timed on every commit */}
      <Profiler id="SlowListProfiler" onRender={onRender}>
        <SlowList items={items} />
        <p className="mt-3 text-sm text-gray-500">
          Counter: <strong className="text-gray-900">{counter}</strong>
        </p>
      </Profiler>
    </div>
  );
});

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProfilerDemo() {
  const [items, setItems] = useState(["Apple", "Banana", "Cherry"]);
  const [counter, setCounter] = useState(0);
  const [records, setRecords] = useState<RenderRecord[]>([]);
  const nextId = useRef(1);

  // useCallback([]) produces a stable reference so memo(ProfiledTree) bails
  // out when only records state changes — breaking the infinite loop.
  // setRecords and nextId are both stable so the empty dep array is correct.
  const handleRender: ProfilerOnRenderCallback = useCallback(
    (_id, phase, actualDuration, baseDuration) => {
      setRecords((prev) => [
        {
          id: nextId.current++,
          phase: phase as Phase,
          actualDuration: +actualDuration.toFixed(2),
          baseDuration: +baseDuration.toFixed(2),
        },
        ...prev.slice(0, 9), // keep latest 10 records
      ]);
    },
    [],
  );

  return (
    <div className="space-y-4">

      <ProfiledTree items={items} counter={counter} onRender={handleRender} />

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCounter((c) => c + 1)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Increment Counter
        </button>
        <button
          onClick={() =>
            setItems((prev) => [...prev, `Item ${prev.length + 1}`])
          }
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
        >
          Add Item
        </button>
        <button
          onClick={() => {
            setItems(["Apple", "Banana", "Cherry"]);
            setCounter(0);
            setRecords([]);
            nextId.current = 1;
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      {/* Render log */}
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">
          Render Log{" "}
          <span className="text-xs font-normal text-gray-400">
            (latest first · last 10 commits)
          </span>
        </p>

        {records.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
            Trigger an action above to see profiling data…
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Phase</th>
                  <th className="px-4 py-2 text-right">Actual Duration</th>
                  <th className="px-4 py-2 text-right">Base Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-400">{rec.id}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${PHASE_STYLE[rec.phase]}`}
                      >
                        {rec.phase}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold text-orange-700">
                      {rec.actualDuration} ms
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-gray-500">
                      {rec.baseDuration} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Duration callout */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="mb-1 text-xs font-semibold text-orange-700">actualDuration</p>
          <p className="text-xs leading-relaxed text-gray-600">
            Real time spent rendering the profiled subtree for this commit.
            Includes only components that actually ran — memoized children that
            were skipped are excluded.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-700">baseDuration</p>
          <p className="text-xs leading-relaxed text-gray-600">
            Estimated cost of a <strong>full</strong> re-render with no
            memoization at all. Compare it with{" "}
            <code className="rounded bg-white px-1 font-mono">actualDuration</code>{" "}
            to measure how much{" "}
            <code className="rounded bg-white px-1 font-mono">memo</code> saves.
          </p>
        </div>
      </div>

      {/* Tip */}
      <p className="text-xs text-gray-400">
        <strong className="text-gray-600">Tip:</strong> notice that{" "}
        <em>Increment Counter</em> still triggers{" "}
        <code className="rounded bg-gray-100 px-1">SlowList</code> on every
        press — the ~4 ms spin appears in every row. Wrap{" "}
        <code className="rounded bg-gray-100 px-1">SlowList</code> in{" "}
        <code className="rounded bg-gray-100 px-1">React.memo</code> (see{" "}
        Example 7) to skip it when{" "}
        <code className="rounded bg-gray-100 px-1">items</code> hasn&apos;t
        changed, and watch{" "}
        <code className="rounded bg-gray-100 px-1">actualDuration</code> drop
        while{" "}
        <code className="rounded bg-gray-100 px-1">baseDuration</code> stays
        the same.
      </p>
    </div>
  );
}
