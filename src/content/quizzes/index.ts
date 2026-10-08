import type { Quiz } from "@/types/curriculum";
import { sampleQuiz } from "./sample-quiz";

export const quizzes: Record<string, Quiz> = {
  [sampleQuiz.id]: sampleQuiz,
};
