import type { MockConsoleScenario } from "@/types/mock-console";

export const ticketConsoleScenario: MockConsoleScenario = {
  id: "ticket-console-scenario",
  title: "Ticket Console — Guided Scenario",
  productName: "Ticket Console",
  sections: [
    {
      id: "tickets",
      label: "Tickets",
      records: [
        {
          id: "ticket-101",
          title: "Ticket #101 — Printer offline, 3rd floor",
          fields: {
            priority: "Unset",
            category: "Unset",
            assignedTeam: "Tier 1 Support",
            status: "Open",
            resolution: "None",
          },
        },
        {
          id: "ticket-102",
          title: "Ticket #102 — Password reset request",
          fields: {
            priority: "Low",
            category: "Account Access",
            assignedTeam: "Tier 1 Support",
            status: "Open",
            resolution: "None",
          },
        },
      ],
    },
  ],
  actions: [
    {
      id: "triage-101",
      label: "Triage Ticket",
      sectionId: "tickets",
      recordId: "ticket-101",
      updates: { priority: "High", category: "Hardware" },
    },
    {
      id: "escalate-101",
      label: "Escalate to Network Engineering",
      sectionId: "tickets",
      recordId: "ticket-101",
      updates: { assignedTeam: "Network Engineering", status: "Escalated" },
    },
    {
      id: "close-101",
      label: "Close Ticket",
      sectionId: "tickets",
      recordId: "ticket-101",
      updates: { status: "Closed", resolution: "Replaced faulty print server" },
    },
    {
      id: "triage-102",
      label: "Triage Ticket",
      sectionId: "tickets",
      recordId: "ticket-102",
      updates: { priority: "Low", category: "Account Access" },
    },
  ],
  tasks: [
    {
      id: "task-triage-101",
      instructions:
        "Ticket #101 (printer offline, 3rd floor) just came in uncategorized. Triage it — assess its priority and category.",
      expectedActionId: "triage-101",
      successMessage: "Ticket #101 has been triaged: High priority, Hardware.",
      fallbackMessage:
        "That doesn't triage the ticket. Select Ticket #101 and choose Triage Ticket.",
    },
    {
      id: "task-escalate-101",
      instructions:
        "Ticket #101 needs hands-on hardware work Tier 1 Support can't do. Escalate it to Network Engineering.",
      expectedActionId: "escalate-101",
      successMessage: "Ticket #101 has been escalated to Network Engineering.",
      fallbackMessage:
        "That's not it. Select Ticket #101 and choose Escalate to Network Engineering.",
    },
    {
      id: "task-close-101",
      instructions:
        "Network Engineering has resolved the issue — the faulty print server was replaced. Close Ticket #101.",
      expectedActionId: "close-101",
      successMessage: "Ticket #101 has been closed: resolution recorded.",
      fallbackMessage: "That doesn't close the ticket. Select Ticket #101 and choose Close Ticket.",
    },
  ],
};
