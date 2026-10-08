import type { MockConsoleScenario } from "@/types/mock-console";

export const identityConsoleScenario: MockConsoleScenario = {
  id: "identity-console-scenario",
  title: "Identity Console — Guided Scenario",
  productName: "Identity Console",
  sections: [
    {
      id: "users",
      label: "Users",
      records: [
        {
          id: "user-casey",
          title: "Casey Morgan",
          fields: {
            email: "casey.morgan@example.com",
            status: "Pending",
            appAccess: "None",
          },
        },
        {
          id: "user-riley",
          title: "Riley Chen",
          fields: {
            email: "riley.chen@example.com",
            status: "Active",
            appAccess: "CRM",
          },
        },
      ],
    },
  ],
  actions: [
    {
      id: "provision-casey",
      label: "Provision Account",
      sectionId: "users",
      recordId: "user-casey",
      updates: { status: "Active" },
    },
    {
      id: "assign-app-casey",
      label: "Assign App Access",
      sectionId: "users",
      recordId: "user-casey",
      updates: { appAccess: "CRM" },
    },
    {
      id: "deactivate-riley",
      label: "Deactivate Account",
      sectionId: "users",
      recordId: "user-riley",
      updates: { status: "Deactivated" },
    },
    {
      id: "assign-app-riley",
      label: "Assign App Access",
      sectionId: "users",
      recordId: "user-riley",
      updates: { appAccess: "CRM, Finance" },
    },
  ],
  tasks: [
    {
      id: "task-provision-casey",
      instructions:
        "Casey Morgan is a new hire starting today. Provision Casey Morgan's account.",
      expectedActionId: "provision-casey",
      successMessage: "Casey Morgan's account has been provisioned.",
      fallbackMessage:
        "That doesn't provision Casey Morgan's account. Select Casey Morgan's record and choose Provision Account.",
    },
    {
      id: "task-assign-casey",
      instructions:
        "Casey Morgan needs access to the CRM to do their job. Assign Casey Morgan app access.",
      expectedActionId: "assign-app-casey",
      successMessage: "Casey Morgan has been granted CRM access.",
      fallbackMessage:
        "That's not it. Select Casey Morgan's record and choose Assign App Access.",
    },
    {
      id: "task-deactivate-riley",
      instructions: "Riley Chen has left the company. Deactivate Riley Chen's account.",
      expectedActionId: "deactivate-riley",
      successMessage: "Riley Chen's account has been deactivated.",
      fallbackMessage:
        "That doesn't deactivate the account. Select Riley Chen's record and choose Deactivate Account.",
    },
  ],
};
