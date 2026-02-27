/**
 * Unit tests for <SseDemo />.
 *
 * TDD interview focus:
 *  - EventSource is constructed when Connect is clicked
 *  - Named "connected" event → status changes to "connected"
 *  - Named "log" event → entry appended to the log panel
 *  - onerror → status set to "error", EventSource closed
 *  - useEffect cleanup: EventSource.close() called on unmount
 *  - Disconnect button: calls close(), status → "closed"
 *  - Button disabled states follow the connection state machine
 *
 * EventSource is not available in jsdom — we replace it with a lightweight
 * mock that exposes emit() so tests can trigger named events synchronously.
 */

import { render, screen, fireEvent, act } from "@testing-library/react";
import SseDemo from "../SseDemo";

// ── Mock EventSource ───────────────────────────────────────────────────────────

class MockEventSource {
  static instances: MockEventSource[] = [];

  url: string;
  onerror: ((e: Event) => void) | null = null;
  closed = false;

  private listeners: Record<string, ((e: MessageEvent) => void)[]> = {};

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }

  addEventListener(type: string, fn: (e: MessageEvent) => void) {
    (this.listeners[type] ??= []).push(fn);
  }

  /** Simulate a named event arriving from the server */
  emit(type: string, data: unknown = {}) {
    const event = new MessageEvent(type, { data: JSON.stringify(data) });
    (this.listeners[type] ?? []).forEach(fn => fn(event));
  }

  /** Simulate a connection error */
  triggerError() {
    this.onerror?.(new Event("error"));
  }

  close() {
    this.closed = true;
  }
}

// ── Setup ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  MockEventSource.instances = [];
  // @ts-expect-error — replace global EventSource with the test double
  global.EventSource = MockEventSource;
});

function getES() {
  return MockEventSource.instances.at(-1)!;
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("SseDemo — initial state", () => {
  it("renders 'idle' status on mount", () => {
    render(<SseDemo />);
    expect(screen.getByText("idle")).toBeInTheDocument();
  });

  it("Connect button is enabled and Disconnect is disabled initially", () => {
    render(<SseDemo />);
    expect(screen.getByRole("button", { name: "Connect" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Disconnect" })).toBeDisabled();
  });
});

describe("SseDemo — connecting", () => {
  it("creates an EventSource for /api/sse when Connect is clicked", () => {
    render(<SseDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(MockEventSource.instances).toHaveLength(1);
    expect(getES().url).toBe("/api/sse");
  });

  it("shows 'connecting' status immediately after clicking Connect", () => {
    render(<SseDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(screen.getByText("connecting")).toBeInTheDocument();
  });

  it("Connect and Disconnect buttons are both disabled while connecting", () => {
    render(<SseDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(screen.getByRole("button", { name: "Connect" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Disconnect" })).toBeDisabled();
  });
});

describe("SseDemo — connected", () => {
  beforeEach(() => {
    render(<SseDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
  });

  it("shows 'connected' status after the 'connected' event fires", () => {
    act(() => { getES().emit("connected"); });
    expect(screen.getByText("connected")).toBeInTheDocument();
  });

  it("Connect is disabled and Disconnect is enabled while connected", () => {
    act(() => { getES().emit("connected"); });
    expect(screen.getByRole("button", { name: "Connect" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Disconnect" })).not.toBeDisabled();
  });

  it("appends a log entry when a 'log' event fires", () => {
    act(() => {
      getES().emit("connected");
      getES().emit("log", { level: "INFO", msg: "Server started", time: Date.now() });
    });
    expect(screen.getByText("Server started")).toBeInTheDocument();
  });

  it("renders multiple log entries in arrival order", () => {
    act(() => {
      getES().emit("connected");
      getES().emit("log", { level: "INFO",  msg: "First event",  time: Date.now() });
      getES().emit("log", { level: "WARN",  msg: "Second event", time: Date.now() });
      getES().emit("log", { level: "ERROR", msg: "Third event",  time: Date.now() });
    });
    const items = screen.getAllByText(/event$/i);
    expect(items[0]).toHaveTextContent("First event");
    expect(items[1]).toHaveTextContent("Second event");
    expect(items[2]).toHaveTextContent("Third event");
  });

  it("shows the event count badge after entries arrive", () => {
    act(() => {
      getES().emit("connected");
      getES().emit("log", { level: "INFO", msg: "hello", time: Date.now() });
    });
    expect(screen.getByText("1 event")).toBeInTheDocument();
  });
});

describe("SseDemo — disconnect", () => {
  it("shows 'closed' status after Disconnect is clicked", () => {
    render(<SseDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    act(() => { getES().emit("connected"); });
    fireEvent.click(screen.getByRole("button", { name: "Disconnect" }));
    expect(screen.getByText("closed")).toBeInTheDocument();
  });

  it("calls EventSource.close() when Disconnect is clicked", () => {
    render(<SseDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    const es = getES();
    act(() => { es.emit("connected"); });
    fireEvent.click(screen.getByRole("button", { name: "Disconnect" }));
    expect(es.closed).toBe(true);
  });
});

describe("SseDemo — cleanup", () => {
  it("calls EventSource.close() on unmount (useEffect cleanup)", () => {
    const { unmount } = render(<SseDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    const es = getES();
    unmount();
    expect(es.closed).toBe(true);
  });

  it("closes the previous EventSource when Connect is clicked a second time", () => {
    render(<SseDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    const firstES = getES();
    act(() => { firstES.emit("connected"); });
    fireEvent.click(screen.getByRole("button", { name: "Disconnect" }));
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(firstES.closed).toBe(true);
    expect(MockEventSource.instances).toHaveLength(2);
  });
});

describe("SseDemo — error handling", () => {
  it("shows 'error' status when onerror fires", () => {
    render(<SseDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    act(() => { getES().triggerError(); });
    expect(screen.getByText("error")).toBeInTheDocument();
  });

  it("closes the EventSource when onerror fires (no silent reconnect)", () => {
    render(<SseDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    const es = getES();
    act(() => { es.triggerError(); });
    expect(es.closed).toBe(true);
  });
});
