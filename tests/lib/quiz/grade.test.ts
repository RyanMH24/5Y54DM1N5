import { describe, expect, it } from "vitest";
import { gradeQuestion, gradeQuiz } from "@/lib/quiz/grade";
import type { FillInBlankQuestion, MultipleChoiceQuestion, Quiz } from "@/types/curriculum";

const mcQuestion: MultipleChoiceQuestion = {
  id: "q1",
  type: "multiple-choice",
  prompt: "Which cmdlet lists running processes?",
  choices: [
    { id: "a", text: "Get-Process" },
    { id: "b", text: "Get-Service" },
  ],
  correctChoiceId: "a",
};

const fibQuestion: FillInBlankQuestion = {
  id: "q2",
  type: "fill-in-blank",
  prompt: "What is the alias for Get-Process?",
  acceptedAnswers: ["gps"],
};

describe("gradeQuestion", () => {
  it("grades multiple-choice correct", () => {
    expect(gradeQuestion(mcQuestion, "a")).toEqual({ questionId: "q1", correct: true });
  });

  it("grades multiple-choice incorrect", () => {
    expect(gradeQuestion(mcQuestion, "b")).toEqual({ questionId: "q1", correct: false });
  });

  it("grades fill-in-blank correct on exact match", () => {
    expect(gradeQuestion(fibQuestion, "gps")).toEqual({ questionId: "q2", correct: true });
  });

  it("grades fill-in-blank correct ignoring case and surrounding whitespace", () => {
    expect(gradeQuestion(fibQuestion, "  GPS  ")).toEqual({ questionId: "q2", correct: true });
  });

  it("grades fill-in-blank correct with collapsed internal whitespace", () => {
    const question: FillInBlankQuestion = {
      ...fibQuestion,
      acceptedAnswers: ["get process"],
    };
    expect(gradeQuestion(question, "get   process")).toEqual({
      questionId: "q2",
      correct: true,
    });
  });

  it("grades fill-in-blank incorrect for wrong answer", () => {
    expect(gradeQuestion(fibQuestion, "get-service")).toEqual({
      questionId: "q2",
      correct: false,
    });
  });
});

describe("gradeQuiz", () => {
  const quiz: Quiz = { id: "quiz1", questions: [mcQuestion, fibQuestion] };

  it("returns per-question results and an overall score", () => {
    const result = gradeQuiz(quiz, { q1: "a", q2: "GPS" });
    expect(result).toEqual({
      quizId: "quiz1",
      results: [
        { questionId: "q1", correct: true },
        { questionId: "q2", correct: true },
      ],
      correctCount: 2,
      totalQuestions: 2,
      score: 1,
    });
  });

  it("scores a partially correct quiz", () => {
    const result = gradeQuiz(quiz, { q1: "b", q2: "gps" });
    expect(result.correctCount).toBe(1);
    expect(result.score).toBe(0.5);
  });

  it("treats a missing answer as incorrect rather than throwing", () => {
    const result = gradeQuiz(quiz, { q1: "a" });
    expect(result.results[1]).toEqual({ questionId: "q2", correct: false });
  });
});
