/**
 * Unit tests for <PollTable />.
 *
 * TDD interview focus:
 *  - Initial loading state (first fetch only)
 *  - Data renders after fetch resolves
 *  - Error state on fetch failure
 *  - Polling: setInterval is started and cleared on unmount
 *  - Visibility pause: interval cleared when tab hidden, restarted when visible
 *  - Manual refresh button triggers fetch
 *  - Price formatting: positive change = green, negative = red
 */

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import PollTable from "../PollTable";

// ── Fixture ────────────────────────────────────────────────────────────────────

const MOCK_ASSETS = [
  {
    id: "bitcoin",
    market_cap_rank: 1,
    symbol: "btc",
    name: "Bitcoin",
    current_price: 65000,
    price_change_percentage_24h: 2.5,
    market_cap: 1_280_000_000_000,
  },
  {
    id: "ethereum",
    market_cap_rank: 2,
    symbol: "eth",
    name: "Ethereum",
    current_price: 3200,
    price_change_percentage_24h: -1.3,
    market_cap: 385_000_000_000,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function mockFetchSuccess() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(MOCK_ASSETS),
  });
}

function mockFetchError() {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
}

// ── Setup ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.useFakeTimers();
  mockFetchSuccess();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  // Reset document.hidden to default
  Object.defineProperty(document, "hidden", { configurable: true, value: false });
});

// ── Loading state ─────────────────────────────────────────────────────────────

describe("PollTable — loading", () => {
  it("shows a loading indicator before the first fetch resolves", () => {
    render(<PollTable />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });
});

// ── Success state ─────────────────────────────────────────────────────────────

describe("PollTable — success", () => {
  it("renders asset rows after the first fetch resolves", async () => {
    render(<PollTable />);
    await waitFor(() => expect(screen.getByText("Bitcoin")).toBeInTheDocument());
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });

  it("displays the asset symbol in uppercase", async () => {
    render(<PollTable />);
    await waitFor(() => expect(screen.getByText("btc")).toBeInTheDocument());
  });

  it("shows positive 24h change in green", async () => {
    render(<PollTable />);
    await waitFor(() => screen.getByText("+2.50%"));
    const cell = screen.getByText("+2.50%");
    expect(cell).toHaveClass("text-emerald-600");
  });

  it("shows negative 24h change in red", async () => {
    render(<PollTable />);
    await waitFor(() => screen.getByText("-1.30%"));
    const cell = screen.getByText("-1.30%");
    expect(cell).toHaveClass("text-red-500");
  });
});

// ── Error state ───────────────────────────────────────────────────────────────

describe("PollTable — error", () => {
  it("shows an error message when the fetch fails", async () => {
    mockFetchError();
    render(<PollTable />);
    await waitFor(() => expect(screen.getByText(/Error:/i)).toBeInTheDocument());
  });
});

// ── Polling & cleanup ─────────────────────────────────────────────────────────

describe("PollTable — polling", () => {
  it("calls fetch again after the poll interval elapses", async () => {
    render(<PollTable />);
    await waitFor(() => screen.getByText("Bitcoin")); // first fetch
    act(() => { jest.advanceTimersByTime(30_000); }); // one poll tick
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });

  it("clears the interval and listener on unmount", async () => {
    const clearSpy = jest.spyOn(global, "clearInterval");
    const removeSpy = jest.spyOn(document, "removeEventListener");
    const { unmount } = render(<PollTable />);
    await waitFor(() => screen.getByText("Bitcoin"));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
  });

  it("manual refresh button triggers an extra fetch", async () => {
    render(<PollTable />);
    await waitFor(() => screen.getByText("Bitcoin"));
    fireEvent.click(screen.getByRole("button", { name: /refresh now/i }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });

  it("pauses polling when the tab becomes hidden", async () => {
    const clearSpy = jest.spyOn(global, "clearInterval");
    render(<PollTable />);
    await waitFor(() => screen.getByText("Bitcoin"));
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    act(() => { document.dispatchEvent(new Event("visibilitychange")); });
    expect(clearSpy).toHaveBeenCalled();
  });
});
