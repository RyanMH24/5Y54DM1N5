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
  "linux-cli-basics-lab",
  "powershell-basics",
  "powershell-basics-lab",
  "identity-access-basics",
  "identity-console-scenario",
  "apple-mdm-basics",
  "device-console-scenario",
  "itsm-ticket-lifecycle",
  "ticket-console-scenario",
];

describe("curriculum catalog", () => {
  it("declares the approved four-module, six-week path", () => {
    expect(
      curriculumModules.map(({ id, title, schedule }) => ({ id, title, schedule })),
    ).toEqual([
      { id: "core-fundamentals", title: "Core Fundamentals", schedule: "Week 1" },
      { id: "linux-powershell", title: "Linux & PowerShell", schedule: "Weeks 2–3" },
      {
        id: "identity-device-mgmt",
        title: "Identity & Device Management",
        schedule: "Weeks 4–5",
      },
      { id: "itsm-ticketing", title: "ITSM & Ticketing", schedule: "Week 6" },
    ]);
  });

  it("contains all 14 real activities once in the approved order", () => {
    const activities = flattenCurriculum(curriculumModules);

    expect(activities.map((activity) => activity.id)).toEqual(expectedActivityIds);
    expect(new Set(activities.map((activity) => activity.id)).size).toBe(14);
    expect(new Set(activities.map((activity) => activity.href)).size).toBe(14);
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
