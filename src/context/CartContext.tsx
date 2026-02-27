"use client";

// ── Types ──────────────────────────────────────────────────────────────────────

export type Product  = { id: number; name: string; price: number };
export type CartItem = Product & { qty: number };

type State = { items: CartItem[] };

type Action =
  | { type: "ADD";       payload: Product }
  | { type: "REMOVE";    payload: number }
  | { type: "DECREMENT"; payload: number }
  | { type: "CLEAR" };

// ── Reducer ────────────────────────────────────────────────────────────────────
// Pure function — no side-effects, easy to test in isolation.

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (exists) {
        // Return new array with updated qty (immutable update — no Immer here)
        return {
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter(i => i.id !== action.payload) };

    case "DECREMENT":
      return {
        items: state.items
          .map(i => (i.id === action.payload ? { ...i, qty: i.qty - 1 } : i))
          .filter(i => i.qty > 0), // auto-remove when qty hits 0
      };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────────
// Split into two contexts so consumers that only dispatch don't re-render on
// state changes (a common Context performance pattern).

import { createContext, useContext, useReducer, useMemo } from "react";
import type { ReactNode, Dispatch } from "react";

const CartStateCtx    = createContext<State    | null>(null);
const CartDispatchCtx = createContext<Dispatch<Action> | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Memoize state so object identity is stable when items haven't changed
  const stableState = useMemo(() => state, [state]);

  return (
    <CartStateCtx.Provider value={stableState}>
      <CartDispatchCtx.Provider value={dispatch}>
        {children}
      </CartDispatchCtx.Provider>
    </CartStateCtx.Provider>
  );
}

// ── Custom hooks ───────────────────────────────────────────────────────────────
// Encapsulate context access — consumers never import the raw contexts.

export function useCartState() {
  const ctx = useContext(CartStateCtx);
  if (!ctx) throw new Error("useCartState must be used inside <CartProvider>");
  return ctx;
}

export function useCartDispatch() {
  const ctx = useContext(CartDispatchCtx);
  if (!ctx) throw new Error("useCartDispatch must be used inside <CartProvider>");
  return ctx;
}

// ── Derived selectors (plain functions, not hooks) ─────────────────────────────
// Call these inside components after useCartState() — mirrors the co-located
// selector pattern from Redux but without any extra library.

export const selectItems     = (s: State) => s.items;
export const selectItemCount = (s: State) => s.items.reduce((n, i) => n + i.qty, 0);
export const selectTotal     = (s: State) => s.items.reduce((sum, i) => sum + i.price * i.qty, 0);
