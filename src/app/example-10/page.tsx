import Link from "next/link";
import type { Metadata } from "next";
import SseDemo from "./SseDemo";

export const metadata: Metadata = { title: "Example 10 · Server-Sent Events" };

const CONCEPTS = [
  "EventSource",
  "useEffect cleanup",
  "useRef (ES handle)",
  "named events",
  "connection state",
  "onerror / auto-reconnect",
];

export default function Example10Page() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-violet-700 px-8 py-10 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-violet-300">Example 10 · 30 min</p>
            <h1 className="text-3xl font-bold">Server-Sent Events</h1>
            <p className="mt-1 text-violet-200">EventSource · useRef · useEffect cleanup · named events</p>
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
          &quot;Build a React component that subscribes to a Server-Sent Event stream,
          displays live log entries colour-coded by level, and cleanly closes the connection
          when the component unmounts. Explain why EventSource auto-reconnects and when you
          would close it explicitly.&quot;
        </p>
      </div>

      {/* Concept tags */}
      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map(tag => (
          <span
            key={tag}
            className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Live demo */}
      <SseDemo />

      {/* SSE vs WebSockets vs Polling callout */}
      <div className="rounded-xl border border-violet-200 bg-violet-50 px-6 py-5 text-sm">
        <p className="mb-3 font-semibold text-violet-800">SSE vs WebSockets vs Polling</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="font-medium text-violet-700">SSE (this example)</p>
            <p className="mt-1 text-xs text-gray-600">
              One-way <strong>server → client</strong> over plain HTTP.
              Built-in auto-reconnect. Simple — just <code className="rounded bg-white px-1">EventSource</code>.
              Perfect for live feeds, log tails, and progress streams.
            </p>
          </div>
          <div>
            <p className="font-medium text-violet-700">WebSockets</p>
            <p className="mt-1 text-xs text-gray-600">
              <strong>Bidirectional</strong> full-duplex channel.
              Higher complexity: custom server, manual reconnect logic.
              Best for chat, collaborative editing, or games.
            </p>
          </div>
          <div>
            <p className="font-medium text-violet-700">Polling (Example 6)</p>
            <p className="mt-1 text-xs text-gray-600">
              Client repeatedly fetches on a timer.
              Simple but wasteful — every tick is a full HTTP round-trip
              even when nothing has changed.
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <Link href="/example-9" className="text-sm text-gray-500 hover:text-gray-900">
          ← Example 9
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-violet-700 px-5 py-2 text-sm font-medium text-white hover:bg-violet-800"
        >
          Home →
        </Link>
      </div>
    </div>
  );
}
