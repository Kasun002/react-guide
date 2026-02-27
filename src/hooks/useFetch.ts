import { useEffect, useReducer, useRef } from "react";

// Module-level cache — persists across mounts, shared between all useFetch calls
const cache = new Map<string, unknown>();

// ── State shape ───────────────────────────────────────────────────────────────

type State<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T; cached: boolean }
  | { status: "error"; error: string };

type Action<T> =
  | { type: "FETCH" }
  | { type: "OK"; data: T; cached: boolean }
  | { type: "ERR"; error: string };

// ── useReducer centralizes all state transitions in one place ─────────────────
// No scattered setLoading / setData / setError calls that can get out of sync.

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "FETCH": return { status: "loading" };
    case "OK":    return { status: "success", data: action.data, cached: action.cached };
    case "ERR":   return { status: "error",   error: action.error };
    default:      return state;
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFetch<T = unknown>(url: string) {
  const [state, dispatch] = useReducer(
    (s: State<T>, a: Action<T>) => reducer(s, a),
    { status: "idle" },
  );

  // Track whether the component is still mounted.
  // Using a ref (not state) so it doesn't trigger extra renders.
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    // Cache hit — skip the network, serve instantly
    if (cache.has(url)) {
      dispatch({ type: "OK", data: cache.get(url) as T, cached: true });
      return;
    }

    // Each effect run gets its own controller.
    // When the url changes or the component unmounts, cleanup aborts it.
    const controller = new AbortController();
    dispatch({ type: "FETCH" });

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then(data => {
        cache.set(url, data); // populate cache for future requests
        // Guard: don't dispatch if the component already unmounted
        if (mounted.current) dispatch({ type: "OK", data, cached: false });
      })
      .catch(err => {
        // AbortError means we cancelled intentionally — not a real error
        if (err.name !== "AbortError" && mounted.current) {
          dispatch({ type: "ERR", error: err.message });
        }
      });

    // ↑ This cleanup runs on:
    //   • url change  → aborts the stale request, preventing a race condition
    //     (old response can never dispatch after new request starts)
    //   • unmount     → aborts in-flight request, preventing setState-after-unmount
    return () => controller.abort();
  }, [url]);

  return state;
}
