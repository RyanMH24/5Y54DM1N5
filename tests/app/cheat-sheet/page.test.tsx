import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CheatSheetPage from "@/app/cheat-sheet/page";

describe("Cheat Sheet page", () => {
  it("defaults to the Linux tab and lists Linux commands", () => {
    render(<CheatSheetPage />);
    expect(screen.getByRole("tab", { name: "Linux" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("ps aux")).toBeInTheDocument();
    expect(screen.queryByText("Get-Process")).not.toBeInTheDocument();
  });

  it("switches shells when a different tab is clicked", () => {
    render(<CheatSheetPage />);
    fireEvent.click(screen.getByRole("tab", { name: "PowerShell" }));
    expect(screen.getByText("Get-Process")).toBeInTheDocument();
    expect(screen.queryByText("ps aux")).not.toBeInTheDocument();
  });

  it("narrows the list live as the search query changes, scoped to the active shell", () => {
    render(<CheatSheetPage />);
    fireEvent.change(screen.getByLabelText("Search commands"), {
      target: { value: "process" },
    });
    expect(screen.getByText("ps aux")).toBeInTheDocument();
    expect(screen.queryByText("chmod")).not.toBeInTheDocument();
  });

  it("restores the full list when the query is cleared", () => {
    render(<CheatSheetPage />);
    const input = screen.getByLabelText("Search commands");
    fireEvent.change(input, { target: { value: "process" } });
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByText("chmod")).toBeInTheDocument();
  });
});
