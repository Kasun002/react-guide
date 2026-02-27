/**
 * Integration tests for <FetchDemo />.
 *
 * TDD interview focus:
 *  - Loading / error / success UI states driven by useFetch state
 *  - Tab switching changes the active URL passed to useFetch
 *  - "from cache" badge renders only when cached: true
 *  - Correct fields rendered per resource type (Users / Posts / Todos)
 *
 * Strategy: mock useFetch so these tests only care about the component's
 * rendering logic, not the hook's networking behavior (tested separately).
 */

import { render, screen, fireEvent } from "@testing-library/react";
import FetchDemo from "../FetchDemo";
import { useFetch } from "@/hooks/useFetch";

// ── Mock useFetch ─────────────────────────────────────────────────────────────
// Controls what state the component receives without any real network calls.

jest.mock("@/hooks/useFetch");
const mockUseFetch = useFetch as jest.Mock;

// ── Fixtures ──────────────────────────────────────────────────────────────────

const USERS = [
  { id: 1, name: "Alice Smith",  email: "alice@test.com", phone: "555-0100" },
  { id: 2, name: "Bob Johnson",  email: "bob@test.com",   phone: "555-0101" },
];

const POSTS = [
  { id: 1, title: "First Post",  body: "Body of first post."  },
  { id: 2, title: "Second Post", body: "Body of second post." },
];

const TODOS = [
  { id: 1, title: "Buy groceries", completed: true  },
  { id: 2, title: "Write tests",   completed: false },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("FetchDemo — loading state", () => {
  it("shows a loading indicator while fetching", () => {
    mockUseFetch.mockReturnValue({ status: "loading" });
    render(<FetchDemo />);
    expect(screen.getByText("Fetching…")).toBeInTheDocument();
  });
});

describe("FetchDemo — error state", () => {
  it("shows the error message when the fetch fails", () => {
    mockUseFetch.mockReturnValue({ status: "error", error: "Network error" });
    render(<FetchDemo />);
    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });
});

describe("FetchDemo — success state (Users)", () => {
  beforeEach(() => {
    mockUseFetch.mockReturnValue({
      status: "success",
      data: USERS,
      cached: false,
    });
  });

  it("renders a card for each user", () => {
    render(<FetchDemo />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });

  it("displays email and phone for user cards", () => {
    render(<FetchDemo />);
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    expect(screen.getByText("555-0100")).toBeInTheDocument();
  });

  it("does NOT show the cache badge when cached is false", () => {
    render(<FetchDemo />);
    expect(screen.queryByText(/from cache/i)).not.toBeInTheDocument();
  });
});

describe("FetchDemo — success state (Posts)", () => {
  it("displays the post title and body", () => {
    mockUseFetch.mockReturnValue({
      status: "success",
      data: POSTS,
      cached: false,
    });
    render(<FetchDemo />);
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Body of first post.")).toBeInTheDocument();
  });
});

describe("FetchDemo — success state (Todos)", () => {
  it("shows ✓ done for completed todos and pending for incomplete", () => {
    mockUseFetch.mockReturnValue({
      status: "success",
      data: TODOS,
      cached: false,
    });
    render(<FetchDemo />);
    expect(screen.getByText("✓ done")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
  });
});

describe("FetchDemo — cache badge", () => {
  it("shows the 'from cache' badge when cached is true", () => {
    mockUseFetch.mockReturnValue({
      status: "success",
      data: USERS,
      cached: true,
    });
    render(<FetchDemo />);
    expect(screen.getByText(/from cache/i)).toBeInTheDocument();
  });
});

describe("FetchDemo — tab switching", () => {
  it("renders three tab buttons: Users, Posts, Todos", () => {
    mockUseFetch.mockReturnValue({ status: "loading" });
    render(<FetchDemo />);
    expect(screen.getByRole("button", { name: "Users" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Posts" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Todos" })).toBeInTheDocument();
  });

  it("calls useFetch with the Posts URL after clicking the Posts tab", () => {
    mockUseFetch.mockReturnValue({ status: "loading" });
    render(<FetchDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Posts" }));

    // The most recent call to useFetch should be the Posts endpoint
    const lastCall = mockUseFetch.mock.calls[mockUseFetch.mock.calls.length - 1];
    expect(lastCall[0]).toContain("posts");
  });

  it("highlights the active tab", () => {
    mockUseFetch.mockReturnValue({ status: "loading" });
    render(<FetchDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Todos" }));

    // Active tab gets a filled background class
    expect(screen.getByRole("button", { name: "Todos" })).toHaveClass("bg-violet-600");
    expect(screen.getByRole("button", { name: "Users" })).not.toHaveClass("bg-violet-600");
  });
});
