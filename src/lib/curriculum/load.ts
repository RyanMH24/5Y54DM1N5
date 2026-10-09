import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Lesson, Quiz } from "@/types/curriculum";
import { quizzes } from "@/content/quizzes";

const LESSONS_DIR = path.join(process.cwd(), "src/content/lessons");

export class QuizNotFoundError extends Error {
  constructor(quizId: string) {
    super(`Quiz not found: ${quizId}`);
    this.name = "QuizNotFoundError";
  }
}

export class InvalidLessonFrontmatterError extends Error {
  constructor(lessonId: string) {
    super(`Lesson "${lessonId}" is missing required frontmatter fields`);
    this.name = "InvalidLessonFrontmatterError";
  }
}

export interface LoadedLesson {
  lesson: Lesson;
  body: string;
  quiz: Quiz;
}

interface LessonFrontmatter {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  summary: string;
  quizId: string;
}

function isLessonFrontmatter(
  data: Record<string, unknown>,
): data is LessonFrontmatter & Record<string, unknown> {
  return (
    typeof data.id === "string" &&
    typeof data.moduleId === "string" &&
    typeof data.title === "string" &&
    typeof data.order === "number" &&
    typeof data.summary === "string" &&
    typeof data.quizId === "string"
  );
}

export function resolveLesson(
  lessonId: string,
  data: Record<string, unknown>,
  content: string,
  quizRegistry: Record<string, Quiz>,
): LoadedLesson {
  if (!isLessonFrontmatter(data)) {
    throw new InvalidLessonFrontmatterError(lessonId);
  }

  const quiz = quizRegistry[data.quizId];
  if (!quiz) {
    throw new QuizNotFoundError(data.quizId);
  }

  const lesson: Lesson = {
    id: data.id,
    moduleId: data.moduleId,
    title: data.title,
    order: data.order,
    summary: data.summary,
    quizId: data.quizId,
    mdxPath: path.join(LESSONS_DIR, `${lessonId}.mdx`),
  };

  return { lesson, body: content, quiz };
}

export function loadLesson(lessonId: string): LoadedLesson {
  const mdxPath = path.join(LESSONS_DIR, `${lessonId}.mdx`);
  const raw = fs.readFileSync(mdxPath, "utf-8");
  const { data, content } = matter(raw);
  return resolveLesson(lessonId, data, content, quizzes);
}

export function getAllLessonIds(): string[] {
  return fs
    .readdirSync(LESSONS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length));
}

export function getQuizById(quizId: string): Quiz {
  const quiz = quizzes[quizId];
  if (!quiz) {
    throw new QuizNotFoundError(quizId);
  }
  return quiz;
}
