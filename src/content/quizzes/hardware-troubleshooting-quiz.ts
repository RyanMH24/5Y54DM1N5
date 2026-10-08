import type { Quiz } from "@/types/curriculum";

export const hardwareTroubleshootingQuiz: Quiz = {
  id: "hardware-troubleshooting-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "Which component is often called the computer's \"brain,\" executing instructions?",
      choices: [
        { id: "a", text: "CPU" },
        { id: "b", text: "Power supply" },
        { id: "c", text: "Monitor" },
        { id: "d", text: "Keyboard" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "What type of memory loses its contents when the computer powers off?",
      acceptedAnswers: ["RAM", "random access memory"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "When troubleshooting a reported problem, what's usually the best first step?",
      choices: [
        { id: "a", text: "Try to reproduce the problem and gather exact symptoms" },
        { id: "b", text: "Immediately reinstall the operating system" },
        { id: "c", text: "Replace all the hardware" },
        { id: "d", text: "Close the ticket and hope it resolves itself" },
      ],
      correctChoiceId: "a",
    },
  ],
};
