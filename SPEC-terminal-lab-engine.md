# Spec: terminal-lab-engine

Module in [CAPABILITY_MAP.md](./CAPABILITY_MAP.md). Depends on: platform-shell.

## Objective

A reusable simulated CLI component: a fake terminal that pattern-matches
commands a learner types against the expected commands for a lab's current
step, and shows canned output. This is infrastructure, not content — the
`linux-powershell` module will author real Linux/PowerShell labs on top of
it later. This module's job is to prove the engine works end-to-end with one
demo lab.

Per the capability map's cross-module decisions: labs are simulated (fake
terminal, pattern-matched commands/output), not real sandboxes — no real
shell, no containers, no network access from the "terminal."

**User:** a solo learner (currently just the project owner, reviewing as it's
built) — same as platform-shell and glossary.

**Success looks like:** a learner opens a lab, reads the current step's
instructions, types a command, sees realistic output and advances when it
matches what's expected, sees a hint/fallback when it doesn't, and sees the
lab marked complete — persisted across reload — after finishing every step.

## Tech Stack

- Reuses the platform-shell app: Next.js (App Router) + TypeScript + React,
  Vitest + React Testing Library, npm.
- No new dependencies — command matching is plain string/RegExp comparison,
  not a terminal-emulator library (xterm.js, etc.); there's no real PTY or
  shell underneath, just typed input matched against step data.
- No CSS framework — plain unstyled markup (per the project's deferred
  UI/visual design decision).

## Commands

Same as platform-shell and glossary (shared app):

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
  SPEC-terminal-lab-engine.md
  src/
    app/
      labs/
        [id]/page.tsx        → loads a lab by id and renders the Terminal
    content/
      labs/                  → structured lab data (steps, matches, output), keyed by id
    components/
      Terminal.tsx            → the simulated CLI: history, current-step prompt, input
    lib/
      terminal-lab/
        load.ts               → get a lab by id (not-found handling)
        match.ts               → pure command-matching against a step's patterns
        progress.ts             → localStorage read/write for lab completion
    types/
      terminal-lab.ts          → TerminalLab, TerminalLabStep, TerminalLabProgress types
  tests/                    → mirrors src/, as in platform-shell and glossary
```

## Code Style

```ts
// src/types/terminal-lab.ts
export interface TerminalCommandMatch {
  pattern: string | RegExp; // string: case-insensitive, trimmed, whitespace-collapsed exact match
  output: string;
}

export interface TerminalLabStep {
  id: string;
  instructions: string;
  matches: TerminalCommandMatch[]; // checked in order; first match wins
  fallbackOutput: string; // shown when no pattern in `matches` matches
}

export interface TerminalLab {
  id: string;
  title: string;
  steps: TerminalLabStep[]; // completed strictly in order
}
```

- Same conventions as platform-shell/glossary: explicit/narrow types, pure
  functions for logic that doesn't need React (`lib/terminal-lab/match.ts`,
  `lib/terminal-lab/progress.ts`), content data kept separate from the
  component that renders it.
- String pattern matching reuses platform-shell's fill-in-blank normalization
  rule (case-insensitive, trimmed, whitespace-collapsed) for consistency
  across the app; `RegExp` patterns are tested as-is, for labs that need to
  accept more than one phrasing of a command (e.g. `ls` with or without
  flags).
- Steps are strictly sequential — a step only becomes current once every
  prior step in the lab is complete. This mirrors how a real lab walkthrough
  works and keeps the engine's state machine simple (current step index +
  history), rather than tracking arbitrary per-step completion.

## Testing Strategy

Vitest + React Testing Library, same split as platform-shell/glossary:

- **Unit (high coverage expected):** `lib/terminal-lab/match.ts` (string
  normalization matching, RegExp matching, first-match-wins ordering,
  fallback when nothing matches), `lib/terminal-lab/load.ts` (resolving a lab
  by id, not-found handling), `lib/terminal-lab/progress.ts` (localStorage
  read/write, corrupted/missing data treated as not-started, same pattern as
  platform-shell's `lib/progress`).
- **Component (smoke-level):** `Terminal` renders the current step's
  instructions, accepts typed input, shows matched output and advances on a
  correct command, shows fallback output and does not advance on an
  incorrect one, and shows a completion state after the last step.
- Tests live under `tests/`, mirroring the `src/` path of what they cover.

## Boundaries

- **Always:** run `npm test`, `npm run typecheck`, `npm run lint` before
  considering a task in this module done. Keep lab content data separate
  from the matching/progress logic and from the `Terminal` component.
- **Ask first:** adding any new npm dependency (e.g. a real terminal-emulator
  library); changing the lab data schema once `linux-powershell` starts
  authoring real labs against it; anything implying ongoing hosting cost.
- **Never:** commit secrets/API keys; add real user accounts/auth; execute
  typed input as real shell commands or make real network/filesystem calls
  from the terminal component — it only ever pattern-matches against static
  lab data.

## Success Criteria

- A lab's current step instructions are visible, and typing a command that
  matches one of that step's patterns shows the matched output and advances
  to the next step.
- Typing a command that matches nothing shows the step's fallback output and
  the learner stays on the same step.
- Command history persists visibly within the session (scrollback), even
  after advancing past a step.
- After completing every step, the lab shows a completion state; reloading
  the page shows it still complete (read back from localStorage); clearing
  localStorage resets it to not-started.
- `npm test` passes, with high coverage on `lib/terminal-lab`.
- `npm run typecheck` and `npm run lint` pass clean.

## Open Questions

1. **Step ordering.** Defaulting to strictly sequential steps (see Code
   Style) rather than letting a learner attempt steps out of order. Revisit
   if `linux-powershell` wants branching or optional steps later.
2. **Match strictness for string patterns.** Defaulting to reusing
   platform-shell's fill-in-blank normalization (case-insensitive, trimmed,
   whitespace-collapsed) for consistency, with `RegExp` as the escape hatch
   for labs that need to accept multiple command forms. No fuzzy/typo-tolerant
   matching.
3. **Progress granularity.** Defaulting to lab-level completion plus which
   step the learner has reached (enough to resume where they left off), not
   a full replay-able transcript of every command typed. A full history
   persisted across reloads can be added later if a module actually needs it.
