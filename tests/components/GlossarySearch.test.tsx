import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { GlossarySearch } from "@/components/GlossarySearch";

describe("GlossarySearch", () => {
  it("renders a labeled text input with the given value", () => {
    render(<GlossarySearch value="sso" onChange={() => {}} />);
    expect(screen.getByLabelText("Search glossary")).toHaveValue("sso");
  });

  it("calls onChange with the typed value", () => {
    const onChange = vi.fn();
    render(<GlossarySearch value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Search glossary"), { target: { value: "mdm" } });
    expect(onChange).toHaveBeenCalledWith("mdm");
  });
});
