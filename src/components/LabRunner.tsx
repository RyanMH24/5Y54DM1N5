"use client";

import { useState, useSyncExternalStore } from "react";
import type { TerminalLabProgress } from "@/types/terminal-lab";
import { getLabById } from "@/lib/terminal-lab/load";
import { loadLabProgress, saveLabProgress } from "@/lib/terminal-lab/progress";
import { Terminal, type TerminalProgress } from "./Terminal";

interface LabRunnerProps {
  labId: string;
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

export function LabRunner({ labId }: LabRunnerProps) {
  const lab = getLabById(labId);
  if (!lab) {
    throw new Error(`Unknown lab: ${labId}`);
  }

  // Resolves to false during SSR/the first client pass, then true right after —
  // used only to key a one-time Terminal remount once real stored progress is
  // known, without remounting (and losing scrollback) on every later save.
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    getIsHydratedSnapshot,
    getIsHydratedServerSnapshot,
  );
  const storedProgress = useSyncExternalStore(
    subscribeToNothing,
    () => loadLabProgress(labId),
    getServerProgressSnapshot,
  );
  const [submittedProgress, setSubmittedProgress] = useState<TerminalLabProgress | null>(null);
  const progress = submittedProgress ?? storedProgress;
  const canResume =
    progress !== null &&
    progress.currentStepIndex <= lab.steps.length &&
    progress.completed === (progress.currentStepIndex === lab.steps.length);

  function handleProgress(update: TerminalProgress) {
    const record: TerminalLabProgress = {
      labId,
      currentStepIndex: update.currentStepIndex,
      completed: update.completed,
      updatedAt: new Date().toISOString(),
    };
    saveLabProgress(record);
    setSubmittedProgress(record);
  }

  return (
    <Terminal
      key={isHydrated ? "hydrated" : "loading"}
      lab={lab}
      initialProgress={
        canResume
          ? { currentStepIndex: progress.currentStepIndex, completed: progress.completed }
          : undefined
      }
      onProgress={handleProgress}
    />
  );
}
