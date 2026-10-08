import type { Quiz } from "@/types/curriculum";

export const terminologyQuiz: Quiz = {
  id: "terminology-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "Which acronym describes letting a user log in once to access multiple systems?",
      choices: [
        { id: "a", text: "SSO" },
        { id: "b", text: "MDM" },
        { id: "c", text: "SLA" },
        { id: "d", text: "GPO" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "What's the term for passing a ticket to a more senior or specialized team when you can't resolve it yourself?",
      acceptedAnswers: ["escalation", "escalate", "escalating"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "AD is short for:",
      choices: [
        { id: "a", text: "Active Directory" },
        { id: "b", text: "Advanced Diagnostics" },
        { id: "c", text: "Automated Deployment" },
        { id: "d", text: "Admin Dashboard" },
      ],
      correctChoiceId: "a",
    },
  ],
};
