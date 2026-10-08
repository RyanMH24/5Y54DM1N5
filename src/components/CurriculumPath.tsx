"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { curriculumModules } from "@/content/curriculum/path";
import {
  deriveCurriculumProgress,
  readActivityCompletion,
} from "@/lib/curriculum-sequencing/progress";
import type {
  CurriculumActivity,
  CurriculumActivityStatus,
} from "@/types/curriculum-sequencing";

const statusLabels: Record<CurriculumActivityStatus, string> = {
  completed: "Completed",
  available: "Up next",
  locked: "Locked",
};

const kindLabels: Record<CurriculumActivity["kind"], string> = {
  lesson: "Lesson",
  lab: "Terminal lab",
  console: "Guided console",
};

function subscribeToNothing() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function CurriculumPath() {
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    getHydratedSnapshot,
    getServerSnapshot,
  );
  const progress = deriveCurriculumProgress(
    curriculumModules,
    isHydrated ? readActivityCompletion : () => false,
  );
  const stateById = new Map(progress.activities.map((state) => [state.activity.id, state]));

  return (
    <>
      <p role="status">
        {progress.completedCount}/{progress.totalCount} complete
      </p>
      {progress.completedCount === progress.totalCount && <p>Curriculum complete</p>}

      {curriculumModules.map((module) => (
        <section key={module.id} aria-labelledby={`${module.id}-heading`}>
          <h2 id={`${module.id}-heading`}>{module.title}</h2>
          <p>{module.schedule}</p>
          <ol>
            {module.activities.map((activity) => {
              const state = stateById.get(activity.id);
              if (!state) {
                throw new Error(`Missing curriculum state for activity: ${activity.id}`);
              }

              return (
                <li key={activity.id}>
                  <span>{kindLabels[activity.kind]}</span>{" "}
                  {state.status === "locked" ? (
                    <span>{activity.title}</span>
                  ) : (
                    <Link href={activity.href}>{activity.title}</Link>
                  )}{" "}
                  <span>{statusLabels[state.status]}</span>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </>
  );
}
