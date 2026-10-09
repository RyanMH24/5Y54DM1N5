import type { Quiz } from "@/types/curriculum";

export const linuxPackageManagementQuiz: Quiz = {
  id: "linux-package-management-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "Which package manager is used on Debian and Ubuntu?",
      choices: [
        { id: "a", text: "apt" },
        { id: "b", text: "dnf" },
        { id: "c", text: "yum" },
        { id: "d", text: "brew" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "multiple-choice",
      prompt: "What does `sudo apt update` actually do?",
      choices: [
        { id: "a", text: "Installs every available update" },
        { id: "b", text: "Refreshes the list of available packages and versions" },
        { id: "c", text: "Removes unused packages" },
        { id: "d", text: "Restarts the package manager service" },
      ],
      correctChoiceId: "b",
    },
    {
      id: "q3",
      type: "fill-in-blank",
      prompt: "Which apt command removes a package AND its configuration files?",
      acceptedAnswers: ["apt purge", "purge"],
    },
  ],
};
