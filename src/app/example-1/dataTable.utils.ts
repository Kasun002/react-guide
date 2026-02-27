import type { User } from "@/data/users";

export type SortDir = "asc" | "desc";
export type SortKey = keyof User;

/**
 * Returns a new sorted array — never mutates the original.
 * Generic so it works with any object shape.
 */
export function sortBy<T>(arr: T[], key: keyof T, dir: SortDir): T[] {
  return [...arr].sort((a, b) => {
    const cmp = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
    return dir === "asc" ? cmp : -cmp;
  });
}

/**
 * Filters users by name, email, or role — case-insensitive.
 * Returns the original array reference when query is empty (no allocation).
 */
export function filterUsers(rows: User[], query: string): User[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(r =>
    r.name.toLowerCase().includes(q)  ||
    r.email.toLowerCase().includes(q) ||
    r.role.toLowerCase().includes(q)
  );
}

/**
 * Builds the page-number list with "..." ellipsis for long ranges.
 * e.g. current=5, total=10 → [1, "...", 4, 5, 6, "...", 10]
 */
export function pageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const list: (number | "...")[] = [1];
  if (current > 3) list.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    list.push(p);
  }
  if (current < total - 2) list.push("...");
  list.push(total);
  return list;
}
