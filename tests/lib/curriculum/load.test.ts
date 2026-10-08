import { describe, expect, it } from "vitest";
import {
  InvalidLessonFrontmatterError,
  loadLesson,
  QuizNotFoundError,
  resolveLesson,
} from "@/lib/curriculum/load";
import type { Quiz } from "@/types/curriculum";

const quizRegistry: Record<string, Quiz> = {
  "sample-quiz": { id: "sample-quiz", questions: [] },
};

describe("loadLesson", () => {
  it("parses the sample lesson's frontmatter into a typed Lesson", () => {
    const { lesson } = loadLesson("sample-lesson");
    expect(lesson).toMatchObject({
      id: "sample-lesson",
      moduleId: "sample-module",
      title: "Sample Lesson",
      order: 1,
      quizId: "sample-quiz",
    });
  });

  it("resolves the lesson's referenced quiz by id", () => {
    const { quiz } = loadLesson("sample-lesson");
    expect(quiz.id).toBe("sample-quiz");
    expect(quiz.questions).toHaveLength(2);
    expect(quiz.questions.map((q) => q.type)).toEqual(["multiple-choice", "fill-in-blank"]);
  });

  it("returns the MDX body with the embedded Quiz reference intact", () => {
    const { body } = loadLesson("sample-lesson");
    expect(body).toContain('<Quiz id="sample-quiz" />');
  });

  it("throws when the lesson file doesn't exist", () => {
    expect(() => loadLesson("does-not-exist")).toThrow();
  });
});

describe("resolveLesson", () => {
  const validFrontmatter = {
    id: "lesson-1",
    moduleId: "module-1",
    title: "Lesson One",
    order: 1,
    summary: "A lesson.",
    quizId: "sample-quiz",
  };

  it("fails loudly when the referenced quiz id doesn't exist", () => {
    expect(() =>
      resolveLesson(
        "lesson-1",
        { ...validFrontmatter, quizId: "missing-quiz" },
        "body",
        quizRegistry,
      ),
    ).toThrow(QuizNotFoundError);
  });

  it("fails loudly when required frontmatter fields are missing", () => {
    const { summary, ...incomplete } = validFrontmatter;
    void summary;
    expect(() => resolveLesson("lesson-1", incomplete, "body", quizRegistry)).toThrow(
      InvalidLessonFrontmatterError,
    );
  });
});
