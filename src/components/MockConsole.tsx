"use client";

import { useState } from "react";
import type { MockConsoleScenario } from "@/types/mock-console";
import { attemptConsoleAction, createScenarioState } from "@/lib/mock-console/engine";

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
}

export function MockConsole({ scenario, initialTaskIndex, onProgress }: MockConsoleProps) {
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
    <div>
      <h1>{scenario.title}</h1>

      {state.completed ? (
        <p role="status">Scenario complete!</p>
      ) : (
        <p>{scenario.tasks[state.currentTaskIndex].instructions}</p>
      )}

      <nav aria-label="Console sections">
        {scenario.sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => handleSectionChange(section.id)}
            aria-current={section.id === activeSectionId ? "true" : undefined}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {activeSection && (
        <ul aria-label={`${activeSection.label} records`}>
          {activeSection.records.map((recordMeta) => (
            <li key={recordMeta.id}>
              <button type="button" onClick={() => setSelectedRecordId(recordMeta.id)}>
                {state.records[recordMeta.id].title}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedRecord && (
        <div>
          <h2>{selectedRecord.title}</h2>
          <dl>
            {Object.entries(selectedRecord.fields).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {!state.completed && (
            <div>
              {scenario.actions
                .filter((action) => action.recordId === selectedRecord.id)
                .map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleAction(action.id, action.label)}
                  >
                    {action.label}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      <ul role="log" aria-label="Activity log">
        {activity.map((entry, index) => (
          <li key={index}>
            {entry.actionLabel}: {entry.feedback}
          </li>
        ))}
      </ul>
    </div>
  );
}
