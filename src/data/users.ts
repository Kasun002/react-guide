export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joined: string; // "YYYY-MM-DD"
};

const FIRST = ["Alice","Bob","Carol","David","Eva","Frank","Grace","Henry","Iris","Jack","Karen","Liam","Mia","Noah","Olivia","Paul","Quinn","Rose","Sam","Tina"];
const LAST  = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Lee","Thompson"];
const ROLES = ["Admin","Developer","Designer","Manager","Analyst","DevOps","QA Engineer"];

/**
 * Deterministic mock data — no Math.random so results are stable across renders.
 * In a real app this would be replaced by a fetch() call.
 */
export function generateUsers(count = 500): User[] {
  return Array.from({ length: count }, (_, i) => {
    const first  = FIRST[i % FIRST.length];
    const last   = LAST[(i * 3) % LAST.length];
    const suffix = Math.floor(i / FIRST.length) || "";
    return {
      id:     i + 1,
      name:   `${first} ${last}${suffix}`,
      email:  `${first.toLowerCase()}.${last.toLowerCase()}${suffix || ""}@acme.com`,
      role:   ROLES[i % ROLES.length],
      status: i % 6 === 0 ? "inactive" : "active",
      joined: new Date(
        2019 + (i % 5),       // year:  2019–2023
        (i * 3) % 12,         // month: 0–11
        ((i * 7) % 28) + 1,   // day:   1–28
      ).toISOString().slice(0, 10),
    };
  });
}
