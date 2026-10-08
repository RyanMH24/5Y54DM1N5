# Spec: platform-shell

Module in [CAPABILITY_MAP.md](./CAPABILITY_MAP.md). Depends on: — (foundation module).

## Objective

Build the foundational web app that every other module (glossary, terminal-lab-engine,
mock-console-engine, core-fundamentals, linux-powershell, identity-device-mgmt,
itsm-ticketing, curriculum-sequencing) builds on top of. This module provides:

- A curriculum data model (modules → lessons → quizzes)
- A lesson renderer (Markdown/MDX content)
- A quiz engine (multiple choice + fill-in-the-blank/short text, with grading)
- Progress tracking persisted to browser localStorage (no accounts yet)

**User:** a solo learner (currently just the project owner, reviewing as it's built).
Public multi-user accounts are explicitly out of scope for this module — see Boundaries.

**Success looks like:** a learner can open a lesson, read MDX content, answer an embedded
quiz with both question types, get graded correctly, and see that completion persist
across page reloads.

## Tech Stack

- Next.js (App Router) + TypeScript + React
- MDX for lesson content (`@next/mdx` or `next-mdx-remote` — chosen during implementation)
- Vitest + React Testing Library for tests
- npm as package manager
- No CSS framework — plain unstyled markup (UI/visual design deferred per project owner)

## Commands

```
Dev:       npm run dev
Build:     npm run build
Start:     npm run start
Test:      npm test              # vitest run
Test (watch): npm run test:watch
Lint:      npm run lint
Typecheck: npm run typecheck     # tsc --noEmit
```

## Project Structure

```
sysadmin-academy/
  CAPABILITY_MAP.md
  SPEC-platform-shell.md
  src/
    app/                    → Next.js App Router routes (lesson pages, etc.)
    content/
      lessons/              → *.mdx lesson files (frontmatter: id, title, moduleId, order, summary)
      quizzes/              → structured quiz data files, keyed by quiz id, referenced from MDX
    components/             → LessonRenderer, Quiz, QuizQuestion (multiple-choice + fill-in-blank)
    lib/
      curriculum/           → loads/parses lesson + quiz data into typed objects
      quiz/                 → grading logic (multiple-choice match, fill-in-blank normalization)
      progress/             → localStorage read/write helpers for lesson + question progress
    types/                  → shared TS types: Lesson, Module, Quiz, Question, ProgressRecord
  tests/                    → Vitest unit tests, mirrors src/ structure
```

Lesson prose lives in MDX (easy to author/read). Quiz questions are structured data
(TS/JSON), referenced from a lesson via an embedded `<Quiz id="..." />` component —
this keeps gradable content structured while prose stays plain-text-friendly.

## Code Style

```ts
// src/types/curriculum.ts
export interface Question {
  id: string;
  prompt: string;
  type: "multiple-choice" | "fill-in-blank";
  // multiple-choice: `choices` + `correctChoiceId`
  // fill-in-blank: `acceptedAnswers` (normalized match list)
  choices?: { id: string; text: string }[];
  correctChoiceId?: string;
  acceptedAnswers?: string[];
}

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  summary: string;
  mdxPath: string;
}
```

- Types are explicit and narrow (no `any`); question variants use a discriminated
  `type` field rather than optional-everything grab-bags once grading logic is written.
- Pure functions for grading/progress logic (no hidden state), so they're trivially
  unit-testable without rendering React.

## Testing Strategy

Vitest + React Testing Library. Test levels:

- **Unit (high coverage expected):** `lib/curriculum` (MDX frontmatter parsing),
  `lib/quiz` (multiple-choice correctness, fill-in-blank normalization/matching),
  `lib/progress` (localStorage read/write, including a mocked localStorage).
- **Component (smoke-level, since UI is still unstyled placeholder):**
  `LessonRenderer` renders MDX body; `Quiz` renders both question types and calls
  grading on submit.
- Tests live under `tests/`, mirroring the `src/` path of what they cover.

## Boundaries

- **Always:** run `npm test`, `npm run typecheck`, `npm run lint` before considering
  a task in this module done. Keep lesson/quiz content data separate from rendering
  and grading logic.
- **Ask first:** adding any new npm dependency beyond what's listed in Tech Stack;
  changing the lesson/quiz content file schema once other modules start depending
  on it; anything that implies ongoing hosting cost.
- **Never:** commit secrets/API keys; add real user accounts/auth/a database (out of
  scope until a later phase); make real network calls to Okta/Jamf/ServiceNow or any
  third party.

## Success Criteria

- `npm run dev` starts the app and a sample lesson route renders MDX content.
- The sample lesson embeds one multiple-choice question and one fill-in-the-blank
  question; submitting answers grades both correctly — including a fill-in-the-blank
  answer that differs only in case/whitespace being graded correct.
- Reloading the page after completing the lesson shows it still marked complete
  (read back from localStorage).
- Clearing localStorage resets progress to not-started.
- `npm test` passes, with high coverage on `lib/curriculum`, `lib/quiz`, `lib/progress`.
- `npm run typecheck` and `npm run lint` pass clean.

## Open Questions

1. **Fill-in-the-blank matching strictness.** Defaulting to: case-insensitive, trimmed,
   whitespace-collapsed exact match against a per-question list of accepted answer
   strings (so a question can accept both `Get-Process` and `gps` as an alias, for
   example). Not doing fuzzy/typo-tolerant matching (e.g. edit-distance) unless you
   want that — it risks accepting wrong-but-close answers.
2. **Quiz result display.** Defaulting to: per-question correct/incorrect feedback
   immediately on submit, plus an overall score (e.g. "3/4") at the end — since
   `curriculum-sequencing` will likely want scores later to judge mastery, not just
   pass/fail.
3. **Progress granularity.** Defaulting to: track both lesson-level completion and
   per-question last-answer/correctness (cheap to store, useful for "what did I get
   wrong" later), not just a single lesson complete/incomplete flag.
