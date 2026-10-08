import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlossaryList } from "@/components/GlossaryList";
import type { GlossaryTerm } from "@/types/glossary";

const terms: GlossaryTerm[] = [
  { id: "sso", term: "SSO", acronymFor: "Single Sign-On", definition: "Log in once." },
  { id: "endpoint", term: "Endpoint", definition: "A networked device." },
];

describe("GlossaryList", () => {
  it("renders one entry per term, each linking to its detail page", () => {
    render(<GlossaryList terms={terms} />);
    expect(screen.getByRole("link", { name: /SSO/ })).toHaveAttribute("href", "/glossary/sso");
    expect(screen.getByRole("link", { name: /Endpoint/ })).toHaveAttribute(
      "href",
      "/glossary/endpoint",
    );
  });

  it("renders the expanded acronym when present", () => {
    render(<GlossaryList terms={terms} />);
    expect(screen.getByText(/Single Sign-On/)).toBeInTheDocument();
  });

  it("omits acronym expansion when absent", () => {
    render(<GlossaryList terms={[terms[1]]} />);
    expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
  });

  it("renders an empty-state message for an empty list", () => {
    render(<GlossaryList terms={[]} />);
    expect(screen.getByText(/no terms match/i)).toBeInTheDocument();
  });
});
