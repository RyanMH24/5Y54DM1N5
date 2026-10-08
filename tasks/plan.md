# Implementation Plan: platform-shell

Spec: [../SPEC-platform-shell.md](../SPEC-platform-shell.md)

## Overview

Stand up the Next.js + TypeScript app shell that every later module depends on:
shared curriculum types, a quiz grading engine, localStorage progress tracking,
a curriculum/content loader, quiz UI components, and a lesson page that wires
all of it together end-to-end for one sample lesson. This is a single vertical
slice — there's no meaningful horizontal split since every piece exists to
prove the same path: open a lesson → answer a quiz → get graded → progress
persists across reload.

## Architecture Decisions

- MDX integration library (`@next/mdx` vs `next-mdx-remote`) is an implementation
  detail decided in Task 1 — `next-mdx-remote` is likely preferred since it lets
  a lesson embed a `<Quiz id="..." />` component resolved at render time against
  the quiz data loaded by `lib/curriculum`, rather than requiring static compile-time
  wiring per lesson.
- Grading and progress logic are pure functions (`lib/quiz`, `lib/progress`) with
  no React dependency, so they're unit-testable in isolation from rendering —
  this is why types + grading land before any UI component.
- Fill-in-blank grading: case-insensitive, trimmed, whitespace-collapsed exact
  match against a per-question `acceptedAnswers` list (per spec Open Question 1).

## Task List

### Phase 1: Foundation

- [x] Task 1: Project scaffold & tooling
- [x] Task 2: Shared types + quiz grading engine
- [x] Task 3: Progress tracking helpers

### Checkpoint: Foundation
- [x] `npm test`, `npm run typecheck`, `npm run lint` all pass
- [x] No UI yet — this checkpoint is logic-only

### Phase 2: Content & Rendering

- [x] Task 4: Curriculum/content loader + sample lesson fixture
- [x] Task 5: Quiz UI components

### Checkpoint: Content & Rendering
- [x] Sample lesson's MDX and quiz data load and parse correctly (unit tests)
- [x] Quiz components render both question types and grade on submit (component tests)

### Phase 3: End-to-end wiring

- [x] Task 6: LessonRenderer + lesson route
- [x] Task 7: Progress persistence wired into the lesson page

### Checkpoint: Complete
- [x] `npm run dev` → open the sample lesson → answer quiz → see per-question
      feedback and overall score → reload page → completion still shown
- [x] All spec Success Criteria met
- [ ] Review with project owner before moving to the next module (`glossary`
      or `terminal-lab-engine`, per CAPABILITY_MAP.md build order)

## Task Details

### Task 1: Project scaffold & tooling
**Description:** Initialize Next.js (App Router) + TypeScript project, configure
Vitest + React Testing Library, ESLint, and MDX support. Add npm scripts for
dev/build/start/test/test:watch/lint/typecheck.
**Acceptance criteria:**
- [x] `npm run dev` serves a blank app at localhost
- [x] `npm test` runs (even with zero tests) without config errors
- [x] `npm run typecheck` and `npm run lint` run clean on the scaffold
**Verification:**
- [x] `npm run build` succeeds
- [ ] Manual check: visit the dev server root route, no errors in console
**Dependencies:** None
**Files likely touched:** `package.json`, `tsconfig.json`, `next.config.*`, `vitest.config.ts`, `.eslintrc*`, `src/app/layout.tsx`, `src/app/page.tsx`
**Estimated scope:** Small (config-heavy, not logic-heavy)

### Task 2: Shared types + quiz grading engine
**Description:** Define `Lesson`, `Module`, `Quiz`, `Question`, `ProgressRecord`
types. Implement `lib/quiz` grading: multiple-choice exact match, fill-in-blank
normalized match against `acceptedAnswers`. Pure functions, fully unit tested.
**Acceptance criteria:**
- [x] Multiple-choice grading returns correct/incorrect for right/wrong choice ids
- [x] Fill-in-blank grading accepts case/whitespace variants, rejects wrong answers
- [x] Grading a full `Quiz` returns per-question results + an overall score
**Verification:**
- [x] Tests pass: `npm test -- lib/quiz`
- [x] Typecheck passes: `npm run typecheck`
**Dependencies:** Task 1
**Files likely touched:** `src/types/curriculum.ts`, `src/lib/quiz/grade.ts`, `tests/lib/quiz/grade.test.ts`
**Estimated scope:** Small-Medium

