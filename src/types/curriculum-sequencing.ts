interface CurriculumActivityBase {
  id: string;
  title: string;
}

export type CurriculumActivity = CurriculumActivityBase &
  (
    | { kind: "lesson"; href: `/lessons/${string}` }
    | { kind: "lab"; href: `/labs/${string}` }
    | { kind: "console"; href: `/consoles/${string}` }
  );

export interface CurriculumModule {
  id: string;
  title: string;
  schedule: string;
  activities: readonly CurriculumActivity[];
}

export type CurriculumActivityStatus = "completed" | "available" | "locked";

export interface CurriculumActivityState {
  activity: CurriculumActivity;
  status: CurriculumActivityStatus;
}

export interface CurriculumProgress {
  activities: CurriculumActivityState[];
  completedCount: number;
  totalCount: number;
}
