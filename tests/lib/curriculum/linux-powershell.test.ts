import { describe, expect, it } from "vitest";
import { loadLesson } from "@/lib/curriculum/load";
import { getLabById } from "@/lib/terminal-lab/load";

const lessonToLabId: Record<string, string> = {
  "linux-cli-basics": "linux-cli-basics-lab",
  "powershell-basics": "powershell-basics-lab",
};

describe("linux-powershell lessons", () => {
  it.each(Object.keys(lessonToLabId))(
    "%s loads with valid frontmatter and a resolvable quiz",
    (lessonId) => {
      const { lesson, quiz, body } = loadLesson(lessonId);

      expect(lesson.id).toBe(lessonId);
      expect(lesson.moduleId).toBe("linux-powershell");
      expect(lesson.title.length).toBeGreaterThan(0);
      expect(quiz.id).toBe(lesson.quizId);
      expect(quiz.questions.length).toBeGreaterThanOrEqual(2);
      expect(body).toContain(`<Quiz id="${lesson.quizId}" />`);
    },
  );

  it("orders the two lessons 1 and 2 within the module", () => {
    const orders = Object.keys(lessonToLabId)
      .map((id) => loadLesson(id).lesson.order)
      .sort((a, b) => a - b);
    expect(orders).toEqual([1, 2]);
  });

  it("each lesson links to its paired lab, which exists", () => {
    for (const [lessonId, labId] of Object.entries(lessonToLabId)) {
      const { body } = loadLesson(lessonId);
      expect(body).toContain(`/labs/${labId}`);
      expect(getLabById(labId)).not.toBeNull();
    }
  });
});
