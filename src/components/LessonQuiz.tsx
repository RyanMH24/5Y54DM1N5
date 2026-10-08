"use client";

import { useState, useSyncExternalStore } from "react";
import type { ProgressRecord, Quiz as QuizData } from "@/types/curriculum";
import type { QuizResult } from "@/lib/quiz/grade";
import { loadProgress, saveProgress } from "@/lib/progress/storage";
import { Quiz } from "./Quiz";

interface LessonQuizProps {
  lessonId: string;
  quiz: QuizData;
}

function subscribeToNothing() {
  return () => {};
}

function getServerProgressSnapshot() {
  return null;
}

export function LessonQuiz({ lessonId, quiz }: LessonQuizProps) {
  const storedProgress = useSyncExternalStore(
    subscribeToNothing,
    () => loadProgress(lessonId),
    getServerProgressSnapshot,
  );
  const [submittedProgress, setSubmittedProgress] = useState<ProgressRecord | null>(null);
  const progress = submittedProgress ?? storedProgress;

  function handleSubmit(result: QuizResult, answers: Record<string, string>) {
    const record: ProgressRecord = {
      lessonId,
      completed: true,
      score: result.score,
      questions: result.results.map((questionResult) => ({
        questionId: questionResult.questionId,
        lastAnswer: answers[questionResult.questionId] ?? "",
        correct: questionResult.correct,
      })),
      updatedAt: new Date().toISOString(),
    };
    saveProgress(record);
    setSubmittedProgress(record);
  }

  return (
    <div>
      {progress?.completed && (
        <p>
          Already completed — score {progress.questions.filter((q) => q.correct).length}/
          {progress.questions.length}
        </p>
      )}
      <Quiz quiz={quiz} onSubmit={handleSubmit} />
    </div>
  );
}
