import type { Quiz } from "@/types/curriculum";

export const powershellScriptingBasicsQuiz: Quiz = {
  id: "powershell-scripting-basics-quiz",
  questions: [
    {
      id: "q1",
      type: "fill-in-blank",
      prompt: "What symbol does a PowerShell variable name start with?",
      acceptedAnswers: ["$"],
    },
    {
      id: "q2",
      type: "multiple-choice",
      prompt: "Which keyword runs a block of code once for every item in a collection?",
      choices: [
        { id: "a", text: "if" },
        { id: "b", text: "foreach" },
        { id: "c", text: "switch" },
        { id: "d", text: "try" },
      ],
      correctChoiceId: "b",
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "Why do you run a local script as `.\\script.ps1` instead of just `script.ps1`?",
      choices: [
        { id: "a", text: "It runs faster with the prefix" },
        {
          id: "b",
          text: "So PowerShell doesn't mistake it for a system command of the same name",
        },
        { id: "c", text: "It's required to grant administrator privileges" },
        { id: "d", text: "It only matters on Linux" },
      ],
      correctChoiceId: "b",
    },
  ],
};
