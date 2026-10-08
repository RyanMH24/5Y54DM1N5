import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import LessonPage from "@/app/lessons/[id]/page";

beforeEach(() => {
  localStorage.clear();
});

describe("Lesson page", () => {
  it("renders prose and an interactive quiz, grades on submit, and shows no prior completion", async () => {
    render(await LessonPage({ params: Promise.resolve({ id: "sample-lesson" }) }));

    expect(screen.getByRole("heading", { name: "Sample Lesson", level: 1 })).toBeInTheDocument();
    expect(screen.queryByText(/Already completed/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Get-Process"));
    fireEvent.change(screen.getByLabelText("What is the short alias for Get-Process?"), {
      target: { value: "gps" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("Score: 2/2")).toBeInTheDocument();
  });

  it("links to the glossary, resolving a cross-referenced term", async () => {
    render(await LessonPage({ params: Promise.resolve({ id: "sample-lesson" }) }));

    expect(screen.getByRole("link", { name: "endpoint" })).toHaveAttribute(
      "href",
      "/glossary/endpoint",
    );
  });

  it("shows completion from a prior visit after the page reloads", async () => {
    const { unmount } = render(await LessonPage({ params: Promise.resolve({ id: "sample-lesson" }) }));

    fireEvent.click(screen.getByLabelText("Get-Service"));
    fireEvent.change(screen.getByLabelText("What is the short alias for Get-Process?"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    unmount();

    render(await LessonPage({ params: Promise.resolve({ id: "sample-lesson" }) }));

    expect(screen.getByText("Already completed — score 0/2")).toBeInTheDocument();
  });
});
