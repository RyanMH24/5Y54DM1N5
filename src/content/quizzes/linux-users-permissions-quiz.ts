import type { Quiz } from "@/types/curriculum";

export const linuxUsersPermissionsQuiz: Quiz = {
  id: "linux-users-permissions-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "`chmod 755 script.sh` gives the owner which permissions?",
      choices: [
        { id: "a", text: "Read, write, and execute" },
        { id: "b", text: "Read and write only" },
        { id: "c", text: "Read only" },
        { id: "d", text: "Execute only" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "Which command adds an existing user to a group without removing their other group memberships?",
      acceptedAnswers: ["usermod -aG", "usermod"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "Which command changes a file's owning user?",
      choices: [
        { id: "a", text: "chmod" },
        { id: "b", text: "chown" },
        { id: "c", text: "chgrp" },
        { id: "d", text: "passwd" },
      ],
      correctChoiceId: "b",
    },
  ],
};
