import type { Quiz } from "@/types/curriculum";

export const identityAccessBasicsQuiz: Quiz = {
  id: "identity-access-basics-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "What does SSO let a user do?",
      choices: [
        { id: "a", text: "Log in once and access every system they're authorized for" },
        { id: "b", text: "Share one password across every employee" },
        { id: "c", text: "Bypass authentication entirely" },
        { id: "d", text: "Store passwords in plain text for convenience" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "What's the term for creating a new user's account and granting their initial access?",
      acceptedAnswers: ["provisioning", "provision", "user provisioning"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "A directory service like AD or Entra ID is best described as:",
      choices: [
        { id: "a", text: "The source of truth for who a user is and what groups they belong to" },
        { id: "b", text: "A type of firewall" },
        { id: "c", text: "A support ticket queue" },
        { id: "d", text: "A backup system" },
      ],
      correctChoiceId: "a",
    },
  ],
};
