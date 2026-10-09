import type { Quiz } from "@/types/curriculum";

export const phishingSocialEngineeringQuiz: Quiz = {
  id: "phishing-social-engineering-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "Phishing primarily attacks:",
      choices: [
        { id: "a", text: "A software vulnerability" },
        { id: "b", text: "The person, by tricking them into acting against their own interest" },
        { id: "c", text: "The network firewall" },
        { id: "d", text: "The physical hardware of a device" },
      ],
      correctChoiceId: "b",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "What's the term for phishing by text message?",
      acceptedAnswers: ["smishing"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "A coworker reports they clicked a suspicious link. What's the right first response?",
      choices: [
        { id: "a", text: "Tell them not to report it next time to avoid alarming others" },
        { id: "b", text: "Ignore it unless something visibly breaks" },
        { id: "c", text: "Thank them for reporting it, then change the affected password and check for compromise" },
        { id: "d", text: "Immediately disable their entire network access without investigation" },
      ],
      correctChoiceId: "c",
    },
  ],
};
