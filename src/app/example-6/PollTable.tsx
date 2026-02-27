"use client";

/**
 * Data Polling — Live Crypto Prices
 * Concepts: setInterval polling · useRef · useCallback · visibility pause · cleanup
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Asset = {
  id: string;
  market_cap_rank: number;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
};

// ── Config ─────────────────────────────────────────────────────────────────────

// CoinGecko — free, no API key, CORS-enabled
const ENDPOINT =
  "https://api.coingecko.com/api/v3/coins/markets" +
  "?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

const POLL_MS = 30_000; // 30 s — respects CoinGecko free-tier rate limit

// ── Component ─────────────────────────────────────────────────────────────────

export default function PollTable() {
  const [assets, setAssets]       = useState<Asset[]>([]);
  const [loading, setLoading]     = useState(true);  // true only on first load
  const [error, setError]         = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  // useRef: stores interval ID without triggering re-renders
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stable fetch function — used as both the poll callback and manual refresh.
  // useCallback with [] because it only closes over stable setter functions.
  const fetchData = useCallback(async () => {
    try {
      const res  = await fetch(ENDPOINT);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as Asset[]; // CoinGecko returns an array directly
      setAssets(json);
      setUpdatedAt(new Date());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false); // only clears the initial spinner; subsequent polls are silent
    }
  }, []);

  useEffect(() => {
    // Best practice 1: fetch immediately — don't wait for the first tick
    fetchData();

    // Best practice 2: start the polling interval
    timerRef.current = setInterval(fetchData, POLL_MS);

    // Best practice 3: pause when tab is hidden — saves API quota & battery
    function onVisibility() {
      if (document.hidden) {
        clearInterval(timerRef.current!);                    // tab hidden → stop
      } else {
        fetchData();                                         // tab visible → refresh now
        timerRef.current = setInterval(fetchData, POLL_MS); // restart interval
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    // Best practice 4: cleanup on unmount — no leaked timers or listeners
    return () => {
      clearInterval(timerRef.current!);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchData]); // fetchData is stable → effect runs exactly once

  // ── Formatters ───────────────────────────────────────────────────────────────

  const fmtPrice = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

  const fmtCap = (n: number) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
    return               `$${(n / 1e6).toFixed(2)}M`;
  };

  // ── Early returns ─────────────────────────────────────────────────────────────

  if (loading) return <p className="py-16 text-center text-sm text-gray-400">Loading…</p>;
  if (error)   return <p className="py-16 text-center text-sm text-red-500">Error: {error}</p>;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Pulsing live dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
          </span>
          <span className="text-xs text-gray-500">
            Live · every {POLL_MS / 1000}s
            {updatedAt && ` · updated ${updatedAt.toLocaleTimeString()}`}
          </span>
        </div>
        <button
          onClick={fetchData}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          ↺ Refresh now
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {["#", "Asset", "Price", "24h Change", "Market Cap"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assets.map(asset => (
              // key = stable entity id — never array index
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{asset.market_cap_rank}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-semibold uppercase text-gray-600">
                      {asset.symbol}
                    </span>
                    <span className="font-medium text-gray-900">{asset.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {fmtPrice(asset.current_price)}
                </td>
                <td className={`px-4 py-3 font-medium ${asset.price_change_percentage_24h >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {fmtPct(asset.price_change_percentage_24h)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {fmtCap(asset.market_cap)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        Polling pauses automatically when this tab is not visible · resumes on focus.
      </p>
    </div>
  );
}
