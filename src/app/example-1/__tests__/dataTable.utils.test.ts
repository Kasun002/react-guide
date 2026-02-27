/**
 * Unit tests for DataTable pure utility functions.
 *
 * TDD interview focus:
 *  - sortBy  : immutability, ascending, descending
 *  - filterUsers : empty query, name/email/role matching, no match
 *  - pageRange   : small totals, ellipsis for large totals
 *
 * These are plain function tests — no React, no DOM needed.
 */

import { sortBy, filterUsers, pageRange } from "../dataTable.utils";
import type { User } from "@/data/users";

// ── Shared fixture ─────────────────────────────────────────────────────────────

const USERS: User[] = [
  { id: 1, name: "David Brown",    email: "david@acme.com",  role: "Manager",   status: "active",   joined: "2022-01-15" },
  { id: 2, name: "Alice Smith",    email: "alice@acme.com",  role: "Admin",     status: "active",   joined: "2022-03-10" },
  { id: 3, name: "Carol Williams", email: "carol@acme.com",  role: "Developer", status: "inactive", joined: "2021-07-22" },
  { id: 4, name: "Bob Johnson",    email: "bob@acme.com",    role: "Designer",  status: "active",   joined: "2023-05-01" },
  { id: 5, name: "Eva Garcia",     email: "eva@acme.com",    role: "QA Engineer", status: "active", joined: "2020-11-30" },
];

// ── sortBy ─────────────────────────────────────────────────────────────────────

describe("sortBy", () => {
  it("sorts strings ascending", () => {
    const result = sortBy(USERS, "name", "asc");
    expect(result.map(u => u.name)).toEqual([
      "Alice Smith",
      "Bob Johnson",
      "Carol Williams",
      "David Brown",
      "Eva Garcia",
    ]);
  });

  it("sorts strings descending", () => {
    const result = sortBy(USERS, "name", "desc");
    expect(result[0].name).toBe("Eva Garcia");
    expect(result[result.length - 1].name).toBe("Alice Smith");
  });

  it("sorts numbers ascending", () => {
    const shuffled = [...USERS].reverse();           // start in reversed id order
    const result   = sortBy(shuffled, "id", "asc");
    expect(result.map(u => u.id)).toEqual([1, 2, 3, 4, 5]);
  });

  // Key interview concept: sortBy must be a pure function
  it("does not mutate the original array", () => {
    const original = [...USERS];
    sortBy(USERS, "name", "asc");
    expect(USERS).toEqual(original);              // reference order unchanged
  });
});

// ── filterUsers ───────────────────────────────────────────────────────────────

describe("filterUsers", () => {
  it("returns the original array when query is empty", () => {
    expect(filterUsers(USERS, "")).toBe(USERS);   // same reference — no allocation
    expect(filterUsers(USERS, "   ")).toBe(USERS);
  });

  it("filters by name (case-insensitive)", () => {
    const result = filterUsers(USERS, "alice");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Alice Smith");
  });

  it("filters by email", () => {
    const result = filterUsers(USERS, "carol@acme");
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe("carol@acme.com");
  });

  it("filters by role", () => {
    const result = filterUsers(USERS, "designer");
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("Designer");
  });

  it("returns empty array when nothing matches", () => {
    expect(filterUsers(USERS, "zzz-no-match")).toHaveLength(0);
  });
});

// ── pageRange ─────────────────────────────────────────────────────────────────

describe("pageRange", () => {
  it("returns every page number when total is ≤ 7", () => {
    expect(pageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageRange(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("always includes first and last page", () => {
    const range = pageRange(5, 20) as (number | string)[];
    expect(range[0]).toBe(1);
    expect(range[range.length - 1]).toBe(20);
  });

  it("inserts ellipsis when current page is far from start", () => {
    const range = pageRange(8, 15);
    expect(range).toContain("...");
    expect(range[1]).toBe("...");   // gap between 1 and the window
  });

  it("shows a contiguous window around the current page", () => {
    const range = pageRange(5, 20).filter(p => p !== "...");
    // 4, 5, 6 should all be present (prev, current, next)
    expect(range).toContain(4);
    expect(range).toContain(5);
    expect(range).toContain(6);
  });
});
