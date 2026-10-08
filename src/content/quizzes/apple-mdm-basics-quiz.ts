import type { Quiz } from "@/types/curriculum";

export const appleMdmBasicsQuiz: Quiz = {
  id: "apple-mdm-basics-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "What does MDM let an administrator do with enrolled devices?",
      choices: [
        { id: "a", text: "Configure, secure, and monitor them remotely" },
        { id: "b", text: "Physically repair their hardware" },
        { id: "c", text: "Design their app icons" },
        { id: "d", text: "Replace the need for a device password" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "What's the term for registering a device with MDM so it can be managed?",
      acceptedAnswers: ["enrollment", "enroll", "device enrollment", "enrolling"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "A managed device is reported lost or stolen. What's the appropriate MDM action to protect company data?",
      choices: [
        { id: "a", text: "Remote lock (or wipe) the device" },
        { id: "b", text: "Ignore it until it's found" },
        { id: "c", text: "Email the user to ask them nicely to return it" },
        { id: "d", text: "Delete the user's directory account" },
      ],
      correctChoiceId: "a",
    },
  ],
};
