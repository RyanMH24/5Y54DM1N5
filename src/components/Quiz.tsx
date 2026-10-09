"use client";

import { useState, type FormEvent } from "react";
import type { Quiz as QuizData } from "@/types/curriculum";
import { gradeQuiz, type QuizResult } from "@/lib/quiz/grade";
import { QuizQuestion } from "./QuizQuestion";
import { Sparkle } from "./Sparkle";

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

  const isPerfect = result !== null && result.correctCount === result.totalQuestions;

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        Check your understanding
      </p>
      {quiz.questions.map((question) => (
        <QuizQuestion
          key={question.id}
          question={question}
          value={answers[question.id] ?? ""}
          onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
          result={result?.results.find((r) => r.questionId === question.id)}
        />
      ))}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" className="btn-game">
          Submit
        </button>
        {result && (
          <p
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
              isPerfect
                ? "bg-[var(--success-soft)] text-[var(--success)]"
                : "text-[var(--text)]"
            }`}
            style={isPerfect ? { boxShadow: "0 0 14px 1px var(--node-done-glow)" } : undefined}
          >
            {isPerfect && <Sparkle className="h-4 w-4" />}
            Score: {result.correctCount}/{result.totalQuestions}
          </p>
        )}
      </div>
    </form>
  );
}
