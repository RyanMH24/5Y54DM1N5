# Implementation Plan: mock-console-engine

Spec: [../SPEC-mock-console-engine.md](../SPEC-mock-console-engine.md)

## Overview

Build a reusable simulated SaaS-admin-console engine on top of the
platform-shell app: typed scenario data (sections → records, actions,
sequential tasks), a pure engine that constructs/replays record state and
checks attempted actions against the current task, a localStorage-backed
progress store, a `MockConsole` UI component (section nav, record list,
record detail, available actions, feedback, activity log), and a demo route
proving the whole path — navigate, act, get feedback, advance, complete,
reload, stay complete.

## Architecture Decisions

- `lib/mock-console/engine.ts` is pure, no React dependency, mirroring
  `lib/terminal-lab/match.ts` and platform-shell's `lib/quiz`. Two functions
  per the spec's public contract: `createScenarioState` (build-or-resume via
  deterministic replay of completed tasks' expected actions) and
  `attemptConsoleAction` (check one action, return new-or-same state +
  matched + feedback).
- State is reconstructed by replay rather than stored directly — resuming at
  task N replays tasks `[0, N)`'s expected actions against a fresh copy of
  the scenario's records. This means only `{ currentTaskIndex, completed }`
  needs to persist (same shape as terminal-lab-engine's progress), not a
  separate record-state snapshot — see SPEC-mock-console-engine.md Open
  Question 3.
- A wrong action returns the *same* state object reference (not a copy) —
  lets a component/test assert non-mutation with `toBe`, not just
  deep-equality.
- `lib/mock-console/load.ts` returns `null` for an unknown scenario id (same
  split as `glossary`'s `getTermById` and `terminal-lab`'s `getLabById`); the
  `/consoles/[id]` route calls Next's `notFound()`.
- `MockConsoleRunner` reuses the exact hydration-safe `useSyncExternalStore`
  pattern from `LabRunner` (two stores — one for "has the real client
  snapshot resolved yet," one for the stored progress itself — keyed so the
  console only remounts once, right after hydration settles, never on a
  later save) to avoid the infinite-loop bug already hit once in
  platform-shell and the scrollback-wiping bug avoided in terminal-lab-engine.
- Section/record navigation (which section is active, which record is
  selected) is local UI state in `MockConsole`, not part of the engine state
  or persisted progress — the spec is explicit that browsing doesn't change
  task progress.

## Task List

### Phase 1: Foundation

- [x] Task 1: Shared types + pure engine (createScenarioState, attemptConsoleAction)
- [x] Task 2: Scenario progress persistence
- [x] Task 3: Scenario content loader + demo scenario fixture

### Checkpoint: Foundation
- [x] `npm test`, `npm run typecheck`, `npm run lint` all pass
- [x] No UI yet — this checkpoint is logic-only

### Phase 2: MockConsole component

- [x] Task 4: `MockConsole` component

### Checkpoint: Component
- [x] `MockConsole` renders sections/records/actions, updates on a correct
      action, shows fallback on a wrong one without mutating, advances tasks,
      and shows completion (component tests)

### Phase 3: Route & wiring

- [x] Task 5: `/consoles/[id]` route with progress persistence

### Checkpoint: Complete
- [x] `npm run dev` → open the demo scenario → navigate sections → select
      records → take the expected action each task → see completion →
      reload → still complete → clear localStorage → back to not-started →
      unknown scenario id → 404
- [x] All spec Success Criteria met
- [ ] Review with project owner before starting the next module
      (`core-fundamentals`, `linux-powershell`, `identity-device-mgmt`, or
      `itsm-ticketing`, per CAPABILITY_MAP.md build order)

## Task Details

### Task 1: Shared types + pure engine
**Description:** Define the public contract types in
`src/types/mock-console.ts` (`MockConsoleRecord`, `MockConsoleSection`,
`MockConsoleAction`, `MockConsoleTask`, `MockConsoleScenario`,
`MockConsoleProgress`, plus the internal `MockConsoleState` and
`ConsoleActionResult` shapes). Implement `lib/mock-console/engine.ts`:
`createScenarioState(scenario, currentTaskIndex)` and
`attemptConsoleAction(scenario, state, actionId)`, exactly per
SPEC-mock-console-engine.md's Public Contract section. Pure functions, fully
unit tested.
**Acceptance criteria:**
- [x] `createScenarioState` with `currentTaskIndex: 0` returns every record
      with its original (unpatched) field values
- [x] `createScenarioState` with a later `currentTaskIndex` returns records
      reflecting every prior task's expected action applied, in order
- [x] `attemptConsoleAction` with the current task's expected action id
      applies that action's field updates, advances `currentTaskIndex` by
      one, and returns `matched: true` with the task's `successMessage`
- [x] `attemptConsoleAction` with any other action id returns the *same*
      state object reference, `matched: false`, and the current task's
      `fallbackMessage`
- [x] `attemptConsoleAction` on the final task's expected action marks the
      returned state `completed: true`
**Verification:**
- [x] Tests pass: `npm test -- lib/mock-console/engine`
- [x] Typecheck passes: `npm run typecheck`
**Dependencies:** None
**Files likely touched:** `src/types/mock-console.ts`, `src/lib/mock-console/engine.ts`, `tests/lib/mock-console/engine.test.ts`
**Estimated scope:** Medium

### Task 2: Scenario progress persistence
**Description:** Implement `lib/mock-console/progress.ts` to read/write a
scenario's progress (`currentTaskIndex`, `completed`) to `localStorage`,
mirroring `lib/terminal-lab/progress.ts`: missing/corrupted data reads as
"not started," a stable parsed-object reference per unchanged stored value
(for `useSyncExternalStore`), and validation that the stored record's
`scenarioId` matches the requested id and `currentTaskIndex` is a
non-negative integer.
**Acceptance criteria:**
- [x] Saving progress for a scenario is readable back with the same shape
- [x] Corrupted/missing localStorage data, a mismatched `scenarioId`, or a
      negative `currentTaskIndex` are all treated as "not started," not a
      crash
- [x] Clearing storage resets a scenario to not-started
- [x] Repeated reads of an unchanged stored value return the same object
      reference
**Verification:**
- [x] Tests pass: `npm test -- lib/mock-console/progress`
- [x] Typecheck passes
**Dependencies:** Task 1 (uses `MockConsoleProgress` type)
**Files likely touched:** `src/lib/mock-console/progress.ts`, `tests/lib/mock-console/progress.test.ts`
**Estimated scope:** Small

### Task 3: Scenario content loader + demo scenario fixture
**Description:** Implement `lib/mock-console/load.ts`: `getScenarioById(id)`
returning the matching `MockConsoleScenario` or `null`. Add one
product-neutral demo scenario (`content/mock-consoles/demo-scenario.ts`) with
at least two records across one section, at least one distractor action per
task, and three sequential tasks, to serve as the fixture for component tests
and the Phase 3 end-to-end check.
**Acceptance criteria:**
- [x] `getScenarioById()` returns the matching scenario for a known id
- [x] `getScenarioById()` returns `null` for an unknown id
- [x] The demo scenario has at least one action per record that is *not* any
      task's expected action, so "wrong action" tests exercise a real
      distractor rather than an action that doesn't exist on the record
**Verification:**
- [x] Tests pass: `npm test -- lib/mock-console/load`
**Dependencies:** Task 1
**Files likely touched:** `src/lib/mock-console/load.ts`, `src/content/mock-consoles/demo-scenario.ts`, `src/content/mock-consoles/index.ts`, `tests/lib/mock-console/load.test.ts`
**Estimated scope:** Small-Medium

### Task 4: `MockConsole` component
**Description:** Build the `MockConsole` component: section navigation,
a record list for the active section, a detail view for the selected record,
the actions available on that record, a live feedback region, a
session-local activity log of past attempts, and a completion state. On an
action click, calls `attemptConsoleAction` and updates local engine state;
calls an `onProgress` callback only when the action matched (progress
persistence itself is Task 5, kept out of this component, mirroring
`Terminal`/`LabRunner`).
**Acceptance criteria:**
- [x] Renders section nav, the active section's records, and (once a record
      is selected) that record's current field values and available actions
