import { describe, expect, it } from "vitest";
import { loadLesson } from "@/lib/curriculum/load";
import { getTermById } from "@/lib/glossary/load";

const lessonIds = [
  "networking-basics",
  "os-fundamentals",
  "hardware-troubleshooting",
  "terminology",
];

describe("core-fundamentals lessons", () => {
  it.each(lessonIds)("%s loads with valid frontmatter and a resolvable quiz", (lessonId) => {
    const { lesson, quiz, body } = loadLesson(lessonId);

    expect(lesson.id).toBe(lessonId);
    expect(lesson.moduleId).toBe("core-fundamentals");
    expect(lesson.title.length).toBeGreaterThan(0);
    expect(lesson.summary.length).toBeGreaterThan(0);
    expect(quiz.id).toBe(lesson.quizId);
    expect(quiz.questions.length).toBeGreaterThanOrEqual(2);
    expect(body.length).toBeGreaterThan(0);
    expect(body).toContain(`<Quiz id="${lesson.quizId}" />`);
  });

  it("orders the four lessons 1 through 4 within the module", () => {
    const orders = lessonIds.map((id) => loadLesson(id).lesson.order).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3, 4]);
  });

  it("every glossary link in each lesson's body points to a term that exists", () => {
    const linkPattern = /\]\(\/glossary\/([a-z0-9-]+)\)/g;

    for (const lessonId of lessonIds) {
      const { body } = loadLesson(lessonId);
      const linkedIds = [...body.matchAll(linkPattern)].map((match) => match[1]);

      expect(linkedIds.length).toBeGreaterThan(0);
      for (const id of linkedIds) {
        expect(getTermById(id), `${lessonId} links to missing glossary term "${id}"`).not.toBeNull();
      }
    }
  });
});
