import type { MockConsoleScenario } from "@/types/mock-console";

export const demoScenario: MockConsoleScenario = {
  id: "demo-scenario",
  title: "Directory Admin — Demo Scenario",
  productName: "Directory Admin",
  sections: [
    {
      id: "users",
      label: "Users",
      records: [
        {
          id: "user-jlee",
          title: "Jordan Lee",
          fields: { email: "jordan.lee@example.com", status: "Active", role: "Standard User" },
        },
        {
          id: "user-asmith",
          title: "Avery Smith",
          fields: { email: "avery.smith@example.com", status: "Active", role: "Standard User" },
        },
      ],
    },
  ],
  actions: [
    {
      id: "suspend-jlee",
      label: "Suspend Account",
      sectionId: "users",
      recordId: "user-jlee",
      updates: { status: "Suspended" },
    },
    {
      id: "suspend-asmith",
      label: "Suspend Account",
      sectionId: "users",
      recordId: "user-asmith",
      updates: { status: "Suspended" },
    },
    {
      id: "promote-jlee",
      label: "Promote to Administrator",
      sectionId: "users",
      recordId: "user-jlee",
      updates: { role: "Administrator" },
    },
    {
      id: "promote-asmith",
      label: "Promote to Administrator",
      sectionId: "users",
      recordId: "user-asmith",
      updates: { role: "Administrator" },
    },
    {
      id: "reset-password-jlee",
      label: "Reset Password",
      sectionId: "users",
      recordId: "user-jlee",
      updates: { status: "Password Reset Pending" },
    },
  ],
  tasks: [
    {
      id: "task-suspend-jlee",
      instructions:
        "Jordan Lee's account needs to be suspended immediately due to a reported security incident. Suspend Jordan Lee's account.",
      expectedActionId: "suspend-jlee",
      successMessage: "Jordan Lee's account has been suspended.",
      fallbackMessage:
        "That doesn't suspend Jordan Lee's account. Select Jordan Lee's record and choose Suspend Account.",
    },
    {
      id: "task-reset-jlee",
      instructions:
        "Jordan Lee has confirmed their identity with the help desk. Reset Jordan Lee's password so they can regain access.",
      expectedActionId: "reset-password-jlee",
      successMessage: "Jordan Lee's password has been reset.",
      fallbackMessage:
        "That's not the right action. Select Jordan Lee's record and choose Reset Password.",
    },
    {
      id: "task-promote-asmith",
      instructions:
        "Avery Smith has been promoted to team lead and needs administrator access. Promote Avery Smith to Administrator.",
      expectedActionId: "promote-asmith",
      successMessage: "Avery Smith has been promoted to Administrator.",
      fallbackMessage:
        "That's not it. Select Avery Smith's record and choose Promote to Administrator.",
    },
  ],
};
