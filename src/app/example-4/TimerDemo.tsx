"use client";

/**
 * Countdown Timer + Typewriter
 * Concepts: useRef · useEffect cleanup · stale closures · functional updates
 */

import { useState, useEffect, useRef } from "react";

// ── Countdown Timer ────────────────────────────────────────────────────────────

const INITIAL = 60;

function CountdownTimer() {
  const [seconds, setSeconds] = useState(INITIAL);
  const [running, setRunning] = useState(false);

  // useRef stores the interval ID without triggering a re-render.
  // A plain variable would be lost between renders; state would cause extra renders.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      // Functional update — reads the latest queued value of `s`,
      // NOT the `seconds` captured when this effect ran.
      // Bug without it: setSeconds(seconds - 1) always decrements from the
      // initial value because `seconds` is stale inside the closure.
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    // Cleanup runs when `running` flips to false OR the component unmounts —
    // prevents the interval from leaking and ticking in the background.
    return () => clearInterval(intervalRef.current!);
  }, [running]); // re-runs only when pause/resume is toggled

  const reset = () => {
    setRunning(false);
    setSeconds(INITIAL);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = (seconds / INITIAL) * 100;

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        Countdown Timer
      </h3>

      {/* Clock display */}
      <span className={`text-6xl font-bold tabular-nums transition-colors ${seconds === 0 ? "text-red-500" : "text-gray-900"}`}>
        {mm}:{ss}
      </span>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setRunning(r => !r)}
          disabled={seconds === 0}
          className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {running ? "Pause" : seconds === 0 ? "Done" : "Start"}
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// ── Typewriter ─────────────────────────────────────────────────────────────────

const STRINGS = [
  "Clean code is its own best documentation.",
  "Make it work, make it right, make it fast.",
  "Simplicity is the soul of efficiency.",
];

function Typewriter() {
  const [display, setDisplay] = useState("");
  const [msgIdx, setMsgIdx]   = useState(0);

  // useRef for the character index: it needs to persist across re-renders but
  // incrementing it should NOT cause a re-render (unlike useState).
  const charIdx = useRef(0);

  useEffect(() => {
    const target = STRINGS[msgIdx];
    charIdx.current = 0;
    setDisplay("");

    // Typing interval
    const intervalId = setInterval(() => {
      if (charIdx.current < target.length) {
        // Derive text from the ref — avoids reading stale `display` state.
        // If we wrote: setDisplay(display + char), `display` would be ""
        // forever (captured at effect-run time) — classic stale closure bug.
        setDisplay(target.slice(0, charIdx.current + 1));
        charIdx.current++;
      } else {
        clearInterval(intervalId);
        // Pause, then advance to the next string
        timeoutId = setTimeout(
          () => setMsgIdx(i => (i + 1) % STRINGS.length),
          2000,
        );
      }
    }, 55);

    // Store timeout id so cleanup can cancel the pause as well
    let timeoutId: ReturnType<typeof setTimeout>;

    // Cleanup: cancel both timers when msgIdx changes or component unmounts
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [msgIdx]);

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        Typewriter
      </h3>

      {/* Text + blinking cursor */}
      <div className="min-h-20">
        <p className="text-xl font-medium leading-relaxed text-gray-800">
          {display}
          <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-emerald-500 align-middle" />
        </p>
      </div>

      {/* Dot progress */}
      <div className="flex gap-1.5">
        {STRINGS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${i === msgIdx ? "bg-emerald-500" : "bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function TimerDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <CountdownTimer />
      <Typewriter />
    </div>
  );
}
