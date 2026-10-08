import type { Quiz } from "@/types/curriculum";

export const linuxCliBasicsQuiz: Quiz = {
  id: "linux-cli-basics-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "Which command prints the current working directory?",
      choices: [
        { id: "a", text: "pwd" },
        { id: "b", text: "ls" },
        { id: "c", text: "cd" },
        { id: "d", text: "cat" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "Which command prints a text file's contents to the terminal?",
      acceptedAnswers: ["cat"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "Which command copies a file to a new location?",
      choices: [
        { id: "a", text: "cp" },
        { id: "b", text: "mv" },
        { id: "c", text: "rm" },
        { id: "d", text: "ps" },
      ],
      correctChoiceId: "a",
    },
  ],
};
