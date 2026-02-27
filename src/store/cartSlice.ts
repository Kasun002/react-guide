import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "."; // type-only import — no runtime circular dep

// ── Types ──────────────────────────────────────────────────────────────────────

export type Product  = { id: number; name: string; price: number };
export type CartItem = Product & { qty: number };

type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

// ── Slice ──────────────────────────────────────────────────────────────────────
//
// createSlice uses Immer under the hood, so you can write "mutating" logic
// (e.g. item.qty += 1) that is actually safe and immutable at runtime.

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1; // Immer turns this mutation into a safe update
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },

    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },

    // Decrement — auto-removes the item when qty reaches 0
    decrementItem(state, action: PayloadAction<number>) {
      const item = state.items.find(i => i.id === action.payload);
      if (!item) return;
      if (item.qty <= 1) {
        state.items = state.items.filter(i => i.id !== action.payload);
      } else {
        item.qty -= 1;
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, decrementItem, clearCart } = cartSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
// Co-locate selectors with their slice — easier to find and refactor.
// For expensive derivations, wrap with createSelector (Reselect) to memoize.

export const selectItems      = (s: RootState) => s.cart.items;
export const selectItemCount  = (s: RootState) => s.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectTotal      = (s: RootState) =>
  s.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export default cartSlice.reducer;
