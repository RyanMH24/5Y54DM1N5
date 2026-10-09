import type { Quiz } from "@/types/curriculum";

export const securityAccessBasicsQuiz: Quiz = {
  id: "security-access-basics-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "MFA protects an account mainly by:",
      choices: [
        { id: "a", text: "Making the password longer automatically" },
        { id: "b", text: "Requiring a second, different kind of proof of identity" },
        { id: "c", text: "Encrypting the account's data at rest" },
        { id: "d", text: "Blocking all login attempts from outside the office" },
      ],
      correctChoiceId: "b",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "What's the principle of giving an account only the access it needs for its job, and no more?",
      acceptedAnswers: ["least privilege"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "Why is reusing a password across multiple sites risky?",
      choices: [
        { id: "a", text: "It makes the password easier to guess" },
        { id: "b", text: "A breach at one unrelated site can compromise accounts everywhere else it was reused" },
        { id: "c", text: "Most sites block reused passwords anyway" },
        { id: "d", text: "It has no real security impact" },
      ],
      correctChoiceId: "b",
    },
  ],
};
