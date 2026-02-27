/**
 * Unit tests for <TodoList />.
 *
 * TDD interview focus:
 *  - Add a new todo (handleAdd without useCallback — local only)
 *  - Toggle done state (handleToggle — useCallback + [] dep)
 *  - Delete a todo (handleDelete — useCallback + [] dep)
 *  - Progress bar reflects completed / total ratio
 *  - Memo: adding a new item does NOT re-render untouched rows
 *  - Disabled Add button when input is empty
 */

import { render, screen, fireEvent } from "@testing-library/react";
import TodoList from "../TodoList";

// ── Helpers ────────────────────────────────────────────────────────────────────

function addTodo(text: string) {
  fireEvent.change(screen.getByPlaceholderText(/add a new todo/i), {
    target: { value: text },
  });
  fireEvent.click(screen.getByRole("button", { name: /^add$/i }));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("TodoList — initial render", () => {
  it("renders the three default todos", () => {
    render(<TodoList />);
    expect(screen.getByText("Read the React docs")).toBeInTheDocument();
    expect(screen.getByText("Build a todo app")).toBeInTheDocument();
    expect(screen.getByText("Understand useCallback")).toBeInTheDocument();
  });

  it("shows the correct initial progress (1 of 3 complete)", () => {
    render(<TodoList />);
    expect(screen.getByText("1 of 3 complete")).toBeInTheDocument();
  });
});

describe("TodoList — adding", () => {
  it("appends a new todo when the form is submitted", () => {
    render(<TodoList />);
    addTodo("Write unit tests");
    expect(screen.getByText("Write unit tests")).toBeInTheDocument();
  });

  it("clears the input after adding", () => {
    render(<TodoList />);
    addTodo("Write unit tests");
    expect(screen.getByPlaceholderText(/add a new todo/i)).toHaveValue("");
  });

  it("disables the Add button when input is empty", () => {
    render(<TodoList />);
    expect(screen.getByRole("button", { name: /^add$/i })).toBeDisabled();
  });

  it("does not add a whitespace-only entry", () => {
    render(<TodoList />);
    fireEvent.change(screen.getByPlaceholderText(/add a new todo/i), {
      target: { value: "   " },
    });
    // Button is disabled for blank input — form submit won't fire handleAdd
    expect(screen.getByRole("button", { name: /^add$/i })).toBeDisabled();
  });
});

describe("TodoList — toggling", () => {
  it("marks an unchecked todo as done when its checkbox is clicked", () => {
    render(<TodoList />);
    const checkbox = screen.getAllByRole("checkbox")[1]; // "Build a todo app" (done: false)
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("applies line-through style to a completed todo", () => {
    render(<TodoList />);
    const checkbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(checkbox);
    const label = screen.getByText("Build a todo app");
    expect(label).toHaveClass("line-through");
  });
});

describe("TodoList — deleting", () => {
  it("removes a todo when its delete button is clicked", () => {
    render(<TodoList />);
    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    fireEvent.click(deleteButtons[0]); // delete first item
    expect(screen.queryByText("Read the React docs")).not.toBeInTheDocument();
  });

  it("shows the empty state message when all todos are deleted", () => {
    render(<TodoList />);
    const deleteAll = () =>
      screen.queryAllByRole("button", { name: "Delete" }).forEach(b => fireEvent.click(b));
    deleteAll();
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });
});

describe("TodoList — memo (render count)", () => {
  it("does not increment the render count of untouched items when a new todo is added", () => {
    render(<TodoList />);

    // Read initial render count badge for the first item
    const badge = screen.getAllByText(/^renders: \d+$/)[0];
    const countBefore = Number(badge.textContent?.replace("renders: ", ""));

    // Add a new item — untouched rows must NOT re-render
    addTodo("New item");

    const countAfter = Number(badge.textContent?.replace("renders: ", ""));
    expect(countAfter).toBe(countBefore); // same render count
  });
});
