import { beforeEach, describe, expect, it } from "vitest";
import { curriculumModules, flattenCurriculum } from "@/content/curriculum/path";
import {
  deriveCurriculumProgress,
  readActivityCompletion,
} from "@/lib/curriculum-sequencing/progress";
import { saveProgress } from "@/lib/progress/storage";
import { saveLabProgress } from "@/lib/terminal-lab/progress";
import { saveConsoleProgress } from "@/lib/mock-console/progress";

const activities = flattenCurriculum(curriculumModules);

beforeEach(() => {
  localStorage.clear();
});

describe("deriveCurriculumProgress", () => {
  it("makes only the first activity available when none are complete", () => {
    const progress = deriveCurriculumProgress(curriculumModules, () => false);

    expect(progress.completedCount).toBe(0);
    expect(progress.totalCount).toBe(27);
    expect(progress.activities.map(({ status }) => status)).toEqual([
      "available",
      ...Array.from({ length: 26 }, () => "locked"),
    ]);
  });

  it("unlocks exactly the next activity after a consecutive completed prefix", () => {
    const completedIds = new Set(activities.slice(0, 6).map(({ id }) => id));

    const progress = deriveCurriculumProgress(curriculumModules, (activity) =>
      completedIds.has(activity.id),
    );

    expect(progress.completedCount).toBe(6);
    expect(progress.activities.slice(0, 6).every(({ status }) => status === "completed")).toBe(
      true,
    );
    expect(progress.activities[6].status).toBe("available");
    expect(progress.activities.slice(7).every(({ status }) => status === "locked")).toBe(true);
  });

  it("shows out-of-order completion without unlocking past an earlier gap", () => {
    const completedIds = new Set(["os-fundamentals", "linux-cli-basics-lab"]);

    const progress = deriveCurriculumProgress(curriculumModules, (activity) =>
      completedIds.has(activity.id),
    );

    expect(progress.activities[0].status).toBe("available");
    expect(progress.activities[1].status).toBe("completed");
    expect(progress.activities[7].status).toBe("completed");
    expect(progress.activities[2].status).toBe("locked");
    expect(progress.activities[8].status).toBe("locked");
  });

  it("marks a fully completed path with no available or locked activities", () => {
    const progress = deriveCurriculumProgress(curriculumModules, () => true);

    expect(progress.completedCount).toBe(27);
    expect(progress.totalCount).toBe(27);
    expect(progress.activities.every(({ status }) => status === "completed")).toBe(true);
  });
});

describe("readActivityCompletion", () => {
  it("reads lesson, lab, and console completion from their existing stores", () => {
    saveProgress({
      lessonId: "networking-basics",
      completed: true,
      score: 1,
      questions: [],
      updatedAt: "2026-10-07T00:00:00.000Z",
    });
    saveLabProgress({
      labId: "linux-cli-basics-lab",
      currentStepIndex: 4,
      completed: true,
      updatedAt: "2026-10-07T00:00:00.000Z",
    });
    saveConsoleProgress({
      scenarioId: "identity-console-scenario",
      currentTaskIndex: 3,
      completed: true,
      updatedAt: "2026-10-07T00:00:00.000Z",
    });

    expect(readActivityCompletion(activities[0])).toBe(true);
    expect(readActivityCompletion(activities[7])).toBe(true);
    expect(readActivityCompletion(activities[15])).toBe(true);
  });

  it("treats missing, incomplete, and corrupted records as incomplete", () => {
    saveProgress({
      lessonId: "networking-basics",
      completed: false,
      score: 0,
      questions: [],
      updatedAt: "2026-10-07T00:00:00.000Z",
    });
    localStorage.setItem(
      "sysadmin-academy:terminal-lab-progress:linux-cli-basics-lab",
      "not json {{{",
    );

    expect(readActivityCompletion(activities[0])).toBe(false);
    expect(readActivityCompletion(activities[7])).toBe(false);
    expect(readActivityCompletion(activities[15])).toBe(false);
  });
});
