import type { Quiz } from "@/types/curriculum";

export const itsmTicketLifecycleQuiz: Quiz = {
  id: "itsm-ticket-lifecycle-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "What's the first thing a support agent should do with a newly arrived ticket?",
      choices: [
        { id: "a", text: "Triage it — assess its priority and category" },
        { id: "b", text: "Immediately close it" },
        { id: "c", text: "Escalate every ticket regardless of complexity" },
        { id: "d", text: "Ignore it until someone complains again" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "What's the term for handing a ticket to a more senior or specialized team when you can't resolve it yourself?",
      acceptedAnswers: ["escalation", "escalate", "escalating"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "Before closing a resolved ticket, what should you typically record?",
      choices: [
        { id: "a", text: "The resolution — what was actually done to fix it" },
        { id: "b", text: "Nothing, just close it silently" },
        { id: "c", text: "The customer's home address" },
        { id: "d", text: "A randomly generated ticket number" },
      ],
      correctChoiceId: "a",
    },
  ],
};
