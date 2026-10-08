import type { Quiz } from "@/types/curriculum";
import { sampleQuiz } from "./sample-quiz";
import { networkingBasicsQuiz } from "./networking-basics-quiz";
import { osFundamentalsQuiz } from "./os-fundamentals-quiz";
import { hardwareTroubleshootingQuiz } from "./hardware-troubleshooting-quiz";
import { terminologyQuiz } from "./terminology-quiz";
import { linuxCliBasicsQuiz } from "./linux-cli-basics-quiz";
import { powershellBasicsQuiz } from "./powershell-basics-quiz";
import { identityAccessBasicsQuiz } from "./identity-access-basics-quiz";
import { appleMdmBasicsQuiz } from "./apple-mdm-basics-quiz";

export const quizzes: Record<string, Quiz> = {
  [sampleQuiz.id]: sampleQuiz,
  [networkingBasicsQuiz.id]: networkingBasicsQuiz,
  [osFundamentalsQuiz.id]: osFundamentalsQuiz,
  [hardwareTroubleshootingQuiz.id]: hardwareTroubleshootingQuiz,
  [terminologyQuiz.id]: terminologyQuiz,
  [linuxCliBasicsQuiz.id]: linuxCliBasicsQuiz,
  [powershellBasicsQuiz.id]: powershellBasicsQuiz,
  [identityAccessBasicsQuiz.id]: identityAccessBasicsQuiz,
  [appleMdmBasicsQuiz.id]: appleMdmBasicsQuiz,
};
