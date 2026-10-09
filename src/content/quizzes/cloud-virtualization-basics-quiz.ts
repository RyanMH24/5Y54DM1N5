import type { Quiz } from "@/types/curriculum";

export const cloudVirtualizationBasicsQuiz: Quiz = {
  id: "cloud-virtualization-basics-quiz",
  questions: [
    {
      id: "q1",
      type: "fill-in-blank",
      prompt: "What's the term for software that lets one physical machine run several isolated virtual computers at once?",
      acceptedAnswers: ["hypervisor"],
    },
    {
      id: "q2",
      type: "multiple-choice",
      prompt: "In IaaS, who manages the operating system?",
      choices: [
        { id: "a", text: "The cloud provider" },
        { id: "b", text: "The customer" },
        { id: "c", text: "Neither — IaaS has no OS" },
        { id: "d", text: "A third-party vendor" },
      ],
      correctChoiceId: "b",
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "Microsoft 365 and Salesforce are examples of:",
      choices: [
        { id: "a", text: "IaaS" },
        { id: "b", text: "PaaS" },
        { id: "c", text: "SaaS" },
        { id: "d", text: "A hypervisor" },
      ],
      correctChoiceId: "c",
    },
  ],
};
