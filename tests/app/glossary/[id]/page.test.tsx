import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import GlossaryTermPage from "@/app/glossary/[id]/page";

describe("Glossary term page", () => {
  it("renders a known term's detail", async () => {
    const element = await GlossaryTermPage({ params: Promise.resolve({ id: "sso" }) });
    render(element);

    expect(screen.getByRole("heading", { name: /SSO/ })).toBeInTheDocument();
    expect(screen.getByText(/Single Sign-On/)).toBeInTheDocument();
  });

  it("calls notFound for an unknown id instead of rendering an empty page", async () => {
    await expect(
      GlossaryTermPage({ params: Promise.resolve({ id: "does-not-exist" }) }),
    ).rejects.toThrow();
  });
});
