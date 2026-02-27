export type NavItem = {
  label: string;
  href: string;
};

// Add or remove items here — the navbar handles any number automatically.
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Example 1", href: "/example-1" },
  { label: "Example 2", href: "/example-2" },
  { label: "Example 3", href: "/example-3" },
  { label: "Example 4", href: "/example-4" },
  { label: "Example 5", href: "/example-5" },
];
