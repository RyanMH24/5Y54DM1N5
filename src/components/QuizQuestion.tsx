import type { Question } from "@/types/curriculum";
import type { QuestionResult } from "@/lib/quiz/grade";

interface QuizQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  result?: QuestionResult;
}

export function QuizQuestion({ question, value, onChange, result }: QuizQuestionProps) {
  return (
    <fieldset>
      <legend>{question.prompt}</legend>
      {question.type === "multiple-choice" ? (
        question.choices.map((choice) => (
          <label key={choice.id}>
            <input
              type="radio"
              name={question.id}
              value={choice.id}
              checked={value === choice.id}
              onChange={() => onChange(choice.id)}
            />
            {choice.text}
          </label>
        ))
      ) : (
        <input
          type="text"
          aria-label={question.prompt}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {result && <span>{result.correct ? "Correct" : "Incorrect"}</span>}
    </fieldset>
  );
}
