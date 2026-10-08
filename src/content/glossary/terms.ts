import type { GlossaryTerm } from "@/types/glossary";

export const terms: GlossaryTerm[] = [
  {
    id: "sso",
    term: "SSO",
    acronymFor: "Single Sign-On",
    definition:
      "An authentication scheme that lets a user log in once and gain access to multiple independent systems without re-entering credentials.",
  },
  {
    id: "mdm",
    term: "MDM",
    acronymFor: "Mobile Device Management",
    definition:
      "Software used to enroll, configure, secure, and monitor laptops, phones, and tablets across an organization.",
  },
  {
    id: "sla",
    term: "SLA",
    acronymFor: "Service Level Agreement",
    definition:
      "A commitment between a support team and its users defining expected response and resolution times for issues.",
  },
  {
    id: "escalation",
    term: "Escalation",
    definition:
      "Passing a ticket or incident to a more senior or specialized team when it can't be resolved at the current support tier.",
  },
  {
    id: "ticket-queue",
    term: "Ticket Queue",
    definition:
      "The ordered list of open support tickets waiting to be triaged, worked, or escalated.",
  },
  {
    id: "ad",
    term: "AD",
    acronymFor: "Active Directory",
    definition:
      "Microsoft's directory service for managing users, computers, and group policy across a Windows network.",
  },
  {
    id: "gpo",
    term: "GPO",
    acronymFor: "Group Policy Object",
    definition:
      "A collection of settings in Active Directory that enforces configuration (security, software, desktop behavior) across a set of users or computers.",
  },
  {
    id: "endpoint",
    term: "Endpoint",
    definition:
      "Any device — laptop, desktop, phone, server — that connects to and communicates over a network.",
  },
];
