/**
 * Unit tests for useFetch hook.
 *
 * TDD interview focus:
 *  - loading → success state transition
 *  - error on network failure and non-ok HTTP status
 *  - module-level cache: cached: false first call, cached: true second call
 *  - AbortController: abort on unmount (prevents setState-after-unmount)
 *  - AbortController: abort on URL change (prevents race conditions)
 *
 * Tools: renderHook (RTL) · jest.fn() for global.fetch · AbortController spy
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useFetch, _testCache } from "../useFetch";

// ── Helpers ───────────────────────────────────────────────────────────────────

const USERS = [{ id: 1, name: "Alice", email: "alice@test.com" }];

/** Returns a mock fetch that resolves with the given payload. */
function mockSuccess(payload: unknown) {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(payload),
  });
}

/** Returns a mock fetch that resolves with a non-ok HTTP response. */
function mockHttpError(status: number) {
  return jest.fn().mockResolvedValue({ ok: false, status });
}

/** Returns a mock fetch that rejects with a network error. */
function mockNetworkError(message = "Network error") {
  return jest.fn().mockRejectedValue(new Error(message));
}

// ── Setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  _testCache.clear();           // each test starts with an empty cache
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ── Loading state ─────────────────────────────────────────────────────────────

describe("useFetch — loading", () => {
  it("dispatches loading state immediately when fetch starts", () => {
    global.fetch = mockSuccess(USERS);
    const { result } = renderHook(() => useFetch("/api/users"));

    // Synchronous check — before any microtask resolves
    expect(result.current.status).toBe("loading");
  });
});

// ── Success ───────────────────────────────────────────────────────────────────

describe("useFetch — success", () => {
  it("transitions to success state with fetched data", async () => {
    global.fetch = mockSuccess(USERS);
    const { result } = renderHook(() => useFetch<typeof USERS>("/api/users"));

    await waitFor(() => expect(result.current.status).toBe("success"));

    if (result.current.status === "success") {
      expect(result.current.data).toEqual(USERS);
      // First fetch is NOT from cache
      expect(result.current.cached).toBe(false);
    }
  });

  it("calls fetch with the provided URL", async () => {
    global.fetch = mockSuccess(USERS);
    renderHook(() => useFetch("/api/users"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/users",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});

// ── Error states ──────────────────────────────────────────────────────────────

describe("useFetch — errors", () => {
  it("transitions to error state on network failure", async () => {
    global.fetch = mockNetworkError("Failed to fetch");
    const { result } = renderHook(() => useFetch("/api/users"));

    await waitFor(() => expect(result.current.status).toBe("error"));

    if (result.current.status === "error") {
      expect(result.current.error).toBe("Failed to fetch");
    }
  });

  it("transitions to error state when response status is not ok", async () => {
    global.fetch = mockHttpError(404);
    const { result } = renderHook(() => useFetch("/api/users"));

    await waitFor(() => expect(result.current.status).toBe("error"));

    if (result.current.status === "error") {
      expect(result.current.error).toContain("404");
    }
  });
});

// ── Caching ───────────────────────────────────────────────────────────────────

describe("useFetch — cache", () => {
  it("serves data from cache and marks cached: true on second mount", async () => {
    global.fetch = mockSuccess(USERS);
    const URL = "/api/users-cache";

    // First mount — populates cache
    const { unmount } = renderHook(() => useFetch(URL));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    unmount();

    // Second mount — should hit cache, NOT call fetch again
    const { result } = renderHook(() => useFetch<typeof USERS>(URL));

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(global.fetch).toHaveBeenCalledTimes(1); // no extra fetch call

    if (result.current.status === "success") {
      expect(result.current.cached).toBe(true);
      expect(result.current.data).toEqual(USERS);
    }
  });
});

// ── AbortController ───────────────────────────────────────────────────────────

describe("useFetch — abort", () => {
  it("aborts the in-flight request when the component unmounts", () => {
    global.fetch = mockSuccess(USERS);
    const abortSpy = jest.spyOn(AbortController.prototype, "abort");

    const { unmount } = renderHook(() => useFetch("/api/users"));
    unmount();

    // useEffect cleanup runs on unmount → calls controller.abort()
    expect(abortSpy).toHaveBeenCalled();
  });

  it("aborts the stale request when the URL changes", async () => {
    global.fetch = mockSuccess(USERS);
    const abortSpy = jest.spyOn(AbortController.prototype, "abort");

    const { rerender } = renderHook(
      ({ url }: { url: string }) => useFetch(url),
      { initialProps: { url: "/api/users" } },
    );

    // Changing URL triggers cleanup of the previous effect → abort
    rerender({ url: "/api/posts" });

    expect(abortSpy).toHaveBeenCalled();
  });
});
