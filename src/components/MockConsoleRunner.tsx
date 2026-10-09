"use client";

import { useState, useSyncExternalStore } from "react";
import type { MockConsoleProgress as StoredProgress } from "@/types/mock-console";
import { getScenarioById } from "@/lib/mock-console/load";
import { clearConsoleProgress, loadConsoleProgress, saveConsoleProgress } from "@/lib/mock-console/progress";
import { MockConsole, type MockConsoleProgress } from "./MockConsole";

interface MockConsoleRunnerProps {
  scenarioId: string;
}

function subscribeToNothing() {
  return () => {};
}

function getIsHydratedSnapshot() {
  return true;
}

function getIsHydratedServerSnapshot() {
  return false;
}

function getServerProgressSnapshot() {
  return null;
}

export function MockConsoleRunner({ scenarioId }: MockConsoleRunnerProps) {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioId}`);
  }

  // Resolves to false during SSR/the first client pass, then true right after —
  // used only to key a one-time MockConsole remount once real stored progress is
  // known, without remounting (and losing the activity log) on every later save.
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    getIsHydratedSnapshot,
    getIsHydratedServerSnapshot,
  );
  const storedProgress = useSyncExternalStore(
    subscribeToNothing,
    () => loadConsoleProgress(scenarioId),
    getServerProgressSnapshot,
  );
  const [submittedProgress, setSubmittedProgress] = useState<StoredProgress | null>(null);
  const [attempt, setAttempt] = useState(0);
  const progress = submittedProgress ?? storedProgress;
  const canResume =
    progress !== null &&
    progress.currentTaskIndex <= scenario.tasks.length &&
    progress.completed === (progress.currentTaskIndex === scenario.tasks.length);

  function handleProgress(update: MockConsoleProgress) {
    const record: StoredProgress = {
      scenarioId,
      currentTaskIndex: update.currentTaskIndex,
      completed: update.completed,
      updatedAt: new Date().toISOString(),
    };
    saveConsoleProgress(record);
    setSubmittedProgress(record);
  }

  function handleRestart() {
    clearConsoleProgress(scenarioId);
    setSubmittedProgress(null);
    setAttempt((value) => value + 1);
  }

  return (
    <MockConsole
      key={`${isHydrated ? "hydrated" : "loading"}-${attempt}`}
      scenario={scenario}
      initialTaskIndex={canResume ? progress.currentTaskIndex : undefined}
      onProgress={handleProgress}
      onRestart={handleRestart}
    />
  );
}
