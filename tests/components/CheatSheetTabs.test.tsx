import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CheatSheetTabs } from "@/components/CheatSheetTabs";

describe("CheatSheetTabs", () => {
  it("renders a tab for every shell", () => {
    render(<CheatSheetTabs value="linux" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "Linux" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "PowerShell" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Zsh" })).toBeInTheDocument();
  });

  it("marks the active shell as selected", () => {
    render(<CheatSheetTabs value="powershell" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "PowerShell" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Linux" })).toHaveAttribute("aria-selected", "false");
  });

  it("calls onChange with the clicked shell", () => {
    const onChange = vi.fn();
    render(<CheatSheetTabs value="linux" onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Zsh" }));
    expect(onChange).toHaveBeenCalledWith("zsh");
  });
});
