import type {
  CurriculumActivity,
  CurriculumActivityState,
  CurriculumModule,
  CurriculumProgress,
} from "@/types/curriculum-sequencing";
import { flattenCurriculum } from "@/content/curriculum/path";
import { loadProgress } from "@/lib/progress/storage";
import { loadLabProgress } from "@/lib/terminal-lab/progress";
import { loadConsoleProgress } from "@/lib/mock-console/progress";

export function readActivityCompletion(activity: CurriculumActivity): boolean {
  if (activity.kind === "lesson") {
    return loadProgress(activity.id)?.completed === true;
  }

  if (activity.kind === "lab") {
    return loadLabProgress(activity.id)?.completed === true;
  }

  return loadConsoleProgress(activity.id)?.completed === true;
}

export function deriveCurriculumProgress(
  modules: readonly CurriculumModule[],
  isCompleted: (activity: CurriculumActivity) => boolean,
): CurriculumProgress {
  const activities = flattenCurriculum(modules);
  let allPreviousComplete = true;
  let completedCount = 0;

  const states: CurriculumActivityState[] = activities.map((activity) => {
    const completed = isCompleted(activity);
    const status = completed ? "completed" : allPreviousComplete ? "available" : "locked";

    if (completed) completedCount += 1;
    allPreviousComplete = allPreviousComplete && completed;

    return { activity, status };
  });

  return {
    activities: states,
    completedCount,
    totalCount: states.length,
  };
}
