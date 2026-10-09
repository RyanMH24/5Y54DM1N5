import { describe, expect, it } from "vitest";
import { curriculumModules, flattenCurriculum } from "@/content/curriculum/path";
import { loadLesson } from "@/lib/curriculum/load";
import { getLabById } from "@/lib/terminal-lab/load";
import { getScenarioById } from "@/lib/mock-console/load";

const expectedActivityIds = [
  "networking-basics",
  "os-fundamentals",
  "hardware-troubleshooting",
  "terminology",
  "linux-cli-basics",
  "linux-users-permissions",
  "linux-package-management",
  "linux-cli-basics-lab",
  "linux-console-scenario",
  "powershell-basics",
  "powershell-scripting-basics",
  "powershell-ad-user-management",
  "powershell-basics-lab",
  "ad-console-scenario",
  "identity-access-basics",
  "identity-console-scenario",
  "apple-mdm-basics",
  "device-console-scenario",
  "security-access-basics",
  "phishing-social-engineering",
  "endpoint-security-basics",
  "security-console-scenario",
  "cloud-virtualization-basics",
  "backup-disaster-recovery-basics",
  "cloud-backup-console-scenario",
  "itsm-ticket-lifecycle",
  "ticket-console-scenario",
];

describe("curriculum catalog", () => {
  it("declares the approved six-module, six-week path", () => {
    expect(
      curriculumModules.map(({ id, title, schedule }) => ({ id, title, schedule })),
    ).toEqual([
      { id: "core-fundamentals", title: "Core Fundamentals", schedule: "Week 1" },
      { id: "linux-fundamentals", title: "Linux", schedule: "Week 2" },
      { id: "powershell-fundamentals", title: "PowerShell", schedule: "Week 3" },
      {
        id: "identity-device-mgmt",
        title: "Identity & Device Management",
        schedule: "Week 4",
      },
      { id: "security-fundamentals", title: "Security Fundamentals", schedule: "Week 5" },
      { id: "cloud-backup-itsm", title: "Cloud, Backup & ITSM", schedule: "Week 6" },
    ]);
  });

  it("contains all 27 real activities once in the approved order", () => {
    const activities = flattenCurriculum(curriculumModules);

    expect(activities.map((activity) => activity.id)).toEqual(expectedActivityIds);
    expect(new Set(activities.map((activity) => activity.id)).size).toBe(27);
    expect(new Set(activities.map((activity) => activity.href)).size).toBe(27);
    expect(activities.map((activity) => activity.id)).not.toEqual(
      expect.arrayContaining(["sample-lesson", "sample-lab", "demo-scenario"]),
    );
  });

  it("resolves every activity through the loader for its declared kind", () => {
    for (const activity of flattenCurriculum(curriculumModules)) {
      if (activity.kind === "lesson") {
        expect(loadLesson(activity.id).lesson.id).toBe(activity.id);
      } else if (activity.kind === "lab") {
        expect(getLabById(activity.id)?.id).toBe(activity.id);
      } else {
        expect(getScenarioById(activity.id)?.id).toBe(activity.id);
      }
    }
  });
});
