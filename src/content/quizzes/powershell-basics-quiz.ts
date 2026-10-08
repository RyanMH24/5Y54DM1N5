import type { Quiz } from "@/types/curriculum";

export const powershellBasicsQuiz: Quiz = {
  id: "powershell-basics-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "PowerShell cmdlets follow a naming convention of:",
      choices: [
        { id: "a", text: "Verb-Noun, like Get-Process" },
        { id: "b", text: "Noun-Verb, like Process-Get" },
        { id: "c", text: "All lowercase single words, like getprocess" },
        { id: "d", text: "Random abbreviations, like gprc" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "Which cmdlet lists currently running processes?",
      acceptedAnswers: ["Get-Process"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "Which symbol connects cmdlets so one's output becomes the next one's input?",
      choices: [
        { id: "a", text: "| (pipe)" },
        { id: "b", text: "& (ampersand)" },
        { id: "c", text: "; (semicolon)" },
        { id: "d", text: "# (hash)" },
      ],
      correctChoiceId: "a",
    },
  ],
};
