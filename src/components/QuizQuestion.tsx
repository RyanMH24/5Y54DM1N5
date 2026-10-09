import { useEffect, useState } from "react";
import type { Choice, Question } from "@/types/curriculum";
import type { QuestionResult } from "@/lib/quiz/grade";

interface QuizQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  result?: QuestionResult;
}

function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function QuizQuestion({ question, value, onChange, result }: QuizQuestionProps) {
  const promptId = `${question.id}-prompt`;
  const isMultipleChoice = question.type === "multiple-choice";
  // Render in the data's original order for the server/first client pass (so
  // hydration matches exactly), then shuffle once on the client right after —
  // keeps the correct answer from always landing in the same spot without a
  // server/client hydration mismatch.
  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>(
    question.type === "multiple-choice" ? question.choices : [],
  );

  useEffect(() => {
    if (question.type === "multiple-choice") {
      // Deliberately deferred to an effect (not computed during render) so the
      // server-rendered and first client-rendered markup match exactly, and
      // only the client re-shuffles — avoiding a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShuffledChoices(shuffle(question.choices));
    }
    // Re-shuffle only when the question itself changes, not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  return (
    <div
      {...(isMultipleChoice ? { role: "group", "aria-labelledby": promptId } : {})}
      className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4"
    >
      <p id={promptId} className="text-sm font-semibold text-[var(--text)]">
        {question.prompt}
      </p>
      <div className="mt-3 space-y-2">
        {isMultipleChoice ? (
          shuffledChoices.map((choice) => (
            <label
              key={choice.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors duration-150 ${
                value === choice.id
                  ? "border-[var(--node-active-face)] bg-[var(--node-active-face)]/10"
                  : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)]"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={choice.id}
                checked={value === choice.id}
                onChange={() => onChange(choice.id)}
                className="h-4 w-4 flex-shrink-0 accent-[var(--node-active-face)]"
              />
              <span className="text-[var(--text)]">{choice.text}</span>
            </label>
          ))
        ) : (
          <input
            type="text"
            aria-label={question.prompt}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition-colors duration-150 focus:border-[var(--node-active-face)]"
          />
        )}
      </div>
      {result && (
        <span
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            result.correct
              ? "bg-[var(--success-soft)] text-[var(--success)]"
              : "bg-[var(--error-soft)] text-[var(--error)]"
          }`}
        >
          {result.correct ? "Correct" : "Incorrect"}
        </span>
      )}
    </div>
  );
}
