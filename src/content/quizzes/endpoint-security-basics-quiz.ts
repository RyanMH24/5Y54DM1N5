import type { Quiz } from "@/types/curriculum";

export const endpointSecurityBasicsQuiz: Quiz = {
  id: "endpoint-security-basics-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "How does EDR typically catch threats that traditional antivirus signatures would miss?",
      choices: [
        { id: "a", text: "By scanning files faster" },
        { id: "b", text: "By watching for suspicious behavior instead of matching known-bad signatures" },
        { id: "c", text: "By blocking all internet access" },
        { id: "d", text: "By requiring MFA on every login" },
      ],
      correctChoiceId: "b",
    },
    {
      id: "q2",
      type: "multiple-choice",
      prompt: "What does full-disk encryption protect against?",
      choices: [
        { id: "a", text: "Phishing emails" },
        { id: "b", text: "A lost or stolen device's data being read without the correct key" },
        { id: "c", text: "Outdated software vulnerabilities" },
        { id: "d", text: "Weak Wi-Fi passwords" },
      ],
      correctChoiceId: "b",
    },
    {
      id: "q3",
      type: "fill-in-blank",
      prompt: "What's the term for the ongoing process of applying vendor updates to fix known vulnerabilities?",
      acceptedAnswers: ["patch management", "patching"],
    },
  ],
};
