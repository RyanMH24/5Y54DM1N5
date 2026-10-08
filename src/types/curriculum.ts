export interface Choice {
  id: string;
  text: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  type: "multiple-choice";
  prompt: string;
  choices: Choice[];
  correctChoiceId: string;
}

export interface FillInBlankQuestion {
  id: string;
  type: "fill-in-blank";
  prompt: string;
  acceptedAnswers: string[];
}

export type Question = MultipleChoiceQuestion | FillInBlankQuestion;

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  summary: string;
  quizId: string;
  mdxPath: string;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessonIds: string[];
}

export interface QuestionProgress {
  questionId: string;
  lastAnswer: string;
  correct: boolean;
}

export interface ProgressRecord {
  lessonId: string;
  completed: boolean;
  score: number;
  questions: QuestionProgress[];
  updatedAt: string;
}
