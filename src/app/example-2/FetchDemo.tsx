"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";

// ── Types ─────────────────────────────────────────────────────────────────────

type User = { id: number; name: string; email: string; phone: string };
type Post = { id: number; title: string; body: string };
type Todo = { id: number; title: string; completed: boolean };

// ── Endpoints ─────────────────────────────────────────────────────────────────

const TABS = {
  Users: "https://jsonplaceholder.typicode.com/users",
  Posts: "https://jsonplaceholder.typicode.com/posts?_limit=6",
  Todos: "https://jsonplaceholder.typicode.com/todos?_limit=6",
} as const;

type Tab = keyof typeof TABS;

// ── Component ─────────────────────────────────────────────────────────────────

export default function FetchDemo() {
  const [tab, setTab] = useState<Tab>("Users");

  const state = useFetch<(User | Post | Todo)[]>(TABS[tab]);

  return (
    <div className="space-y-4">

      {/* Resource selector */}
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(TABS) as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
        {/* Show cache badge once data is loaded a second time */}
        {"cached" in state && state.cached && (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            from cache
          </span>
        )}
      </div>

      {/* Active URL */}
      <div className="rounded-lg bg-gray-100 px-4 py-2">
        <code className="text-xs text-gray-500">GET {TABS[tab]}</code>
      </div>

      {/* Output */}
      {state.status === "loading" && (
        <p className="py-16 text-center text-sm text-gray-400">Fetching…</p>
      )}

      {state.status === "error" && (
        <p className="py-16 text-center text-sm text-red-500">Error: {state.error}</p>
      )}

      {state.status === "success" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(state.data as Record<string, unknown>[]).map(item => (
            <div
              key={item.id as number}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="line-clamp-1 font-medium text-gray-900">
                {(item.name ?? item.title) as string}
              </p>

              {/* Users */}
              {typeof item.email === "string" ? (
                <p className="mt-1 text-xs text-gray-500">{item.email}</p>
              ) : null}
              {typeof item.phone === "string" ? (
                <p className="text-xs text-gray-400">{item.phone}</p>
              ) : null}

              {/* Posts */}
              {typeof item.body === "string" ? (
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.body}</p>
              ) : null}

              {/* Todos */}
              {item.completed !== undefined && (
                <span className={`mt-1 inline-block text-xs font-medium ${
                  item.completed ? "text-emerald-600" : "text-gray-400"
                }`}>
                  {item.completed ? "✓ done" : "pending"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
