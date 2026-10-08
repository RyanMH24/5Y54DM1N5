import type { Question, Quiz } from "@/types/curriculum";

export interface QuestionResult {
  questionId: string;
  correct: boolean;
}

export interface QuizResult {
  quizId: string;
  results: QuestionResult[];
  correctCount: number;
  totalQuestions: number;
  score: number;
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function gradeQuestion(question: Question, answer: string): QuestionResult {
  switch (question.type) {
    case "multiple-choice":
      return { questionId: question.id, correct: answer === question.correctChoiceId };
    case "fill-in-blank":
      return {
        questionId: question.id,
        correct: question.acceptedAnswers.some(
          (accepted) => normalize(accepted) === normalize(answer),
        ),
      };
  }
}

export function gradeQuiz(quiz: Quiz, answers: Record<string, string>): QuizResult {
  const results = quiz.questions.map((question) =>
    gradeQuestion(question, answers[question.id] ?? ""),
  );
  const correctCount = results.filter((result) => result.correct).length;
  const totalQuestions = results.length;
  return {
    quizId: quiz.id,
    results,
    correctCount,
    totalQuestions,
    score: totalQuestions === 0 ? 0 : correctCount / totalQuestions,
  };
}
