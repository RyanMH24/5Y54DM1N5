import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CheatSheetSearch } from "@/components/CheatSheetSearch";

describe("CheatSheetSearch", () => {
  it("renders a labeled text input with the given value", () => {
    render(<CheatSheetSearch value="ps aux" onChange={() => {}} />);
    expect(screen.getByLabelText("Search commands")).toHaveValue("ps aux");
  });

  it("calls onChange with the typed value", () => {
    const onChange = vi.fn();
    render(<CheatSheetSearch value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Search commands"), { target: { value: "grep" } });
    expect(onChange).toHaveBeenCalledWith("grep");
  });
});
