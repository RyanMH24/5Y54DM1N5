import { describe, expect, it } from "vitest";
import { loadLesson } from "@/lib/curriculum/load";
import { getScenarioById } from "@/lib/mock-console/load";
import { getTermById } from "@/lib/glossary/load";

const lessonIds = [
  "cloud-virtualization-basics",
  "backup-disaster-recovery-basics",
  "itsm-ticket-lifecycle",
];

describe("cloud-backup-itsm lessons", () => {
  it.each(lessonIds)("%s loads with valid frontmatter and a resolvable quiz", (lessonId) => {
    const { lesson, quiz, body } = loadLesson(lessonId);

    expect(lesson.id).toBe(lessonId);
    expect(lesson.moduleId).toBe("cloud-backup-itsm");
    expect(lesson.title.length).toBeGreaterThan(0);
    expect(quiz.id).toBe(lesson.quizId);
    expect(quiz.questions.length).toBeGreaterThanOrEqual(2);
    expect(body).toContain(`<Quiz id="${lesson.quizId}" />`);
  });

  it("orders the three lessons 1 through 3 within the module", () => {
    const orders = lessonIds.map((id) => loadLesson(id).lesson.order).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3]);
  });

  it("the last lesson links to its paired scenario, which exists", () => {
    const { body } = loadLesson("itsm-ticket-lifecycle");
    expect(body).toContain("/consoles/ticket-console-scenario");
    expect(getScenarioById("ticket-console-scenario")).not.toBeNull();
  });

  it("every glossary link across the module's lessons points to a term that exists", () => {
    const linkPattern = /\]\(\/glossary\/([a-z0-9-]+)\)/g;
    const linkedIds = lessonIds.flatMap(
      (lessonId) => [...loadLesson(lessonId).body.matchAll(linkPattern)].map((match) => match[1]),
    );

    expect(linkedIds.length).toBeGreaterThan(0);
    for (const id of linkedIds) {
      expect(getTermById(id), `missing glossary term "${id}"`).not.toBeNull();
    }
  });
});
