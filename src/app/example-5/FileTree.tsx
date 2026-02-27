"use client";

/**
 * Recursive File Tree
 * Concepts: clean recursion · per-node local state · React.memo · stable keys
 */

import { useState, memo } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type FileNode = {
  id: string;        // path-based ID — stable React key, never array index
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};

// ── Mock data ─────────────────────────────────────────────────────────────────

const TREE: FileNode = {
  id: "root",
  name: "my-project",
  type: "folder",
  children: [
    {
      id: "src",
      name: "src",
      type: "folder",
      children: [
        {
          id: "src/components",
          name: "components",
          type: "folder",
          children: [
            { id: "src/components/Button.tsx",  name: "Button.tsx",  type: "file" },
            { id: "src/components/Modal.tsx",   name: "Modal.tsx",   type: "file" },
            { id: "src/components/Tabs.tsx",    name: "Tabs.tsx",    type: "file" },
          ],
        },
        {
          id: "src/hooks",
          name: "hooks",
          type: "folder",
          children: [
            { id: "src/hooks/useFetch.ts",  name: "useFetch.ts",  type: "file" },
            { id: "src/hooks/useDebounce.ts", name: "useDebounce.ts", type: "file" },
          ],
        },
        {
          id: "src/pages",
          name: "pages",
          type: "folder",
          children: [
            { id: "src/pages/Home.tsx",    name: "Home.tsx",    type: "file" },
            { id: "src/pages/Settings.tsx", name: "Settings.tsx", type: "file" },
          ],
        },
        { id: "src/App.tsx",   name: "App.tsx",   type: "file" },
        { id: "src/index.tsx", name: "index.tsx", type: "file" },
      ],
    },
    {
      id: "public",
      name: "public",
      type: "folder",
      children: [
        { id: "public/index.html",   name: "index.html",   type: "file" },
        { id: "public/favicon.ico",  name: "favicon.ico",  type: "file" },
      ],
    },
    { id: "package.json",  name: "package.json",  type: "file" },
    { id: "tsconfig.json", name: "tsconfig.json", type: "file" },
    { id: "README.md",     name: "README.md",     type: "file" },
  ],
};

// ── TreeNode ───────────────────────────────────────────────────────────────────

// React.memo: skips re-render if props haven't changed.
// Without it, toggling any folder re-renders every node in the whole tree.
// With it, only the toggled node + its subtree re-render.
const TreeNode = memo(function TreeNode({
  node,
  depth = 0,
}: {
  node: FileNode;
  depth?: number;
}) {
  // Per-node state: each folder owns its open/closed state independently.
  // No parent needs to hold or pass it — zero prop drilling.
  const [open, setOpen] = useState(depth === 0);

  const isFolder = node.type === "folder";

  return (
    <div>
      <button
        onClick={() => isFolder && setOpen(o => !o)}
        // Dynamic indent: driven by depth so nesting is always consistent
        style={{ paddingLeft: `${depth * 1.25}rem` }}
        className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors
          ${isFolder
            ? "cursor-pointer hover:bg-amber-50 active:bg-amber-100"
            : "cursor-default text-gray-600"}`}
      >
        {/* Chevron — rotates 90° when open */}
        {isFolder ? (
          <svg
            className={`h-3 w-3 shrink-0 text-gray-400 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
            viewBox="0 0 12 12" fill="currentColor"
          >
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        ) : (
          <span className="h-3 w-3 shrink-0" /> // spacer aligns files with folders
        )}

        {/* Icon */}
        {isFolder ? <FolderIcon open={open} /> : <FileIcon name={node.name} />}

        {/* Name */}
        <span className={isFolder ? "font-medium text-gray-800" : ""}>
          {node.name}
        </span>
      </button>

      {/* Recursion — children only mount when the folder is open.
          key = child.id (path-based string), never the array index.
          Using index as key breaks React's reconciliation on reorder/filter. */}
      {isFolder && open && (
        <div>
          {node.children?.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
});

// ── Icons ─────────────────────────────────────────────────────────────────────

function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg className={`h-4 w-4 shrink-0 ${open ? "text-amber-400" : "text-amber-300"}`}
      viewBox="0 0 20 20" fill="currentColor">
      {open
        ? <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        : <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v1H2V6zm0 3v5a2 2 0 002 2h12a2 2 0 002-2V9H2z" clipRule="evenodd" />
      }
    </svg>
  );
}

// Colour-coded by extension — a common interview bonus detail
const EXT_COLOR: Record<string, string> = {
  tsx: "text-blue-400",
  ts:  "text-blue-500",
  js:  "text-yellow-400",
  jsx: "text-yellow-400",
  json:"text-amber-400",
  md:  "text-gray-400",
  html:"text-orange-400",
  ico: "text-purple-400",
  css: "text-pink-400",
};

function FileIcon({ name }: { name: string }) {
  const ext  = name.split(".").pop() ?? "";
  const color = EXT_COLOR[ext] ?? "text-gray-400";
  return (
    <svg className={`h-4 w-4 shrink-0 ${color}`} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
        clipRule="evenodd" />
    </svg>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function FileTree() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-3 border-b border-gray-100 pb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Explorer
      </p>
      <TreeNode node={TREE} />
    </div>
  );
}
