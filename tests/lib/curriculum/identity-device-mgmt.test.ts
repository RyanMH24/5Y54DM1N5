import { describe, expect, it } from "vitest";
import { loadLesson } from "@/lib/curriculum/load";
import { getScenarioById } from "@/lib/mock-console/load";

const lessonToScenarioId: Record<string, string> = {
  "identity-access-basics": "identity-console-scenario",
  "apple-mdm-basics": "device-console-scenario",
};

describe("identity-device-mgmt lessons", () => {
  it.each(Object.keys(lessonToScenarioId))(
    "%s loads with valid frontmatter and a resolvable quiz",
    (lessonId) => {
      const { lesson, quiz, body } = loadLesson(lessonId);

      expect(lesson.id).toBe(lessonId);
      expect(lesson.moduleId).toBe("identity-device-mgmt");
      expect(lesson.title.length).toBeGreaterThan(0);
      expect(quiz.id).toBe(lesson.quizId);
      expect(quiz.questions.length).toBeGreaterThanOrEqual(2);
      expect(body).toContain(`<Quiz id="${lesson.quizId}" />`);
    },
  );

  it("orders the two lessons 1 and 2 within the module", () => {
    const orders = Object.keys(lessonToScenarioId)
      .map((id) => loadLesson(id).lesson.order)
      .sort((a, b) => a - b);
    expect(orders).toEqual([1, 2]);
  });

  it("each lesson links to its paired scenario, which exists", () => {
    for (const [lessonId, scenarioId] of Object.entries(lessonToScenarioId)) {
      const { body } = loadLesson(lessonId);
      expect(body).toContain(`/consoles/${scenarioId}`);
      expect(getScenarioById(scenarioId)).not.toBeNull();
    }
  });
});
