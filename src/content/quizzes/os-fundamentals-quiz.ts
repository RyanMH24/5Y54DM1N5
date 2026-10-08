import type { Quiz } from "@/types/curriculum";

export const osFundamentalsQuiz: Quiz = {
  id: "os-fundamentals-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "What is the primary job of an operating system?",
      choices: [
        { id: "a", text: "Manage hardware resources and provide services to running programs" },
        { id: "b", text: "Design and host websites" },
        { id: "c", text: "Store passwords in plain text for convenience" },
        { id: "d", text: "Replace the need for physical hardware" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "What do we call a running instance of a program, with its own allocated memory and resources?",
      acceptedAnswers: ["process", "a process"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "Which of these is part of a computer's filesystem hierarchy?",
      choices: [
        { id: "a", text: "A directory" },
        { id: "b", text: "A subnet" },
        { id: "c", text: "A ticket queue" },
        { id: "d", text: "An SLA" },
      ],
      correctChoiceId: "a",
    },
  ],
};
