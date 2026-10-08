import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Quiz } from "@/components/Quiz";
import type { Quiz as QuizData } from "@/types/curriculum";

const quiz: QuizData = {
  id: "quiz-1",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "Pick A",
      choices: [
        { id: "a", text: "Choice A" },
        { id: "b", text: "Choice B" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "Type gps",
      acceptedAnswers: ["gps"],
    },
  ],
};

describe("Quiz", () => {
  it("renders a selectable choice list for multiple-choice questions", () => {
    render(<Quiz quiz={quiz} />);
    expect(screen.getByLabelText("Choice A")).toBeInTheDocument();
    expect(screen.getByLabelText("Choice B")).toBeInTheDocument();
  });

  it("renders a text input for fill-in-blank questions", () => {
    render(<Quiz quiz={quiz} />);
    expect(screen.getByLabelText("Type gps")).toBeInTheDocument();
  });

  it("grades answers on submit and shows per-question feedback and overall score", () => {
    render(<Quiz quiz={quiz} />);

    fireEvent.click(screen.getByLabelText("Choice A"));
    fireEvent.change(screen.getByLabelText("Type gps"), { target: { value: "GPS" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getAllByText("Correct")).toHaveLength(2);
    expect(screen.getByText("Score: 2/2")).toBeInTheDocument();
  });

  it("shows incorrect feedback for a wrong answer", () => {
    render(<Quiz quiz={quiz} />);

    fireEvent.click(screen.getByLabelText("Choice B"));
    fireEvent.change(screen.getByLabelText("Type gps"), { target: { value: "gps" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("Incorrect")).toBeInTheDocument();
    expect(screen.getByText("Correct")).toBeInTheDocument();
  });
});
