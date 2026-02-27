/**
 * Unit tests for the recursive <FileTree> component.
 *
 * TDD interview focus:
 *  - Root folder is open by default (depth === 0)
 *  - Clicking a closed folder opens it and renders its children
 *  - Clicking an open folder closes it and unmounts its children
 *  - Recursion: nested children appear when ancestor is open
 *  - Files render correctly (no toggle, not a folder)
 *  - Stable IDs as keys (never array index)
 */

import { render, screen, fireEvent } from "@testing-library/react";
import FileTree from "../FileTree";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("FileTree — initial render", () => {
  it("renders the root folder name", () => {
    render(<FileTree />);
    expect(screen.getByText("my-project")).toBeInTheDocument();
  });

  it("shows top-level children by default (root is open at depth 0)", () => {
    render(<FileTree />);
    // Direct children of root should be visible without any click
    expect(screen.getByText("src")).toBeInTheDocument();
    expect(screen.getByText("public")).toBeInTheDocument();
    expect(screen.getByText("package.json")).toBeInTheDocument();
  });

  it("does not show deeply nested files until their ancestor is opened", () => {
    render(<FileTree />);
    // Button.tsx is inside src/components — src is closed by default (depth > 0)
    expect(screen.queryByText("Button.tsx")).not.toBeInTheDocument();
  });
});

describe("FileTree — toggle open / close", () => {
  it("opens a folder and shows its children when clicked", () => {
    render(<FileTree />);
    fireEvent.click(screen.getByText("src"));
    expect(screen.getByText("components")).toBeInTheDocument();
    expect(screen.getByText("hooks")).toBeInTheDocument();
  });

  it("closes an open folder and hides its children when clicked again", () => {
    render(<FileTree />);
    // Open src first
    fireEvent.click(screen.getByText("src"));
    expect(screen.getByText("components")).toBeInTheDocument();
    // Close src
    fireEvent.click(screen.getByText("src"));
    expect(screen.queryByText("components")).not.toBeInTheDocument();
  });

  it("renders nested children recursively when multiple levels are opened", () => {
    render(<FileTree />);
    fireEvent.click(screen.getByText("src"));
    fireEvent.click(screen.getByText("components"));
    // Now deeply nested files should appear
    expect(screen.getByText("Button.tsx")).toBeInTheDocument();
    expect(screen.getByText("Modal.tsx")).toBeInTheDocument();
  });
});

describe("FileTree — file nodes", () => {
  it("renders root-level files without a toggle chevron (cursor-default)", () => {
    render(<FileTree />);
    // package.json is a root-level file — its button has cursor-default class
    const fileBtn = screen.getByText("package.json").closest("button");
    expect(fileBtn).toHaveClass("cursor-default");
  });

  it("folder button has cursor-pointer class", () => {
    render(<FileTree />);
    const folderBtn = screen.getByText("src").closest("button");
    expect(folderBtn).toHaveClass("cursor-pointer");
  });
});
