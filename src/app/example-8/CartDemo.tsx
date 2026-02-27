"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  addItem, removeItem, decrementItem, clearCart,
  selectItems, selectItemCount, selectTotal,
} from "@/store/cartSlice";
import type { Product } from "@/store/cartSlice";

// ── Static product catalog ─────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: 1, name: "Mechanical Keyboard", price: 89.99 },
  { id: 2, name: "Wireless Mouse",      price: 49.99 },
  { id: 3, name: "USB-C Hub",           price: 34.99 },
  { id: 4, name: "Monitor Stand",       price: 29.99 },
  { id: 5, name: "Webcam HD",           price: 59.99 },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CartDemo() {
  // useDispatch: gives access to store.dispatch
  const dispatch = useDispatch();

  // useSelector: subscribes to the slice of state we need.
  // Component re-renders ONLY when the selected value changes (not on every dispatch).
  const items      = useSelector(selectItems);
  const itemCount  = useSelector(selectItemCount);
  const total      = useSelector(selectTotal);

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* ── Product catalog ── */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Products</h3>
        {PRODUCTS.map(product => {
          const inCart = items.find(i => i.id === product.id);
          return (
            <div key={product.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => dispatch(addItem(product))}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
              >
                {inCart ? `Add more (${inCart.qty})` : "Add to cart"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Cart ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Cart {itemCount > 0 && <span className="ml-1 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">{itemCount}</span>}
          </h3>
          {items.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              className="text-xs font-medium text-red-500 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
            Your cart is empty
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex-1 text-sm font-medium text-gray-900">{item.name}</span>

                  {/* Qty controls */}
                  <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-1">
                    <button
                      onClick={() => dispatch(decrementItem(item.id))}
                      className="px-2 py-1 text-gray-500 hover:text-gray-900"
                    >−</button>
                    <span className="w-5 text-center text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => dispatch(addItem(item))}
                      className="px-2 py-1 text-gray-500 hover:text-gray-900"
                    >+</button>
                  </div>

                  <span className="w-16 text-right text-sm text-gray-600">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>

                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="text-gray-300 hover:text-red-500"
                  >✕</button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-base font-bold text-indigo-700">${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
