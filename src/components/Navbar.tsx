"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { navItems } from "@/config/nav";

// Approximate width (px) reserved for the "More ▾" button
const MORE_BTN_WIDTH = 92;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(navItems.length - 1);

  const containerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const tabs = navItems.slice(1); // everything except "Home"

  // Measure how many tabs fit in the available horizontal space
  const computeVisible = useCallback(() => {
    if (!containerRef.current || !rulerRef.current) return;
    const available = containerRef.current.clientWidth;
    const children = Array.from(rulerRef.current.children) as HTMLElement[];

    let used = 0;
    let count = 0;
    for (let i = 0; i < children.length; i++) {
      const itemWidth = children[i].offsetWidth + 4; // 4px = gap-1
      const isLast = i === children.length - 1;
      const projected = used + itemWidth + (isLast ? 0 : MORE_BTN_WIDTH);
      if (projected > available) break;
      used += itemWidth;
      count++;
    }
    setVisibleCount(count);
  }, []);

  // ResizeObserver fires immediately on observe(), so no manual initial call needed
  useEffect(() => {
    const ro = new ResizeObserver(computeVisible);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [computeVisible]);

  // Close "More" dropdown on outside click
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  const visibleItems = tabs.slice(0, visibleCount);
  const overflowItems = tabs.slice(visibleCount);
  const overflowIsActive = overflowItems.some((i) => i.href === pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">

        {/* Brand — never shrinks */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <span className="text-sm font-bold text-white">U</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">Interview Guide</span>
        </Link>

        {/* ── Desktop nav ── */}
        <div ref={containerRef} className="relative hidden min-w-0 flex-1 md:block">

          {/* Invisible ruler: renders every item to measure real widths */}
          <div
            ref={rulerRef}
            aria-hidden
            className="invisible absolute flex items-center gap-1 whitespace-nowrap"
          >
            {tabs.map((item) => (
              <span key={item.href} className="rounded-md px-4 py-2 text-sm font-medium">
                {item.label}
              </span>
            ))}
          </div>

          {/* Visible tabs */}
          <nav className="flex items-center gap-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* "More" dropdown for overflow items */}
            {overflowItems.length > 0 && (
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen((o) => !o)}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    overflowIsActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  More
                  <svg
                    className={`h-3.5 w-3.5 transition-transform duration-150 ${moreOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {moreOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 min-w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {overflowItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="ml-auto flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile menu panel ── */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {tabs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
