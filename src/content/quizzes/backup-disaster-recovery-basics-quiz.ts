import type { Quiz } from "@/types/curriculum";

export const backupDisasterRecoveryBasicsQuiz: Quiz = {
  id: "backup-disaster-recovery-basics-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "An incremental backup copies:",
      choices: [
        { id: "a", text: "Everything, every time" },
        { id: "b", text: "Only what changed since the last backup of any kind" },
        { id: "c", text: "Only what changed since the last full backup" },
        { id: "d", text: "Nothing — it's a reference to the previous backup" },
      ],
      correctChoiceId: "b",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "In the 3-2-1 backup rule, how many copies should be stored offsite?",
      acceptedAnswers: ["1", "one"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "RPO measures:",
      choices: [
        { id: "a", text: "How long a system can be down before it's unacceptable" },
        { id: "b", text: "How much data loss, in time, is acceptable since the last good backup" },
        { id: "c", text: "How many backup copies exist" },
        { id: "d", text: "How fast the backup software runs" },
      ],
      correctChoiceId: "b",
    },
  ],
};
