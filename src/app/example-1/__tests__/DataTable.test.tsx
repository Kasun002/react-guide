/**
 * Integration tests for <DataTable />.
 *
 * TDD interview focus:
 *  - Loading state before data arrives
 *  - Data renders after async fetch simulation (fake timers + act)
 *  - Search filters the visible rows
 *  - Column header click toggles sort asc → desc
 *  - Pagination controls update visible rows
 *  - Page-size select limits row count
 *
 * Pattern: mock the data module so tests use a small, deterministic fixture
 * instead of 500 rows; use jest.useFakeTimers() for the setTimeout in useEffect.
 */

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import DataTable from "../DataTable";
import type { User } from "@/data/users";

// ── Mock the data module ───────────────────────────────────────────────────────
// Replace generateUsers with a controlled fixture so every test is deterministic.

jest.mock("@/data/users", () => ({
  generateUsers: jest.fn(),
}));

import { generateUsers } from "@/data/users";
const mockGenerate = generateUsers as jest.Mock;

// 11 rows — first 10 land on page 1 (default page size), row 11 lands on page 2.
// This lets pagination tests use the real page-size options (10 / 25 / 50)
// without needing to fire a combobox change at all.
const MOCK_USERS: User[] = [
  { id:  1, name: "David Brown",    email: "david@acme.com",   role: "Manager",    status: "active",   joined: "2022-01-15" },
  { id:  2, name: "Alice Smith",    email: "alice@acme.com",   role: "Admin",      status: "active",   joined: "2022-03-10" },
  { id:  3, name: "Carol Williams", email: "carol@acme.com",   role: "Developer",  status: "inactive", joined: "2021-07-22" },
  { id:  4, name: "Bob Johnson",    email: "bob@acme.com",     role: "Designer",   status: "active",   joined: "2023-05-01" },
  { id:  5, name: "Eva Garcia",     email: "eva@acme.com",     role: "QA Engineer",status: "active",   joined: "2020-11-30" },
  { id:  6, name: "Frank Miller",   email: "frank@acme.com",   role: "DevOps",     status: "active",   joined: "2019-08-14" },
  { id:  7, name: "Grace Wilson",   email: "grace@acme.com",   role: "Designer",   status: "active",   joined: "2021-03-08" },
  { id:  8, name: "Henry Taylor",   email: "henry@acme.com",   role: "Developer",  status: "inactive", joined: "2020-06-15" },
  { id:  9, name: "Iris Anderson",  email: "iris@acme.com",    role: "Analyst",    status: "active",   joined: "2023-01-20" },
  { id: 10, name: "Jack Thomas",    email: "jack@acme.com",    role: "Admin",      status: "active",   joined: "2022-09-11" },
  { id: 11, name: "Karen White",    email: "karen@acme.com",   role: "Manager",    status: "active",   joined: "2021-12-03" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Renders the component and advances fake timers past the 700 ms fetch delay. */
async function renderAndLoad() {
  render(<DataTable />);
  act(() => { jest.advanceTimersByTime(800); });
  await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());
}

// ── Setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  jest.useFakeTimers();
  mockGenerate.mockReturnValue(MOCK_USERS);
});

afterEach(() => {
  jest.useRealTimers();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("DataTable — loading state", () => {
  it("shows a loading indicator before data arrives", () => {
    render(<DataTable />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    // Table must NOT be visible yet
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("renders the data table after the fetch delay", async () => {
    await renderAndLoad();
    expect(screen.getByRole("table")).toBeInTheDocument();
    // All six mock rows should be visible (default page size = 10)
    expect(screen.getByText("David Brown")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });
});

describe("DataTable — search / filter", () => {
  it("filters rows to only those matching the search query", async () => {
    await renderAndLoad();

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "alice" },
    });

    // useDeferredValue defers at low priority — in test it resolves synchronously
    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.queryByText("David Brown")).not.toBeInTheDocument();
    });
  });

  it("shows a no-results message when the query matches nothing", async () => {
    await renderAndLoad();

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "zzz-no-match" },
    });

    await waitFor(() => {
      expect(screen.getByText(/no results/i)).toBeInTheDocument();
    });
  });

  it("filters by role", async () => {
    await renderAndLoad();

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "devops" },
    });

    await waitFor(() => {
      expect(screen.getByText("Frank Miller")).toBeInTheDocument();
      expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
    });
  });
});

describe("DataTable — sorting", () => {
  it("sorts rows ascending when a column header is clicked", async () => {
    await renderAndLoad();

    // Default sort is by id (David=1, Alice=2, …). Click Name to sort by name.
    fireEvent.click(screen.getByRole("columnheader", { name: /name/i }));

    await waitFor(() => {
      const cells = screen.getAllByRole("cell").filter(td =>
        MOCK_USERS.some(u => td.textContent === u.name)
      );
      // First name cell should be "Alice Smith" (alphabetically first)
      expect(cells[0]).toHaveTextContent("Alice Smith");
    });
  });

  it("reverses sort to descending when the same header is clicked twice", async () => {
    await renderAndLoad();

    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    fireEvent.click(nameHeader); // asc
    fireEvent.click(nameHeader); // desc

    await waitFor(() => {
      const cells = screen.getAllByRole("cell").filter(td =>
        MOCK_USERS.some(u => td.textContent === u.name)
      );
      expect(cells[0]).toHaveTextContent("Karen White"); // alphabetically last
    });
  });
});

describe("DataTable — pagination", () => {
  // 11 mock users + default page size 10 → page 1 has 10 rows, page 2 has 1 row.

  it("shows only the first 10 rows on page 1 (default page size)", async () => {
    await renderAndLoad();

    // tbody has 10 data rows — Karen White (id 11) is on page 2
    expect(screen.getAllByRole("row").length - 1).toBe(10);    // -1 for thead
    expect(screen.queryByText("Karen White")).not.toBeInTheDocument();
  });

  it("navigates to page 2 showing the remaining row", async () => {
    await renderAndLoad();

    fireEvent.click(screen.getByRole("button", { name: "›" }));

    await waitFor(() => {
      expect(screen.getByText("Karen White")).toBeInTheDocument();
    });
    // First page rows should no longer be visible
    expect(screen.queryByText("David Brown")).not.toBeInTheDocument();
  });
});
