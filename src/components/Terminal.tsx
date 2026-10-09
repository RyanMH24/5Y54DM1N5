"use client";

import { useState, type FormEvent } from "react";
import type { TerminalLab } from "@/types/terminal-lab";
import { matchCommand } from "@/lib/terminal-lab/match";
import { ChallengeCompleteBanner } from "./ChallengeCompleteBanner";

interface HistoryEntry {
  command: string;
  output: string;
}

export interface TerminalProgress {
  currentStepIndex: number;
  completed: boolean;
}

interface TerminalProps {
  lab: TerminalLab;
  initialProgress?: TerminalProgress;
  onProgress?: (progress: TerminalProgress) => void;
  onRestart?: () => void;
}

export function Terminal({ lab, initialProgress, onProgress, onRestart }: TerminalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialProgress?.currentStepIndex ?? 0,
  );
  const [completed, setCompleted] = useState(initialProgress?.completed ?? false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const step = lab.steps[currentStepIndex];
    const result = matchCommand(step, input);
    setHistory((prev) => [...prev, { command: input, output: result.output }]);
    setInput("");

    if (result.matched) {
      const nextIndex = currentStepIndex + 1;
      const isComplete = nextIndex >= lab.steps.length;
      setCurrentStepIndex(nextIndex);
      setCompleted(isComplete);
      onProgress?.({ currentStepIndex: nextIndex, completed: isComplete });
    }
  }

  return (
    <div className="game-sky min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            {lab.title}
          </h1>
          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="btn-game btn-game-muted !px-3 !py-1.5 !text-xs"
            >
              Restart
            </button>
          )}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--terminal-border)] bg-[var(--terminal-bg)] shadow-lg">
          <div className="flex items-center gap-1.5 border-b border-[var(--terminal-border)] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          </div>

          <ul role="log" aria-label="Command history" className="space-y-3 px-4 py-4">
            {history.map((entry, index) => (
              <li key={index} className="font-mono text-sm">
                <p className="text-[var(--node-done-face)]">$ {entry.command}</p>
                <pre className="mt-1 whitespace-pre-wrap text-[var(--terminal-text)]">
                  {entry.output}
                </pre>
              </li>
            ))}
          </ul>

          {completed ? (
            <ChallengeCompleteBanner message="Lab complete!" className="mx-4 mb-4 font-mono" />
          ) : (
            <>
              <p className="px-4 pb-3 font-mono text-sm text-[var(--terminal-muted)]">
                {lab.steps[currentStepIndex].instructions}
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 border-t border-[var(--terminal-border)] px-4 py-3 font-mono text-sm"
              >
                <span aria-hidden="true" className="text-[var(--node-done-face)]">
                  $
                </span>
                <label className="flex-1">
                  <span className="sr-only">Command</span>
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-transparent text-[var(--terminal-text)] outline-none"
                  />
                </label>
                <button type="submit" className="btn-game !px-3 !py-1.5 !text-xs">
                  Run
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
