import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ChallengeCompleteBanner } from "@/components/ChallengeCompleteBanner";

describe("ChallengeCompleteBanner", () => {
  it("renders the given message", () => {
    render(<ChallengeCompleteBanner message="Scenario complete!" />);
    expect(screen.getByRole("status")).toHaveTextContent("Scenario complete!");
  });

  it("renders a Next link back to the home page", () => {
    render(<ChallengeCompleteBanner message="Lab complete!" />);
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/");
  });

  it("omits the Restart button when onRestart isn't provided", () => {
    render(<ChallengeCompleteBanner message="Lab complete!" />);
    expect(screen.queryByRole("button", { name: "Restart" })).not.toBeInTheDocument();
  });

  it("renders a Restart button that calls onRestart when provided", () => {
    const onRestart = vi.fn();
    render(<ChallengeCompleteBanner message="Lab complete!" onRestart={onRestart} />);

    fireEvent.click(screen.getByRole("button", { name: "Restart" }));
    expect(onRestart).toHaveBeenCalledOnce();
  });
});
