# Implementation Plan: terminal-lab-engine

Spec: [../SPEC-terminal-lab-engine.md](../SPEC-terminal-lab-engine.md)

## Overview

Build a reusable simulated-terminal engine on top of the platform-shell app:
typed lab/step/match data, a pure command-matching function, a pure
localStorage-backed progress store (current step + completion), a `Terminal`
UI component that ties them together, and a demo route proving the whole
path — type a command, see matched output, advance, complete the lab,
reload, stay complete.

## Architecture Decisions

- `lib/terminal-lab/match.ts` and `lib/terminal-lab/progress.ts` are pure
  functions with no React dependency, mirroring `lib/quiz`/`lib/progress`
  from platform-shell and `lib/glossary` — testable in isolation, UI built on
  top.
- String pattern matching reuses the exact normalization rule from
  platform-shell's fill-in-blank grading (case-insensitive, trimmed,
  whitespace-collapsed), for one consistent "how matching works" mental model
  across the app. `RegExp` patterns are tested as-is via `.test()`.
- Steps are strictly sequential (current step index, not a set of completed
  step ids) — see SPEC-terminal-lab-engine.md Open Question 1. This keeps the
  progress shape and the component's state machine simple: one number (how
  far the learner got) plus a completed flag.
- `lib/terminal-lab/load.ts` returns `null` for an unknown lab id (like
  `glossary`'s `getTermById`), and the `/labs/[id]` route calls Next's
  `notFound()` when that happens — consistent with how glossary handles a
  missing id.

## Task List

### Phase 1: Foundation

- [x] Task 1: Shared types + command-matching logic
- [x] Task 2: Lab progress persistence
- [x] Task 3: Lab content loader + sample lab fixture

### Checkpoint: Foundation
- [x] `npm test`, `npm run typecheck`, `npm run lint` all pass
- [x] No UI yet — this checkpoint is logic-only

### Phase 2: Terminal component

- [x] Task 4: `Terminal` component

### Checkpoint: Component
- [x] `Terminal` renders the current step, matches/advances, falls back, and
      shows completion (component tests)

### Phase 3: Route & wiring

- [x] Task 5: `/labs/[id]` route with progress persistence

### Checkpoint: Complete
- [x] `npm run dev` → open the sample lab → type matching commands through
      every step → see completion → reload → still complete → clear
      localStorage → back to not-started
- [x] All spec Success Criteria met
- [x] Review with project owner before starting the next module
      (`mock-console-engine`, or others per CAPABILITY_MAP.md build order)

## Task Details

### Task 1: Shared types + command-matching logic
**Description:** Define `TerminalCommandMatch`, `TerminalLabStep`,
`TerminalLab` in `src/types/terminal-lab.ts`. Implement
`lib/terminal-lab/match.ts`: given a step and a typed command, return the
matched output (first pattern in `matches` that matches, string patterns
normalized per the fill-in-blank rule, `RegExp` patterns tested as-is) or the
step's `fallbackOutput` when nothing matches. Pure function, fully unit
tested.
**Acceptance criteria:**
- [x] A string pattern matches case-insensitively, trimmed, with internal
      whitespace collapsed
- [x] A `RegExp` pattern matches via `.test()`
- [x] The first matching pattern in a step's `matches` list wins when more
      than one could match
- [x] An unmatched command returns the step's `fallbackOutput`
**Verification:**
- [x] Tests pass: `npm test -- lib/terminal-lab/match`
- [x] Typecheck passes: `npm run typecheck`
**Dependencies:** None
**Files likely touched:** `src/types/terminal-lab.ts`, `src/lib/terminal-lab/match.ts`, `tests/lib/terminal-lab/match.test.ts`
**Estimated scope:** Small-Medium

### Task 2: Lab progress persistence
**Description:** Implement `lib/terminal-lab/progress.ts` to read/write a
lab's progress (current step index, completed flag) to `localStorage`, with
the same safety rules as platform-shell's `lib/progress`: missing/corrupted
data reads as "not started," not a crash; a stable parsed-object reference
per unchanged stored value (needed for `useSyncExternalStore`, per the bug
fixed in platform-shell's `lib/progress/storage.ts`).
**Acceptance criteria:**
- [x] Saving progress for a lab is readable back with the same shape
- [x] Corrupted/missing localStorage data is treated as "not started," not a
      crash
- [x] Clearing storage resets a lab to not-started
- [x] Repeated reads of an unchanged stored value return the same object
      reference
**Verification:**
- [x] Tests pass: `npm test -- lib/terminal-lab/progress`
- [x] Typecheck passes
**Dependencies:** Task 1 (uses lab/step id types)
**Files likely touched:** `src/lib/terminal-lab/progress.ts`, `tests/lib/terminal-lab/progress.test.ts`
**Estimated scope:** Small

### Task 3: Lab content loader + sample lab fixture
**Description:** Implement `lib/terminal-lab/load.ts`: `getLabById(id)`
returning the matching `TerminalLab` or `null`. Add one sample lab
(`content/labs/sample-lab.ts`, e.g. a short filesystem-exploration scenario)
with at least three steps, to serve as the fixture used by component tests
and the Phase 3 end-to-end check.
**Acceptance criteria:**
- [x] `getLabById()` returns the matching lab for a known id
- [x] `getLabById()` returns `null` for an unknown id (not a throw — the
      route layer decides how to turn that into a 404, same split as
      glossary's `getTermById`)
**Verification:**
- [x] Tests pass: `npm test -- lib/terminal-lab/load`
**Dependencies:** Task 1
**Files likely touched:** `src/lib/terminal-lab/load.ts`, `src/content/labs/sample-lab.ts`, `src/content/labs/index.ts`, `tests/lib/terminal-lab/load.test.ts`
**Estimated scope:** Small

### Task 4: `Terminal` component
**Description:** Build the `Terminal` component: shows the current step's
instructions, a scrollback of past `{command, output}` entries, and a
command input. On submit, matches the typed command against the current
step via `lib/terminal-lab/match.ts`, appends the result to history, and
advances to the next step on a match (or shows a completion state after the
last step); does not advance on a non-match. Calls an `onProgress` callback
so the page layer can persist state (progress persistence itself is Task 5,
kept out of this component per platform-shell's `Quiz`/`LessonQuiz` split).
**Acceptance criteria:**
- [x] Renders the current step's instructions
- [x] A matching command shows its output and advances to the next step
- [x] A non-matching command shows the step's fallback output and stays on
      the same step
- [x] After the last step's command matches, shows a completion state
**Verification:**
- [x] Tests pass: `npm test -- components/Terminal`
**Dependencies:** Task 1
**Files likely touched:** `src/components/Terminal.tsx`, `tests/components/Terminal.test.tsx`
**Estimated scope:** Medium

### Task 5: `/labs/[id]` route with progress persistence
**Description:** Add the App Router route: loads the lab via
`getLabById()`, calling `notFound()` for an unknown id. Reads any existing
progress on mount and starts the `Terminal` at the saved step; on each step
advance/completion (via `Terminal`'s `onProgress` callback), persists
progress via `lib/terminal-lab/progress.ts`. Mirrors platform-shell's
`LessonQuiz`/`useSyncExternalStore` pattern for the hydration-safe
localStorage read.
**Acceptance criteria:**
- [x] Visiting `/labs/{known-id}` renders that lab's `Terminal`, starting
      from any previously saved step
- [x] Visiting `/labs/{unknown-id}` renders Next's not-found UI
- [x] Completing the lab persists completion; reloading shows it still
      complete; clearing localStorage resets it to not-started
**Verification:**
- [x] Tests pass: full suite `npm test`
- [x] Manual check: the Phase 3 checkpoint flow above, done by hand in the
      browser
**Dependencies:** Task 2, Task 3, Task 4
**Files likely touched:** `src/app/labs/[id]/page.tsx`, `tests/app/labs/[id]/page.test.tsx`
**Estimated scope:** Medium

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| `useSyncExternalStore` + localStorage repeats the infinite-loop bug already hit once in platform-shell | Medium | Reuse the exact caching pattern from the fix in `lib/progress/storage.ts` (cache parsed value keyed by raw stored string) directly in `lib/terminal-lab/progress.ts`, and regression-test reference stability (Task 2) |
| Sequential-only steps feel too rigid once real Linux/PowerShell labs are authored | Low | Explicitly deferred per SPEC-terminal-lab-engine.md Open Question 1 — revisit when `linux-powershell` has a concrete need for branching/optional steps |
| `RegExp` patterns authored in content data could be accidentally catastrophic (ReDoS) if content ever comes from an untrusted source | Low | Not a real risk today — lab content is authored in-repo TS files, not user input; flag if content ever becomes user-submitted |

## Open Questions

None outstanding — spec's three open questions were resolved with stated
defaults (see SPEC-terminal-lab-engine.md § Open Questions). Flag here if
that changes during implementation.
