"use client";

/**
 * SSE Demo — Live Server Log Stream
 *
 * Concepts:
 *  - EventSource   : browser API for one-way server→client streams over HTTP
 *  - useRef        : holds the EventSource instance without causing re-renders
 *  - useEffect     : cleanup closes the connection on unmount (no orphan sockets)
 *  - named events  : addEventListener("log", …) vs the default "message" event
 *  - connection FSM: idle → connecting → connected → closed / error
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Level  = "INFO" | "WARN" | "ERROR";
type Status = "idle" | "connecting" | "connected" | "closed" | "error";

type LogEntry = {
  id:    number;
  level: Level;
  msg:   string;
  time:  number;
};

// ── Style maps ─────────────────────────────────────────────────────────────────

const LEVEL_STYLE: Record<Level, string> = {
  INFO:  "text-sky-300",
  WARN:  "text-amber-300",
  ERROR: "text-red-400",
};

const LEVEL_BADGE: Record<Level, string> = {
  INFO:  "bg-sky-900/60  text-sky-300",
  WARN:  "bg-amber-900/60 text-amber-300",
  ERROR: "bg-red-900/60  text-red-400",
};

const STATUS_DOT: Record<Status, string> = {
  idle:       "bg-gray-400",
  connecting: "bg-amber-400 animate-pulse",
  connected:  "bg-emerald-400 animate-pulse",
  closed:     "bg-gray-400",
  error:      "bg-red-500",
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function SseDemo() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [status,  setStatus]  = useState<Status>("idle");

  // useRef stores the EventSource handle.
  // A plain variable resets each render; state would cause unnecessary re-renders.
  const esRef  = useRef<EventSource | null>(null);
  const idRef  = useRef(0);            // monotonic entry id — no re-render needed
  const logRef = useRef<HTMLDivElement>(null); // scroll container

  // Auto-scroll to bottom whenever new entries arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [entries]);

  // ── Connect ─────────────────────────────────────────────────────────────────

  const connect = useCallback(() => {
    // Tear down any existing connection before opening a new one
    esRef.current?.close();
    setEntries([]);
    setStatus("connecting");

    const es = new EventSource("/api/sse");
    esRef.current = es;

    // Named event fired once by the server when the stream is ready
    es.addEventListener("connected", () => {
      setStatus("connected");
    });

    // Named event fired periodically by the server
    es.addEventListener("log", (e: MessageEvent) => {
      const payload = JSON.parse(e.data) as { level: Level; msg: string; time: number };
      setEntries(prev => [...prev, { id: ++idRef.current, ...payload }]);
    });

    // onerror fires when the connection drops or the server closes the stream.
    // EventSource auto-reconnects by default — we close explicitly so the UI
    // reflects reality rather than silently reconnecting in the background.
    es.onerror = () => {
      setStatus("error");
      es.close();
      esRef.current = null;
    };
  }, []);

  // ── Disconnect ──────────────────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
    setStatus("closed");
  }, []);

  // ── Cleanup on unmount ──────────────────────────────────────────────────────

  // Without this, navigating away leaves an open EventSource — the server
  // keeps streaming and the browser keeps buffering until the tab closes.
  useEffect(() => {
    return () => {
      esRef.current?.close();
    };
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} />
          <span className="text-sm font-medium capitalize text-gray-700">{status}</span>
          {status === "connected" && entries.length > 0 && (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
              {entries.length} event{entries.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={connect}
            disabled={status === "connecting" || status === "connected"}
            className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Connect
          </button>
          <button
            onClick={disconnect}
            disabled={status !== "connected"}
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Terminal-style log panel */}
      <div
        ref={logRef}
        className="h-72 overflow-y-auto rounded-xl border border-gray-800 bg-gray-950 p-4 font-mono text-xs leading-relaxed shadow-inner"
      >
        {status === "idle" && (
          <p className="text-gray-500">
            Press <strong className="text-gray-300">Connect</strong> to open the SSE stream…
          </p>
        )}
        {status === "connecting" && (
          <p className="text-amber-400">Connecting to /api/sse …</p>
        )}
        {status === "connected" && entries.length === 0 && (
          <p className="text-gray-500">Waiting for first event…</p>
        )}

        {entries.map(entry => (
          <div key={entry.id} className="mb-1 flex items-start gap-3">
            <span className="shrink-0 text-gray-500">
              {new Date(entry.time).toLocaleTimeString()}
            </span>
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold leading-tight ${LEVEL_BADGE[entry.level]}`}>
              {entry.level}
            </span>
            <span className={LEVEL_STYLE[entry.level]}>{entry.msg}</span>
          </div>
        ))}

        {status === "closed" && (
          <p className="mt-2 text-gray-500">— stream closed —</p>
        )}
        {status === "error" && (
          <p className="mt-2 text-red-400">— stream error · connection dropped —</p>
        )}
      </div>

      {/* Concept nudge */}
      <p className="text-xs text-gray-400">
        <strong className="text-gray-600">EventSource</strong> auto-reconnects on drop — always call{" "}
        <code className="rounded bg-gray-100 px-1">.close()</code> in the{" "}
        <code className="rounded bg-gray-100 px-1">useEffect</code> cleanup to prevent orphaned connections.
      </p>
    </div>
  );
}
