// Extends Jest's expect() with DOM-specific matchers:
// toBeInTheDocument(), toHaveTextContent(), toBeVisible(), etc.
import "@testing-library/jest-dom";

// Suppress the React "not wrapped in act()" console.error for async state
// updates that settle via microtasks (resolved Promise mocks). This is a
// known React 19 + RTL quirk: fetch mocks resolve after render()'s act()
// boundary closes, causing warnings even though waitFor() still passes.
// Real act() violations (synchronous missed wraps) still surface as failures.
const originalError = console.error.bind(console);
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("not wrapped in act(")
    ) {
      return;
    }
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
