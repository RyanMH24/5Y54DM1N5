import type { Quiz } from "@/types/curriculum";

export const sampleQuiz: Quiz = {
  id: "sample-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "Which PowerShell cmdlet lists running processes?",
      choices: [
        { id: "a", text: "Get-Process" },
        { id: "b", text: "Get-Service" },
        { id: "c", text: "Get-Item" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "What is the short alias for Get-Process?",
      acceptedAnswers: ["gps"],
    },
  ],
};
