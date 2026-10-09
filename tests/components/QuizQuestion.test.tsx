import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuizQuestion } from "@/components/QuizQuestion";
import type { MultipleChoiceQuestion } from "@/types/curriculum";

const question: MultipleChoiceQuestion = {
  id: "q1",
  type: "multiple-choice",
  prompt: "Pick one",
  choices: [
    { id: "a", text: "Choice A" },
    { id: "b", text: "Choice B" },
    { id: "c", text: "Choice C" },
    { id: "d", text: "Choice D" },
  ],
  correctChoiceId: "a",
};

function renderedOrder() {
  return screen.getAllByRole("radio").map((input) => input.getAttribute("value"));
}

describe("QuizQuestion", () => {
  it("renders every choice exactly once regardless of order", () => {
    render(<QuizQuestion question={question} value="" onChange={() => {}} />);
    expect(new Set(renderedOrder())).toEqual(new Set(["a", "b", "c", "d"]));
  });

  it("shuffles the choice order instead of always rendering the data's original order", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
    try {
      render(<QuizQuestion question={question} value="" onChange={() => {}} />);
      expect(renderedOrder()).not.toEqual(["a", "b", "c", "d"]);
    } finally {
      randomSpy.mockRestore();
    }
  });

  it("keeps the shuffled order stable across re-renders of the same mounted question", () => {
    const { rerender } = render(
      <QuizQuestion question={question} value="" onChange={() => {}} />,
    );
    const firstOrder = renderedOrder();

    rerender(<QuizQuestion question={question} value="a" onChange={() => {}} />);
    expect(renderedOrder()).toEqual(firstOrder);
  });
});