### Task 3: Progress tracking helpers
**Description:** Implement `lib/progress` to read/write lesson completion and
per-question last-answer/correctness to `localStorage`, with safe handling of
missing/corrupted data (no accounts yet — this is the only persistence layer).
**Acceptance criteria:**
- [x] Saving progress for a lesson is readable back with the same shape
- [x] Corrupted/missing localStorage data is treated as "not started", not a crash
- [x] Clearing storage resets a lesson to not-started
**Verification:**
- [x] Tests pass: `npm test -- lib/progress` (localStorage mocked)
- [x] Typecheck passes
**Dependencies:** Task 2 (uses `ProgressRecord` type)
**Files likely touched:** `src/lib/progress/storage.ts`, `tests/lib/progress/storage.test.ts`
**Estimated scope:** Small

### Task 4: Curriculum/content loader + sample lesson fixture
**Description:** Implement `lib/curriculum` to load lesson metadata (frontmatter)
and resolve a lesson's embedded quiz by id from `content/quizzes/`. Add one
sample lesson (`content/lessons/sample-lesson.mdx`) with one multiple-choice
and one fill-in-blank question, to serve as the fixture used by every later
task's tests and the Phase 3 end-to-end check.
**Acceptance criteria:**
- [x] Loader parses the sample lesson's frontmatter into a typed `Lesson`
- [x] Loader resolves the lesson's referenced `Quiz` by id
- [x] A lesson referencing a missing quiz id fails loudly (not silently empty)
**Verification:**
- [x] Tests pass: `npm test -- lib/curriculum`
**Dependencies:** Task 1 (MDX tooling), Task 2 (types)
**Files likely touched:** `src/lib/curriculum/load.ts`, `src/content/lessons/sample-lesson.mdx`, `src/content/quizzes/sample-quiz.ts`, `tests/lib/curriculum/load.test.ts`
**Estimated scope:** Medium

### Task 5: Quiz UI components
**Description:** Build `QuizQuestion` (handles both multiple-choice and
fill-in-blank input) and `Quiz` (renders all questions, collects answers,
calls `lib/quiz` grading on submit, shows per-question feedback + overall score).
**Acceptance criteria:**
- [x] Multiple-choice question renders selectable choices
- [x] Fill-in-blank question renders a text input
- [x] Submitting shows correct/incorrect per question and an overall score
**Verification:**
- [x] Tests pass: `npm test -- components/Quiz`
**Dependencies:** Task 2
**Files likely touched:** `src/components/QuizQuestion.tsx`, `src/components/Quiz.tsx`, `tests/components/Quiz.test.tsx`
**Estimated scope:** Medium

### Task 6: LessonRenderer + lesson route
**Description:** Build `LessonRenderer` that renders a lesson's MDX body and
embeds the `Quiz` component where referenced. Add an App Router route that
loads the sample lesson via `lib/curriculum` and renders it with `LessonRenderer`.
**Acceptance criteria:**
- [x] Visiting the sample lesson's route renders its MDX prose
- [x] The embedded quiz renders and is interactive on that page
**Verification:**
- [x] Tests pass: `npm test -- components/LessonRenderer`
- [x] Manual check: `npm run dev`, visit the sample lesson route, see prose + quiz
**Dependencies:** Task 4, Task 5
**Files likely touched:** `src/components/LessonRenderer.tsx`, `src/app/lessons/[id]/page.tsx`, `tests/components/LessonRenderer.test.tsx`
**Estimated scope:** Medium

### Task 7: Progress persistence wired into the lesson page
**Description:** Connect the lesson page to `lib/progress`: on quiz submit,
persist lesson completion and per-question correctness; on page load, read
prior progress and reflect it (e.g. show it's already been completed/scored).
**Acceptance criteria:**
- [x] Completing the quiz marks the lesson complete in localStorage
- [x] Reloading the page shows the lesson as already completed, with prior score
- [x] Clearing localStorage and reloading shows the lesson as not started
**Verification:**
- [x] Tests pass: full suite `npm test`
- [x] Manual check: the Phase 3 checkpoint flow above, done by hand in the browser
**Dependencies:** Task 3, Task 6
**Files likely touched:** `src/app/lessons/[id]/page.tsx`, `src/components/LessonRenderer.tsx`, `tests/app/lessons/page.test.tsx`
**Estimated scope:** Small-Medium

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| MDX + custom-component embedding (`<Quiz id="..." />`) has rough edges in Next.js App Router | Medium | Resolve the library choice in Task 1 before any content is written against it; keep lesson MDX minimal (prose + one quiz reference) until the pipeline is proven |
| Fill-in-blank grading too strict/loose for real content later | Low | Normalization rules are isolated in one pure function with unit tests — easy to revisit without touching UI or content |
| localStorage absent/corrupted (private browsing, quota, manual edits) | Low | `lib/progress` treats any read failure as "not started" rather than throwing |

## Open Questions

None outstanding — spec's three open questions were resolved with stated defaults
(see SPEC-platform-shell.md § Open Questions). Flag here if that changes during
implementation.
