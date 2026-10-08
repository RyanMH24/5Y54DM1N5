# Implementation Plan: curriculum-sequencing

Spec: [../SPEC-curriculum-sequencing.md](../SPEC-curriculum-sequencing.md)

## Overview

Replace the scaffold home page with a client-aware curriculum dashboard that
lists the 14 real learning activities in one six-week path. A typed static
catalog defines module and activity order; a small aggregation library reads
the three existing progress stores and derives `completed`, `available`, and
`locked` states; the dashboard renders those states without creating a fourth
progress record or changing direct activity routes.

The work is intentionally sequential. The catalog contract must exist before
progress can be derived, and the derived state contract must exist before the
dashboard can render it.

## Architecture Decisions

- Add sequencing-specific types instead of expanding the existing `Module`
  type, whose `lessonIds` shape cannot represent labs and consoles. The new
  `CurriculumActivity` discriminated union makes progress adapters and hrefs
  explicit for all three activity kinds.
- Keep one canonical static catalog under `src/content/curriculum/path.ts`.
  The UI consumes this data rather than duplicating ids, titles, schedule
  labels, or ordering.
- Split state handling into a pure derivation function plus one browser-only
  completion reader. Pure derivation receives an `isCompleted(activity)`
  callback; the browser adapter switches on `activity.kind` and delegates to
  `loadProgress`, `loadLabProgress`, or `loadConsoleProgress`.
- Define availability globally: an incomplete activity is `available` only
  when every preceding activity is complete. A completed activity is always
  displayed as `completed`, even if its local record was created out of order,
  but it does not bypass an earlier gap when later states are derived.
- Render locked activities as non-link content with explicit `Locked` text.
  Available and completed activities use their catalog href. Existing direct
  routes remain unchanged and therefore accessible.
- Handle browser-only progress with the same hydration primitive already used
  by `LabRunner`: `useSyncExternalStore` returns `false` for the server snapshot
  and `true` after hydration. Only then does the component read `localStorage`.
  This avoids hydration mismatches without adding a mutable subscription or a
  duplicate curriculum progress cache.

## Task List

### Phase 1: Catalog and state foundation

- [x] Task 1: Typed curriculum catalog + integrity tests
- [x] Task 2: Cross-store progress derivation + unit tests

### Checkpoint: Foundation

- [x] The catalog resolves all 14 real activities once, excludes fixtures, and
      preserves the spec's exact global order
- [x] Empty, partial, out-of-order, corrupted, and complete progress derive the
      expected states
- [x] Focused sequencing tests, typecheck, and lint pass

### Phase 2: Dashboard and end-to-end verification

- [x] Task 3: Curriculum dashboard on `/`
- [x] Task 4: Full regression + browser verification

### Checkpoint: Complete

- [x] A cleared browser shows `0/14 complete`, one `Up next` activity, and 13
      non-clickable locked activities
- [x] Lesson→lesson, lesson→lab, and lesson→console completion boundaries each
      unlock exactly the next activity after returning to `/`
- [x] Completed activities remain linked and direct locked URLs still render
- [x] `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` pass
- [x] All spec Success Criteria are met
- [ ] Review with project owner before considering the capability map complete

## Task Details

### Task 1: Typed curriculum catalog + integrity tests

**Description:** Define the sequencing-specific module/activity types and the
canonical four-module, 14-activity catalog. Add integrity coverage that checks
unique ids/hrefs, exact order, fixture exclusion, and resolution of every
activity through its existing lesson, terminal-lab, or mock-console loader.

**Acceptance criteria:**

- [x] The catalog contains the four specified schedule groups and all 14 real
      activities in the spec's exact order
- [x] Every id/href is unique and resolves through the loader for its declared
      kind; sample/demo fixtures do not appear
- [x] The catalog and helpers are fully typed without changing existing lesson,
      lab, console, or progress schemas

**Verification:**

- [x] Tests pass: `npm test -- tests/lib/curriculum-sequencing/catalog.test.ts`
- [x] Typecheck passes: `npm run typecheck`
- [x] Lint passes: `npm run lint`

**Dependencies:** None

**Files likely touched:**

- `src/types/curriculum-sequencing.ts`
- `src/content/curriculum/path.ts`
- `tests/lib/curriculum-sequencing/catalog.test.ts`

**Estimated scope:** Medium (3 files)

### Task 2: Cross-store progress derivation + unit tests

