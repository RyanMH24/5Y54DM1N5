import type { Quiz } from "@/types/curriculum";

export const networkingBasicsQuiz: Quiz = {
  id: "networking-basics-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "Which of these is a valid IPv4 address?",
      choices: [
        { id: "a", text: "192.168.1.1" },
        { id: "b", text: "999.999.999.999" },
        { id: "c", text: "AB:CD:EF:12:34:56" },
        { id: "d", text: "localhost" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "What system translates a name like example.com into the IP address computers use to reach it?",
      acceptedAnswers: ["DNS", "Domain Name System"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "A subnet is best described as:",
      choices: [
        { id: "a", text: "A smaller, logically segmented portion of a larger network" },
        { id: "b", text: "A type of firewall appliance" },
        { id: "c", text: "A backup server" },
        { id: "d", text: "A wireless network's password" },
      ],
      correctChoiceId: "a",
    },
  ],
};
