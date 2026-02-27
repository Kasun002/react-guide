/**
 * Unit tests for <CartDemo /> — Redux Toolkit version (Example 8).
 *
 * TDD interview focus:
 *  - useSelector reads state; useDispatch sends actions
 *  - addItem: first time adds product; second time increments qty
 *  - decrementItem: qty - 1; auto-removes at qty 0
 *  - removeItem: removes regardless of qty
 *  - clearCart: empties the cart
 *  - Total price is derived correctly from qty * price
 *
 * The real Redux store is used via StoreProvider so state transitions
 * are tested end-to-end through actual reducers (no mocking needed).
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import cartReducer from "@/store/cartSlice";
import CartDemo from "../CartDemo";
import type { ReactNode } from "react";

// ── Wrapper ────────────────────────────────────────────────────────────────────
// A new store is created per renderCart() call so tests are fully isolated
// (the singleton store/index.ts would carry state across tests).

function renderCart() {
  const store = configureStore({ reducer: { cart: cartReducer } });
  return render(<CartDemo />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("CartDemo (Redux) — product catalog", () => {
  it("renders all five products", () => {
    renderCart();
    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("USB-C Hub")).toBeInTheDocument();
  });

  it("shows 'Add to cart' button for each product initially", () => {
    renderCart();
    expect(screen.getAllByRole("button", { name: "Add to cart" })).toHaveLength(5);
  });
});

describe("CartDemo (Redux) — adding items", () => {
  it("adds a product to the cart on first click", () => {
    renderCart();
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    // Cart section shows the product name
    expect(screen.getAllByText("Mechanical Keyboard")).toHaveLength(2); // catalog + cart
  });

  it("shows 'Add more (n)' after the item is already in the cart", () => {
    renderCart();
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    expect(screen.getByRole("button", { name: "Add more (1)" })).toBeInTheDocument();
  });

  it("increments qty when the same product is added again", () => {
    renderCart();
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Add more (1)" }));
    expect(screen.getByRole("button", { name: "Add more (2)" })).toBeInTheDocument();
  });
});

describe("CartDemo (Redux) — qty controls", () => {
  beforeEach(() => {
    renderCart();
    // Add Mechanical Keyboard twice to start with qty 2
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Add more (1)" }));
  });

  it("decrements qty when − is clicked", () => {
    fireEvent.click(screen.getByRole("button", { name: "−" }));
    expect(screen.getByRole("button", { name: "Add more (1)" })).toBeInTheDocument();
  });

  it("removes item from cart when qty is decremented to 0", () => {
    fireEvent.click(screen.getByRole("button", { name: "−" })); // qty 2 → 1
    fireEvent.click(screen.getByRole("button", { name: "−" })); // qty 1 → 0 → removed
    expect(screen.queryByText("Mechanical Keyboard", { selector: "span" })).not.toBeInTheDocument();
  });
});

describe("CartDemo (Redux) — remove & clear", () => {
  it("removes an item immediately when ✕ is clicked", () => {
    renderCart();
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "✕" }));
    expect(screen.queryByText("Mechanical Keyboard", { selector: "span" })).not.toBeInTheDocument();
  });

  it("clears all items when 'Clear all' is clicked", () => {
    renderCart();
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[1]);
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("shows the correct total price", () => {
    renderCart();
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    // $89.99 appears in catalog, cart row, and total — target the Total row specifically
    const totalRow = screen.getByText("Total").closest("div") as HTMLElement;
    expect(totalRow).toHaveTextContent("$89.99");
  });
});