**Description:** Implement pure path flattening/state derivation and the
browser adapter that reads each activity from its existing progress store.
Cover no progress, consecutive partial progress, out-of-order records,
corrupted/missing records, and fully completed curriculum behavior.

**Acceptance criteria:**

- [x] The browser adapter delegates lesson, lab, and console activities to the
      correct existing loader and treats missing/corrupted records as incomplete
- [x] Pure derivation returns exactly one `available` item after a consecutive
      completed prefix, locks everything later, and keeps completed out-of-order
      activities visibly completed without unlocking past an earlier gap
- [x] A fully complete path has 14 completed activities, no available or locked
      activities, and the correct completed count

**Verification:**

- [x] Tests pass: `npm test -- tests/lib/curriculum-sequencing/progress.test.ts`
- [x] Foundation tests pass: `npm test -- tests/lib/curriculum-sequencing`
- [x] Typecheck and lint pass: `npm run typecheck` and `npm run lint`

**Dependencies:** Task 1

**Files likely touched:**

- `src/lib/curriculum-sequencing/progress.ts`
- `tests/lib/curriculum-sequencing/progress.test.ts`

**Estimated scope:** Small (2 files)

### Task 3: Curriculum dashboard on `/`

**Description:** Build `CurriculumPath` as a hydration-safe client component
and replace the scaffold home page with it. Render the overall count, semantic
module headings and schedule labels, activity kind/state text, links for
completed/available work, and non-link locked entries. Add page integration
tests across empty and seeded progress from all three stores.

**Acceptance criteria:**

- [x] `/` renders all modules/activities in order with `completed/14 complete`
      and textual `Completed`, `Up next`, or `Locked` state for each item
- [x] With empty storage only Networking Basics is linked as `Up next`; seeding
      consecutive lesson/lab/console completion updates the count and unlocks
      exactly the next catalog activity
- [x] Locked entries are not links, completed entries remain links, and server
      rendering/client hydration do not read browser storage unsafely

**Verification:**

- [x] Tests pass: `npm test -- tests/app/page.test.tsx`
- [x] Full tests pass: `npm test`
- [x] Typecheck and lint pass: `npm run typecheck` and `npm run lint`

**Dependencies:** Task 2

**Files likely touched:**

- `src/components/CurriculumPath.tsx`
- `src/app/page.tsx`
- `tests/app/page.test.tsx`

**Estimated scope:** Medium (3 files)

### Task 4: Full regression + browser verification

**Description:** Run every automated quality gate, then exercise the dashboard
in a real browser from cleared storage through representative unlock
boundaries. Fix only issues needed to satisfy the approved spec and record the
verified checkpoints in the module checklist.

**Acceptance criteria:**

- [x] The complete automated suite, typecheck, lint, and production build pass
- [x] Browser verification proves initial state, first unlock, lesson→lab
      unlock, lesson→console unlock, reload persistence, and direct locked URL
      access
- [x] The implementation meets every Success Criterion without new
      dependencies, storage keys, route guards, or fixture activities

**Verification:**

- [x] `npm test`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] Manual browser flow from the Phase 2 checkpoint

**Dependencies:** Task 3

**Files likely touched:**

- `tasks/curriculum-sequencing-todo.md`
- Application/test files above only if verification exposes a scoped defect

**Estimated scope:** Small (verification-focused)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Aggregating three storage systems accidentally creates a second source of truth | High | The sequencing library only reads existing stores; catalog/dashboard code has no save API or curriculum storage key |
| Reading `localStorage` during SSR causes hydration mismatch or runtime failure | High | Gate browser reads behind the established `useSyncExternalStore` hydration pattern and test both server-like initial rendering and hydrated output |
| Catalog ids drift from real content and silently create broken links | Medium | Resolve every declared activity through its kind-specific loader in catalog integrity tests |
| Out-of-order local records bypass the intended path | Medium | Derive unlocks from the complete preceding prefix, not merely the previous item's displayed state; add a dedicated regression test |
| A locked `<a>` remains keyboard/click accessible despite looking disabled | Medium | Render locked activities without an anchor and assert absence of a link role in page tests |
| Existing fixture content leaks into learner totals | Low | Assert the exact 14 ids and explicit exclusion of sample/demo ids |

## Open Questions

None outstanding. The four choices recorded in the approved spec are treated
as decisions: dashboard-only locks, existing quiz completion semantics, one
linear path, and informational six-week labels without deadlines.
