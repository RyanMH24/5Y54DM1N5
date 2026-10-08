import type {
  CurriculumActivity,
  CurriculumModule,
} from "@/types/curriculum-sequencing";

export const curriculumModules = [
  {
    id: "core-fundamentals",
    title: "Core Fundamentals",
    schedule: "Week 1",
    activities: [
      {
        id: "networking-basics",
        kind: "lesson",
        title: "Networking Basics",
        href: "/lessons/networking-basics",
      },
      {
        id: "os-fundamentals",
        kind: "lesson",
        title: "OS Fundamentals",
        href: "/lessons/os-fundamentals",
      },
      {
        id: "hardware-troubleshooting",
        kind: "lesson",
        title: "Hardware & Troubleshooting",
        href: "/lessons/hardware-troubleshooting",
      },
      {
        id: "terminology",
        kind: "lesson",
        title: "Sysadmin Terminology",
        href: "/lessons/terminology",
      },
    ],
  },
  {
    id: "linux-powershell",
    title: "Linux & PowerShell",
    schedule: "Weeks 2–3",
    activities: [
      {
        id: "linux-cli-basics",
        kind: "lesson",
        title: "Linux CLI Fundamentals",
        href: "/lessons/linux-cli-basics",
      },
      {
        id: "linux-cli-basics-lab",
        kind: "lab",
        title: "Linux CLI Lab",
        href: "/labs/linux-cli-basics-lab",
      },
      {
        id: "powershell-basics",
        kind: "lesson",
        title: "PowerShell Fundamentals",
        href: "/lessons/powershell-basics",
      },
      {
        id: "powershell-basics-lab",
        kind: "lab",
        title: "PowerShell Lab",
        href: "/labs/powershell-basics-lab",
      },
    ],
  },
  {
    id: "identity-device-mgmt",
    title: "Identity & Device Management",
    schedule: "Weeks 4–5",
    activities: [
      {
        id: "identity-access-basics",
        kind: "lesson",
        title: "Identity & Access Fundamentals",
        href: "/lessons/identity-access-basics",
      },
      {
        id: "identity-console-scenario",
        kind: "console",
        title: "Identity Console Scenario",
        href: "/consoles/identity-console-scenario",
      },
      {
        id: "apple-mdm-basics",
        kind: "lesson",
        title: "Apple MDM Fundamentals",
        href: "/lessons/apple-mdm-basics",
      },
      {
        id: "device-console-scenario",
        kind: "console",
        title: "Device Console Scenario",
        href: "/consoles/device-console-scenario",
      },
    ],
  },
  {
    id: "itsm-ticketing",
    title: "ITSM & Ticketing",
    schedule: "Week 6",
    activities: [
      {
        id: "itsm-ticket-lifecycle",
        kind: "lesson",
        title: "The Ticket Lifecycle",
        href: "/lessons/itsm-ticket-lifecycle",
      },
      {
        id: "ticket-console-scenario",
        kind: "console",
        title: "Ticket Console Scenario",
        href: "/consoles/ticket-console-scenario",
      },
    ],
  },
] as const satisfies readonly CurriculumModule[];

export function flattenCurriculum(
  modules: readonly CurriculumModule[],
): CurriculumActivity[] {
  return modules.flatMap((module) => module.activities);
}
