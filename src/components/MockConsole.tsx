"use client";

import { useState } from "react";
import type { MockConsoleScenario } from "@/types/mock-console";
import { attemptConsoleAction, createScenarioState } from "@/lib/mock-console/engine";
import { ChallengeCompleteBanner } from "./ChallengeCompleteBanner";

export interface MockConsoleProgress {
  currentTaskIndex: number;
  completed: boolean;
}

interface ActivityEntry {
  actionLabel: string;
  feedback: string;
  matched: boolean;
}

interface MockConsoleProps {
  scenario: MockConsoleScenario;
  initialTaskIndex?: number;
  onProgress?: (progress: MockConsoleProgress) => void;
  onRestart?: () => void;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="7" className="fill-current opacity-15" />
      <path
        d="M5 8.2 7.1 10.3 11.2 5.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="7" className="fill-current opacity-15" />
      <path
        d="M5.5 5.5 10.5 10.5M10.5 5.5 5.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MockConsole({ scenario, initialTaskIndex, onProgress, onRestart }: MockConsoleProps) {
  const [state, setState] = useState(() =>
    createScenarioState(scenario, initialTaskIndex ?? 0),
  );
  const [activeSectionId, setActiveSectionId] = useState(scenario.sections[0]?.id ?? "");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  const activeSection = scenario.sections.find((section) => section.id === activeSectionId);
  const selectedRecord = selectedRecordId ? state.records[selectedRecordId] : null;

  function handleSectionChange(sectionId: string) {
    setActiveSectionId(sectionId);
    setSelectedRecordId(null);
  }

  function handleAction(actionId: string, actionLabel: string) {
    const result = attemptConsoleAction(scenario, state, actionId);
    setState(result.state);
    setActivity((prev) => [...prev, { actionLabel, feedback: result.feedback, matched: result.matched }]);

    if (result.matched) {
      onProgress?.({ currentTaskIndex: result.state.currentTaskIndex, completed: result.state.completed });
    }
  }

  return (
    <div className="game-sky min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            {scenario.title}
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

        {state.completed ? (
          <ChallengeCompleteBanner message="Scenario complete!" className="mt-4" />
        ) : (
          <p className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] shadow-sm">
            {scenario.tasks[state.currentTaskIndex].instructions}
          </p>
        )}

        <nav aria-label="Console sections" className="mt-5 flex flex-wrap gap-2">
          {scenario.sections.map((section) => {
            const isActive = section.id === activeSectionId;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSectionChange(section.id)}
                aria-current={isActive ? "true" : undefined}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? "bg-[var(--node-active-face)] text-white"
                    : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--bg)]"
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </nav>

        {activeSection && (
          <ul
            aria-label={`${activeSection.label} records`}
            className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {activeSection.records.map((recordMeta) => {
              const isSelected = recordMeta.id === selectedRecordId;
              return (
                <li key={recordMeta.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedRecordId(recordMeta.id)}
                    className={`w-full cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors duration-150 ${
                      isSelected
                        ? "border-[var(--node-active-face)] bg-[var(--node-active-face)]/10 text-[var(--text)]"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--bg)]"
                    }`}
                  >
                    {state.records[recordMeta.id].title}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {selectedRecord && (
          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h2 className="text-base font-bold text-[var(--text)]">{selectedRecord.title}</h2>
            <dl className="mt-3 space-y-1.5">
              {Object.entries(selectedRecord.fields).map(([key, value]) => (
                <div key={key} className="flex items-baseline gap-2 text-sm">
                  <dt className="font-semibold text-[var(--text-muted)]">{key}:</dt>
                  <dd className="text-[var(--text)]">{value}</dd>
                </div>
              ))}
            </dl>
            {!state.completed && (
              <div className="mt-4 flex flex-wrap gap-3">
                {scenario.actions
                  .filter((action) => action.recordId === selectedRecord.id)
                  .map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleAction(action.id, action.label)}
                      className="btn-game"
                    >
                      {action.label}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {activity.length > 0 && (
          <ul role="log" aria-label="Activity log" className="mt-5 space-y-2">
            {activity.map((entry, index) => (
              <li
                key={index}
                className={`flex items-start gap-2.5 rounded-xl border px-4 py-2.5 text-sm ${
                  entry.matched
                    ? "border-[var(--success-soft)] bg-[var(--success-soft)] text-[var(--success)]"
                    : "border-[var(--error-soft)] bg-[var(--error-soft)] text-[var(--error)]"
                }`}
              >
                {entry.matched ? (
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                ) : (
                  <XIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                )}
                <span>
                  <span className="font-semibold">{entry.actionLabel}:</span> {entry.feedback}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
