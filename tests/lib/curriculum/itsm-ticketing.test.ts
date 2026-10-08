import { describe, expect, it } from "vitest";
import { loadLesson } from "@/lib/curriculum/load";
import { getScenarioById } from "@/lib/mock-console/load";

describe("itsm-ticketing lesson", () => {
  it("loads with valid frontmatter and a resolvable quiz", () => {
    const { lesson, quiz, body } = loadLesson("itsm-ticket-lifecycle");

    expect(lesson.id).toBe("itsm-ticket-lifecycle");
    expect(lesson.moduleId).toBe("itsm-ticketing");
    expect(lesson.order).toBe(1);
    expect(quiz.id).toBe(lesson.quizId);
    expect(quiz.questions.length).toBeGreaterThanOrEqual(2);
    expect(body).toContain(`<Quiz id="${lesson.quizId}" />`);
  });

  it("links to its paired scenario, which exists", () => {
    const { body } = loadLesson("itsm-ticket-lifecycle");
    expect(body).toContain("/consoles/ticket-console-scenario");
    expect(getScenarioById("ticket-console-scenario")).not.toBeNull();
  });
});
