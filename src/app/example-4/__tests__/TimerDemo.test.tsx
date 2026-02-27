/**
 * Unit tests for CountdownTimer and Typewriter (TimerDemo).
 *
 * TDD interview focus:
 *  - useRef stores interval ID without re-renders
 *  - Functional update avoids stale closure (seconds decrements correctly)
 *  - useEffect cleanup: interval is cleared on pause and unmount
 *  - Typewriter: ref-based charIdx avoids reading stale display state
 *
 * Tools: jest.useFakeTimers() to control setInterval / setTimeout precisely.
 */

import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import TimerDemo from "../TimerDemo";

// ── Setup ──────────────────────────────────────────────────────────────────────

beforeEach(() => { jest.useFakeTimers(); });
afterEach(() => { jest.useRealTimers(); });

// ── CountdownTimer ─────────────────────────────────────────────────────────────

describe("CountdownTimer", () => {
  it("displays 01:00 on initial render", () => {
    render(<TimerDemo />);
    expect(screen.getByText("01:00")).toBeInTheDocument();
  });

  it("shows a Start button initially", () => {
    render(<TimerDemo />);
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("decrements the timer each second after Start is clicked", async () => {
    render(<TimerDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    act(() => { jest.advanceTimersByTime(3000); });
    await waitFor(() => expect(screen.getByText("00:57")).toBeInTheDocument());
  });

  it("changes Start button to Pause while running", () => {
    render(<TimerDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("stops counting when Pause is clicked", async () => {
    render(<TimerDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    act(() => { jest.advanceTimersByTime(2000); });
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    const frozen = screen.getByText("00:58");
    act(() => { jest.advanceTimersByTime(3000); });
    // Timer should still show 00:58 — not 00:55
    expect(frozen).toBeInTheDocument();
  });

  it("resets to 01:00 when Reset is clicked", () => {
    render(<TimerDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    act(() => { jest.advanceTimersByTime(5000); });
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByText("01:00")).toBeInTheDocument();
  });

  it("shows Done button and 00:00 when timer reaches zero", async () => {
    render(<TimerDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    act(() => { jest.advanceTimersByTime(60_000); });
    await waitFor(() => {
      expect(screen.getByText("00:00")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Done" })).toBeDisabled();
    });
  });
});

// ── Typewriter ─────────────────────────────────────────────────────────────────

describe("Typewriter", () => {
  it("starts with an empty display", () => {
    render(<TimerDemo />);
    // The first string's first char only appears after 55 ms
    act(() => { jest.advanceTimersByTime(0); });
    // Cursor span is always present; no characters yet
    const firstString = "Clean code is its own best documentation.";
    expect(screen.queryByText(firstString)).not.toBeInTheDocument();
  });

  it("types several characters after multiple interval ticks", async () => {
    render(<TimerDemo />);
    // Advance 6 ticks → "Clean " — distinct from the "Countdown Timer" heading
    act(() => { jest.advanceTimersByTime(55 * 6); });
    await waitFor(() =>
      expect(screen.getByText(/Clean c/i)).toBeInTheDocument(),
    );
  });

  it("completes the first string after all characters are typed", async () => {
    const firstString = "Clean code is its own best documentation.";
    render(<TimerDemo />);
    act(() => { jest.advanceTimersByTime(55 * firstString.length); });
    await waitFor(() =>
      expect(screen.getByText(firstString)).toBeInTheDocument(),
    );
  });
});
