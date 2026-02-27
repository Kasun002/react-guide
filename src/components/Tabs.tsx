"use client";

/**
 * Compound Tabs Component
 * Concepts: createContext · useContext · compound pattern · accessibility (ARIA + keyboard)
 */

import { createContext, useContext, useState, useId } from "react";
import type { ReactNode, KeyboardEvent } from "react";

// ── Context ───────────────────────────────────────────────────────────────────
// Shared between Tabs, Tabs.List, Tabs.Tab, Tabs.Panel — no prop drilling needed.

type TabsCtx = {
  active: string;
  setActive: (id: string) => void;
  baseId: string; // unique prefix so aria-controls / aria-labelledby are collision-free
};

const TabsContext = createContext<TabsCtx | null>(null);

// Throws if a sub-component is used outside <Tabs> — gives a clear error message.
function useTabsCtx() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs sub-components must be rendered inside <Tabs>");
  return ctx;
}

// ── Root ──────────────────────────────────────────────────────────────────────

function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  const baseId = useId(); // stable unique ID — avoids id collisions when mounted multiple times

  return (
    <TabsContext.Provider value={{ active, setActive, baseId }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

// ── Tab.List ──────────────────────────────────────────────────────────────────

function List({ children }: { children: ReactNode }) {
  // Keyboard nav: Arrow keys move focus between tabs (ARIA pattern)
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    const idx = tabs.indexOf(document.activeElement as HTMLButtonElement);

    const map: Record<string, number> = {
      ArrowRight: (idx + 1) % tabs.length,
      ArrowLeft:  (idx - 1 + tabs.length) % tabs.length,
      Home:       0,
      End:        tabs.length - 1,
    };

    if (e.key in map) {
      e.preventDefault();
      tabs[map[e.key]]?.focus();
    }
  }

  return (
    <div role="tablist" aria-orientation="horizontal" onKeyDown={handleKeyDown}
      className="flex gap-1 border-b border-gray-200">
      {children}
    </div>
  );
}

// ── Tab.Tab ───────────────────────────────────────────────────────────────────

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive, baseId } = useTabsCtx();
  const isActive = active === id;

  return (
    <button
      role="tab"
      id={`${baseId}-tab-${id}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${id}`}
      // tabIndex: only the active tab is in the natural tab order (roving tabindex)
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActive(id)}
      className={`-mb-px rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
        isActive
          ? "border-b-2 border-sky-600 text-sky-700"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

// ── Tab.Panel ─────────────────────────────────────────────────────────────────

function Panel({ id, children }: { id: string; children: ReactNode }) {
  const { active, baseId } = useTabsCtx();

  // Hidden panels are removed from the DOM (simple); swap with visibility:hidden
  // if you need to preserve sub-component state across tab switches.
  if (active !== id) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${id}`}
      aria-labelledby={`${baseId}-tab-${id}`}
      tabIndex={0}
      className="pt-5 focus:outline-none"
    >
      {children}
    </div>
  );
}

// ── Attach sub-components as static properties ─────────────────────────────────
// This gives the clean compound API:  <Tabs> <Tabs.List> <Tabs.Tab> <Tabs.Panel>

Tabs.List  = List;
Tabs.Tab   = Tab;
Tabs.Panel = Panel;

export { Tabs };