- [x] Switching sections or selecting a different record does not change
      the current task or call `onProgress`
- [x] The expected action updates the visible record fields, shows the
      task's success message, and advances to the next task
- [x] Any other action shows the task's fallback message, does not change
      any visible record field, and does not advance
- [x] After the final task's expected action, shows a completion state
**Verification:**
- [x] Tests pass: `npm test -- components/MockConsole`
**Dependencies:** Task 1
**Files likely touched:** `src/components/MockConsole.tsx`, `tests/components/MockConsole.test.tsx`
**Estimated scope:** Medium-Large

### Task 5: `/consoles/[id]` route with progress persistence
**Description:** Add the App Router route: loads the scenario via
`getScenarioById()`, calling `notFound()` for an unknown id. Build
`MockConsoleRunner` (client component, mirrors `LabRunner`): reads any
existing progress on mount via the hydration-safe `useSyncExternalStore`
pattern, seeds `MockConsole` via `createScenarioState` at the resumed task
index, and persists progress via `lib/mock-console/progress.ts` on each
`onProgress` call.
**Acceptance criteria:**
- [x] Visiting `/consoles/{known-id}` renders that scenario, starting from
      any previously saved task (reconstructed via replay, not a stored
      record snapshot)
- [x] Visiting `/consoles/{unknown-id}` renders Next's not-found UI
- [x] Completing the scenario persists completion; reloading shows it still
      complete; clearing localStorage resets it to not-started
**Verification:**
- [x] Tests pass: full suite `npm test`
- [x] Manual check: the Phase 3 checkpoint flow above, done by hand in the
      browser, including inspecting the accessibility tree and confirming
      the unknown-scenario route returns a real 404 status
**Dependencies:** Task 2, Task 3, Task 4
**Files likely touched:** `src/app/consoles/[id]/page.tsx`, `src/components/MockConsoleRunner.tsx`, `tests/app/consoles/[id]/page.test.tsx`
**Estimated scope:** Medium

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Replay-based state reconstruction silently drifts from a naive "store the whole state" approach if an action's `updates` aren't idempotent-safe to reapply in order | Low | Actions are simple field patches (`Record<string,string>` merge), always applied in the same fixed task order — no risk of order-dependent conflicts given sequential-only tasks |
| `useSyncExternalStore` double-store hydration pattern (copied from `LabRunner`) is easy to get subtly wrong in a new component | Medium | Copy the pattern verbatim from the already-browser-verified `LabRunner`, don't re-derive it; regression-test progress reference stability same as `lib/terminal-lab/progress.ts` |
| Demo scenario content accidentally resembles a real vendor's actual UI/terminology | Low | Keep the demo scenario abstract (generic "Users"/"Suspend Account" style actions), no vendor names, logos, or copied layouts — per spec Boundaries |

## Open Questions

None outstanding — spec's open questions were resolved with stated defaults
(see SPEC-mock-console-engine.md § Open Questions). Flag here if that
changes during implementation.
