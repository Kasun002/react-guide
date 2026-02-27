/**
 * Unit tests for <CartDemo /> — Context API version (Example 9).
 *
 * TDD interview focus:
 *  - useContext reads state; dispatch sends typed action objects
 *  - Split-context pattern: state and dispatch in separate providers
 *  - Same business logic as Redux version but zero external dependencies
 *  - Pure reducer: ADD / REMOVE / DECREMENT / CLEAR actions
 *  - Derived selectors (plain functions) called after useCartState()
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider } from "@/context/CartContext";
import CartDemo from "../CartDemo";
import type { ReactNode } from "react";

// ── Wrapper ────────────────────────────────────────────────────────────────────

function renderCart() {
  return render(<CartDemo />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    ),
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("CartDemo (Context) — product catalog", () => {
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

describe("CartDemo (Context) — adding items", () => {
  it("adds a product to the cart on first click", () => {
    renderCart();
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    expect(screen.getAllByText("Mechanical Keyboard")).toHaveLength(2); // catalog + cart
  });

  it("shows 'Add more (n)' after the item is in the cart", () => {
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

describe("CartDemo (Context) — qty controls", () => {
  beforeEach(() => {
    renderCart();
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Add more (1)" }));
  });

  it("decrements qty when − is clicked", () => {
    fireEvent.click(screen.getByRole("button", { name: "−" }));
    expect(screen.getByRole("button", { name: "Add more (1)" })).toBeInTheDocument();
  });

  it("auto-removes the item when qty is decremented to 0", () => {
    fireEvent.click(screen.getByRole("button", { name: "−" })); // 2 → 1
    fireEvent.click(screen.getByRole("button", { name: "−" })); // 1 → 0 → removed
    expect(screen.queryByText("Mechanical Keyboard", { selector: "span" })).not.toBeInTheDocument();
  });
});

describe("CartDemo (Context) — remove & clear", () => {
  it("removes an item when ✕ is clicked", () => {
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
    const totalRow = screen.getByText("Total").closest("div") as HTMLElement;
    expect(totalRow).toHaveTextContent("$89.99");
  });
});
