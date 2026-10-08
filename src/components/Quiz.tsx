"use client";

import { useState, type FormEvent } from "react";
import type { Quiz as QuizData } from "@/types/curriculum";
import { gradeQuiz, type QuizResult } from "@/lib/quiz/grade";
import { QuizQuestion } from "./QuizQuestion";

interface QuizProps {
  quiz: QuizData;
  onSubmit?: (result: QuizResult, answers: Record<string, string>) => void;
}

export function Quiz({ quiz, onSubmit }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const graded = gradeQuiz(quiz, answers);
    setResult(graded);
    onSubmit?.(graded, answers);
  }

  return (
    <form onSubmit={handleSubmit}>
      {quiz.questions.map((question) => (
        <QuizQuestion
          key={question.id}
          question={question}
          value={answers[question.id] ?? ""}
          onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
          result={result?.results.find((r) => r.questionId === question.id)}
        />
      ))}
      <button type="submit">Submit</button>
      {result && (
        <p>
          Score: {result.correctCount}/{result.totalQuestions}
        </p>
      )}
    </form>
  );
}
