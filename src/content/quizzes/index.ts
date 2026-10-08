import type { Quiz } from "@/types/curriculum";
import { sampleQuiz } from "./sample-quiz";
import { networkingBasicsQuiz } from "./networking-basics-quiz";
import { osFundamentalsQuiz } from "./os-fundamentals-quiz";
import { hardwareTroubleshootingQuiz } from "./hardware-troubleshooting-quiz";
import { terminologyQuiz } from "./terminology-quiz";

export const quizzes: Record<string, Quiz> = {
  [sampleQuiz.id]: sampleQuiz,
  [networkingBasicsQuiz.id]: networkingBasicsQuiz,
  [osFundamentalsQuiz.id]: osFundamentalsQuiz,
  [hardwareTroubleshootingQuiz.id]: hardwareTroubleshootingQuiz,
  [terminologyQuiz.id]: terminologyQuiz,
};
