import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LessonRenderer } from "@/components/LessonRenderer";

describe("LessonRenderer", () => {
  it("renders the lesson's MDX prose", async () => {
    const element = await LessonRenderer({
      lessonId: "sample-lesson",
      body: "# Hello\n\nSome prose.",
    });
    render(element);

    expect(screen.getByRole("heading", { name: "Hello" })).toBeInTheDocument();
    expect(screen.getByText("Some prose.")).toBeInTheDocument();
  });

  it("resolves and renders an embedded Quiz interactively by id", async () => {
    const element = await LessonRenderer({
      lessonId: "sample-lesson",
      body: '# Quiz\n\n<Quiz id="sample-quiz" />',
    });
    render(element);

    expect(
      screen.getByText("Which PowerShell cmdlet lists running processes?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });
});
