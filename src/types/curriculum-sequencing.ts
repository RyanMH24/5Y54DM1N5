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

