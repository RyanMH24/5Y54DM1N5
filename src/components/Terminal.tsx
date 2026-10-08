"use client";

import { useState, type FormEvent } from "react";
import type { TerminalLab } from "@/types/terminal-lab";
import { matchCommand } from "@/lib/terminal-lab/match";

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
}

export function Terminal({ lab, initialProgress, onProgress }: TerminalProps) {
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
    <div>
      <h1>{lab.title}</h1>
      <ul role="log" aria-label="Command history">
        {history.map((entry, index) => (
          <li key={index}>
            <p>$ {entry.command}</p>
            <pre>{entry.output}</pre>
          </li>
        ))}
      </ul>
      {completed ? (
        <p role="status">Lab complete!</p>
      ) : (
        <>
          <p>{lab.steps[currentStepIndex].instructions}</p>
          <form onSubmit={handleSubmit}>
            <label>
              Command
              <input type="text" value={input} onChange={(event) => setInput(event.target.value)} />
            </label>
            <button type="submit">Run</button>
          </form>
        </>
      )}
    </div>
  );
}
