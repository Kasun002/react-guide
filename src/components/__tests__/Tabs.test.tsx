/**
 * Unit tests for the compound <Tabs> component.
 *
 * TDD interview focus:
 *  - Only the default panel is visible; others are unmounted
 *  - Clicking a tab switches the active panel
 *  - ARIA attributes: role, aria-selected, aria-controls / aria-labelledby
 *  - Roving tabindex: active tab = 0, inactive = -1
 *  - Keyboard navigation: ArrowRight · ArrowLeft · Home · End
 */

import { render, screen, fireEvent, act } from "@testing-library/react";
import { Tabs } from "../Tabs";

// ── Shared test wrapper ────────────────────────────────────────────────────────

function renderTabs(defaultTab = "a") {
  return render(
    <Tabs defaultTab={defaultTab}>
      <Tabs.List>
        <Tabs.Tab id="a">Tab A</Tabs.Tab>
        <Tabs.Tab id="b">Tab B</Tabs.Tab>
        <Tabs.Tab id="c">Tab C</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="a">Panel A content</Tabs.Panel>
      <Tabs.Panel id="b">Panel B content</Tabs.Panel>
      <Tabs.Panel id="c">Panel C content</Tabs.Panel>
    </Tabs>,
  );
}

// ── Initial render ─────────────────────────────────────────────────────────────

describe("Tabs — initial render", () => {
  it("renders all three tab buttons", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Tab A" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab B" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab C" })).toBeInTheDocument();
  });

  it("shows only the default panel; others are not in the DOM", () => {
    renderTabs("a");
    expect(screen.getByText("Panel A content")).toBeInTheDocument();
    expect(screen.queryByText("Panel B content")).not.toBeInTheDocument();
    expect(screen.queryByText("Panel C content")).not.toBeInTheDocument();
  });
});

// ── Tab switching ──────────────────────────────────────────────────────────────

describe("Tabs — switching", () => {
  it("shows the clicked tab's panel and hides the previous one", () => {
    renderTabs();
    fireEvent.click(screen.getByRole("tab", { name: "Tab B" }));
    expect(screen.getByText("Panel B content")).toBeInTheDocument();
    expect(screen.queryByText("Panel A content")).not.toBeInTheDocument();
  });

  it("can switch multiple times sequentially", () => {
    renderTabs();
    fireEvent.click(screen.getByRole("tab", { name: "Tab C" }));
    expect(screen.getByText("Panel C content")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Tab A" }));
    expect(screen.getByText("Panel A content")).toBeInTheDocument();
  });
});

// ── ARIA attributes ────────────────────────────────────────────────────────────

describe("Tabs — ARIA", () => {
  it("sets aria-selected=true on the active tab and false on others", () => {
    renderTabs("a");
    expect(screen.getByRole("tab", { name: "Tab A" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute("aria-selected", "false");
  });

  it("active tab has tabIndex 0; inactive tabs have tabIndex -1 (roving tabindex)", () => {
    renderTabs("a");
    expect(screen.getByRole("tab", { name: "Tab A" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute("tabindex", "-1");
  });

  it("panel has role=tabpanel", () => {
    renderTabs();
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });
});

// ── Keyboard navigation ────────────────────────────────────────────────────────

describe("Tabs — keyboard navigation", () => {
  it("ArrowRight moves focus to the next tab", () => {
    renderTabs();
    const tablist = screen.getByRole("tablist");
    act(() => { screen.getByRole("tab", { name: "Tab A" }).focus(); });
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Tab B" }));
  });

  it("ArrowLeft moves focus to the previous tab", () => {
    renderTabs();
    const tablist = screen.getByRole("tablist");
    act(() => { screen.getByRole("tab", { name: "Tab B" }).focus(); });
    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Tab A" }));
  });

  it("Home key moves focus to the first tab", () => {
    renderTabs();
    const tablist = screen.getByRole("tablist");
    act(() => { screen.getByRole("tab", { name: "Tab C" }).focus(); });
    fireEvent.keyDown(tablist, { key: "Home" });
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Tab A" }));
  });

  it("End key moves focus to the last tab", () => {
    renderTabs();
    const tablist = screen.getByRole("tablist");
    act(() => { screen.getByRole("tab", { name: "Tab A" }).focus(); });
    fireEvent.keyDown(tablist, { key: "End" });
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Tab C" }));
  });
});
