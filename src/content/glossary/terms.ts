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
  {
    id: "ip-address",
    term: "IP Address",
    acronymFor: "Internet Protocol Address",
    definition:
      "A numeric label assigned to a device on a network, used to identify it and route traffic to it — like a mailing address for data.",
  },
  {
    id: "dns",
    term: "DNS",
    acronymFor: "Domain Name System",
    definition:
      "The system that translates human-readable names (like example.com) into the IP addresses computers use to find each other.",
  },
  {
    id: "mfa",
    term: "MFA",
    acronymFor: "Multi-Factor Authentication",
    definition:
      "A login method that requires at least two kinds of proof of identity — like a password plus a one-time code — so a single stolen credential isn't enough to get in.",
  },
  {
    id: "least-privilege",
    term: "Least Privilege",
    definition:
      "The principle of giving a user or system only the access it needs to do its job, and nothing more.",
  },
  {
    id: "phishing",
    term: "Phishing",
    definition:
      "A social-engineering attack that tricks someone into revealing credentials or installing malware, usually via a fake email, text, or website impersonating something trustworthy.",
  },
  {
    id: "hypervisor",
    term: "Hypervisor",
    definition:
      "Software that creates and runs virtual machines by sharing one physical machine's CPU, memory, and storage among them.",
  },
  {
    id: "vm",
    term: "VM",
    acronymFor: "Virtual Machine",
    definition:
      "A software-emulated computer running on a hypervisor, isolated from other VMs sharing the same physical hardware.",
  },
  {
    id: "rto",
    term: "RTO",
    acronymFor: "Recovery Time Objective",
    definition:
      "The maximum acceptable time to restore a system after an outage before the business impact becomes unacceptable.",
  },
  {
    id: "rpo",
    term: "RPO",
    acronymFor: "Recovery Point Objective",
    definition:
      "The maximum acceptable amount of data loss, measured in time since the last backup — i.e. how much work you can afford to redo.",
  },
  {
    id: "patch-management",
    term: "Patch Management",
    definition:
      "The ongoing process of applying vendor updates to fix security vulnerabilities and bugs across an organization's systems.",
  },
];
