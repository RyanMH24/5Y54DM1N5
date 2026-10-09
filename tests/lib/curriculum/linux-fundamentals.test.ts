import { describe, expect, it } from "vitest";
import { loadLesson } from "@/lib/curriculum/load";
import { getLabById } from "@/lib/terminal-lab/load";
import { getTermById } from "@/lib/glossary/load";

const lessonIds = ["linux-cli-basics", "linux-users-permissions", "linux-package-management"];

describe("linux-fundamentals lessons", () => {
  it.each(lessonIds)("%s loads with valid frontmatter and a resolvable quiz", (lessonId) => {
    const { lesson, quiz, body } = loadLesson(lessonId);

    expect(lesson.id).toBe(lessonId);
    expect(lesson.moduleId).toBe("linux-fundamentals");
    expect(lesson.title.length).toBeGreaterThan(0);
    expect(quiz.id).toBe(lesson.quizId);
    expect(quiz.questions.length).toBeGreaterThanOrEqual(2);
    expect(body).toContain(`<Quiz id="${lesson.quizId}" />`);
  });

  it("orders the three lessons 1 through 3 within the module", () => {
    const orders = lessonIds.map((id) => loadLesson(id).lesson.order).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3]);
  });

  it("the first lesson links to its paired lab, which exists", () => {
    const { body } = loadLesson("linux-cli-basics");
    expect(body).toContain("/labs/linux-cli-basics-lab");
    expect(getLabById("linux-cli-basics-lab")).not.toBeNull();
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
