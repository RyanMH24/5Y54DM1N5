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
    id: "linux-fundamentals",
    title: "Linux",
    schedule: "Week 2",
    activities: [
      {
        id: "linux-cli-basics",
        kind: "lesson",
        title: "Linux CLI Fundamentals",
        href: "/lessons/linux-cli-basics",
      },
      {
        id: "linux-users-permissions",
        kind: "lesson",
        title: "Linux Users & Permissions",
        href: "/lessons/linux-users-permissions",
      },
      {
        id: "linux-package-management",
        kind: "lesson",
        title: "Linux Package Management",
        href: "/lessons/linux-package-management",
      },
      {
        id: "linux-cli-basics-lab",
        kind: "lab",
        title: "Linux CLI Lab",
        href: "/labs/linux-cli-basics-lab",
      },
      {
        id: "linux-console-scenario",
        kind: "console",
        title: "Linux Console Scenario",
        href: "/consoles/linux-console-scenario",
      },
    ],
  },
  {
    id: "powershell-fundamentals",
    title: "PowerShell",
    schedule: "Week 3",
    activities: [
      {
        id: "powershell-basics",
        kind: "lesson",
        title: "PowerShell Fundamentals",
        href: "/lessons/powershell-basics",
      },
      {
        id: "powershell-scripting-basics",
        kind: "lesson",
        title: "PowerShell Scripting Basics",
        href: "/lessons/powershell-scripting-basics",
      },
      {
        id: "powershell-ad-user-management",
        kind: "lesson",
        title: "Managing AD Users with PowerShell",
        href: "/lessons/powershell-ad-user-management",
      },
      {
        id: "powershell-basics-lab",
        kind: "lab",
        title: "PowerShell Lab",
        href: "/labs/powershell-basics-lab",
      },
      {
        id: "ad-console-scenario",
        kind: "console",
        title: "AD Console Scenario",
        href: "/consoles/ad-console-scenario",
      },
    ],
  },
  {
    id: "identity-device-mgmt",
    title: "Identity & Device Management",
    schedule: "Week 4",
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
    id: "security-fundamentals",
    title: "Security Fundamentals",
    schedule: "Week 5",
    activities: [
      {
        id: "security-access-basics",
        kind: "lesson",
        title: "Security & Access Basics",
        href: "/lessons/security-access-basics",
      },
      {
        id: "phishing-social-engineering",
        kind: "lesson",
        title: "Phishing & Social Engineering",
        href: "/lessons/phishing-social-engineering",
      },
      {
        id: "endpoint-security-basics",
        kind: "lesson",
        title: "Endpoint Security Basics",
        href: "/lessons/endpoint-security-basics",
      },
      {
        id: "security-console-scenario",
        kind: "console",
        title: "Security Console Scenario",
        href: "/consoles/security-console-scenario",
      },
    ],
  },
  {
    id: "cloud-backup-itsm",
    title: "Cloud, Backup & ITSM",
    schedule: "Week 6",
    activities: [
      {
        id: "cloud-virtualization-basics",
        kind: "lesson",
        title: "Cloud & Virtualization Basics",
        href: "/lessons/cloud-virtualization-basics",
      },
      {
        id: "backup-disaster-recovery-basics",
        kind: "lesson",
        title: "Backup & Disaster Recovery Basics",
        href: "/lessons/backup-disaster-recovery-basics",
      },
      {
        id: "cloud-backup-console-scenario",
        kind: "console",
        title: "Cloud Console Scenario",
        href: "/consoles/cloud-backup-console-scenario",
      },
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
