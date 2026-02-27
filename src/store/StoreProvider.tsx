"use client";

// Next.js App Router: Redux Provider must be a Client Component.
// Wrap only the subtree that needs the store — not the entire layout.

import { Provider } from "react-redux";
import { store } from ".";
import type { ReactNode } from "react";

export function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
