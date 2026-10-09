import type { Quiz } from "@/types/curriculum";

export const powershellAdUserManagementQuiz: Quiz = {
  id: "powershell-ad-user-management-quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: "Which cmdlet lists users in Active Directory?",
      choices: [
        { id: "a", text: "Get-ADUser" },
        { id: "b", text: "Get-LocalUser" },
        { id: "c", text: "Get-Process" },
        { id: "d", text: "New-ADUser" },
      ],
      correctChoiceId: "a",
    },
    {
      id: "q2",
      type: "fill-in-blank",
      prompt: "Which cmdlet blocks an account from authenticating without deleting it?",
      acceptedAnswers: ["Disable-ADUser", "disable-aduser"],
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "Why script bulk account operations with PowerShell instead of a GUI console?",
      choices: [
        { id: "a", text: "The GUI console doesn't support Active Directory" },
        { id: "b", text: "Scripts are more secure by default" },
        {
          id: "c",
          text: "Repetitive, manual clicking doesn't scale to dozens or hundreds of accounts",
        },
        { id: "d", text: "PowerShell is required for any AD change" },
      ],
      correctChoiceId: "c",
    },
  ],
};
