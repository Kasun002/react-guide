"use client";

/**
 * Large Data Table
 * Concepts: useDeferredValue · useMemo · proper keys · loading state
 */

import { useState, useMemo, useDeferredValue, useEffect } from "react";
import { generateUsers, type User } from "@/data/users";
import { sortBy, filterUsers, pageRange, type SortDir, type SortKey } from "./dataTable.utils";

const PAGE_SIZES = [10, 25, 50] as const;

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "id",     label: "ID"     },
  { key: "name",   label: "Name"   },
  { key: "email",  label: "Email"  },
  { key: "role",   label: "Role"   },
  { key: "status", label: "Status" },
  { key: "joined", label: "Joined" },
];

// ──────────────────────────────────────────────────────────────────────────────

export default function DataTable() {
  // Loading state: null = still fetching
  const [rows, setRows] = useState<User[] | null>(null);

  useEffect(() => {
    // Simulate async API fetch — setState inside callback is fine
    const id = setTimeout(() => setRows(generateUsers(500)), 700);
    return () => clearTimeout(id);
  }, []);

  // ── Search ────────────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");

  // useDeferredValue: input renders at high priority; filtering runs at low priority.
  // The input stays snappy even while filtering 500 rows.
  const deferredQuery = useDeferredValue(query);
  const isFiltering   = query !== deferredQuery; // true while React catches up

  // ── Sort ──────────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    setSortDir(key === sortKey && sortDir === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  // ── Pagination ────────────────────────────────────────────────────────────
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);

  // ── Derived data ──────────────────────────────────────────────────────────
  // One useMemo: filter → sort → paginate.
  // Page is clamped here so it self-corrects when filter reduces total pages
  // (no extra useEffect needed to reset page to 1).
  const { pageRows, totalFiltered, totalPages, safePage } = useMemo(() => {
    if (!rows) return { pageRows: [], totalFiltered: 0, totalPages: 0, safePage: 1 };

    const filtered = filterUsers(rows, deferredQuery);

    const sorted   = sortBy(filtered, sortKey, sortDir);
    const pages    = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePg   = Math.min(page, pages);
    const slice    = sorted.slice((safePg - 1) * pageSize, safePg * pageSize);

    return { pageRows: slice, totalFiltered: sorted.length, totalPages: pages, safePage: safePg };
  }, [rows, deferredQuery, sortKey, sortDir, page, pageSize]);

  const rangeFrom = (safePage - 1) * pageSize + 1;
  const rangeTo   = Math.min(safePage * pageSize, totalFiltered);

  // Simple loading state — no skeleton needed for the concept
  if (!rows) return <p className="py-20 text-center text-sm text-gray-400">Loading…</p>;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name, email, role…"
            className="h-9 w-72 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {/* Spinner while deferred value hasn't caught up */}
          {isFiltering && (
            <span className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-500" />
          )}
        </div>
        <span className={`text-sm text-gray-500 transition-opacity ${isFiltering ? "opacity-40" : ""}`}>
          {totalFiltered === rows.length
            ? `${rows.length.toLocaleString()} users`
            : `${totalFiltered.toLocaleString()} of ${rows.length.toLocaleString()} users`}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-900"
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Dim while deferred query is stale */}
          <tbody className={`divide-y divide-gray-100 transition-opacity duration-150 ${isFiltering ? "opacity-40" : ""}`}>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="py-12 text-center text-sm text-gray-400">
                  No results for &quot;{query}&quot;
                </td>
              </tr>
            ) : (
              pageRows.map(row => (
                // key = stable entity ID — never use array index here;
                // index breaks diffing when rows reorder on sort / filter.
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{row.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600">{row.email}</td>
                  <td className="px-4 py-3 text-gray-600">{row.role}</td>
                  <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                  <td className="px-4 py-3 text-gray-600">{row.joined}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          Rows per page
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value) as typeof pageSize); setPage(1); }}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-2 text-sm text-gray-500">{rangeFrom}–{rangeTo} of {totalFiltered.toLocaleString()}</span>
          <PageBtn onClick={() => setPage(1)}                              disabled={safePage === 1}           label="«" />
          <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))}       disabled={safePage === 1}           label="‹" />
          {pageRange(safePage, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`e${i}`} className="px-2 text-sm text-gray-400">…</span>
            ) : (
              <PageBtn key={p} onClick={() => setPage(p)} active={p === safePage} label={String(p)} />
            ),
          )}
          <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} label="›" />
          <PageBtn onClick={() => setPage(totalPages)}                        disabled={safePage === totalPages} label="»" />
        </div>
      </div>
    </div>
  );
}

// ── Tiny helpers ──────────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg className={`h-3 w-3 ${active ? "text-indigo-600" : "text-gray-300"}`} viewBox="0 0 8 12" fill="currentColor">
      <path d="M4 0 L7.5 5 L0.5 5 Z"  opacity={active && dir === "asc"  ? 1 : 0.35} />
      <path d="M4 12 L0.5 7 L7.5 7 Z" opacity={active && dir === "desc" ? 1 : 0.35} />
    </svg>
  );
}

function StatusBadge({ status }: { status: User["status"] }) {
  const on = status === "active";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${on ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-emerald-500" : "bg-gray-400"}`} />
      {status}
    </span>
  );
}

function PageBtn({ onClick, disabled, active, label }: {
  onClick: () => void; disabled?: boolean; active?: boolean; label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors
        ${active ? "bg-indigo-600 text-white" : disabled ? "cursor-not-allowed text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
    >
      {label}
    </button>
  );
}
