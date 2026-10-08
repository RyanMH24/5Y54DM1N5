import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import GlossaryPage from "@/app/glossary/page";

describe("Glossary page", () => {
  it("lists every term", () => {
    render(<GlossaryPage />);
    expect(screen.getByRole("link", { name: /SSO/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Endpoint/ })).toBeInTheDocument();
  });

  it("narrows the list live as the search query changes", () => {
    render(<GlossaryPage />);
    fireEvent.change(screen.getByLabelText("Search glossary"), {
      target: { value: "single sign" },
    });
    expect(screen.getByRole("link", { name: /SSO/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Endpoint/ })).not.toBeInTheDocument();
  });

  it("restores the full list when the query is cleared", () => {
    render(<GlossaryPage />);
    const input = screen.getByLabelText("Search glossary");
    fireEvent.change(input, { target: { value: "sso" } });
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByRole("link", { name: /Endpoint/ })).toBeInTheDocument();
  });
});
