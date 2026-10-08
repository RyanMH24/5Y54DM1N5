# Spec: linux-powershell

Module in [CAPABILITY_MAP.md](./CAPABILITY_MAP.md). Depends on: platform-shell, glossary, terminal-lab-engine.

## Objective

Author the first hands-on content: two lessons — Linux CLI fundamentals and
PowerShell fundamentals — each paired with a terminal-lab-engine lab so a
learner reads the concept, then immediately practices the exact commands in
a simulated terminal. Like `core-fundamentals`, this is a content module:
platform-shell's lesson/quiz machinery and terminal-lab-engine's `Terminal`
component already work generically for any lesson/lab id. This module's job
is writing good lesson content, quizzes, and lab scenarios on top of that —
no new application code.

**User:** a solo learner (currently just the project owner, reviewing as it's
built) — same as every prior module.

**Success looks like:** a learner opens the Linux lesson, reads real
prose about navigating a filesystem and basic scripting, follows a link into
the paired lab, types the commands they just read about, gets realistic
output and completes the lab, returns to the lesson, answers its quiz
correctly, and has both the lesson's and the lab's completion persist across
a reload. Same proven path twice, once per platform.

## Tech Stack

No new tech. Reuses existing machinery as-is: `lib/curriculum/load.ts`,
`lib/quiz`, `lib/progress`, `LessonRenderer`, `Quiz`/`QuizQuestion`, and
`/lessons/[id]` for lesson content; `lib/terminal-lab/load.ts`,
`lib/terminal-lab/match.ts`, `lib/terminal-lab/progress.ts`, `Terminal`,
`LabRunner`, and `/labs/[id]` for the hands-on labs. Lesson-to-lab links are
plain Markdown links (`[try it](/labs/id)`), the same convention glossary
cross-links already established.

## Commands

Same as every prior module (shared app):

```
Dev:       npm run dev
Build:     npm run build
Start:     npm run start
Test:      npm test              # vitest run
Lint:      npm run lint
Typecheck: npm run typecheck     # tsc --noEmit
```

## Project Structure

No new directories — content lands in the existing locations:

```
sysadmin-academy/
  SPEC-linux-powershell.md
  src/
    content/
      lessons/
        linux-cli-basics.mdx
        powershell-basics.mdx
      quizzes/
        linux-cli-basics-quiz.ts
        powershell-basics-quiz.ts
        index.ts            (extended to register the two new quizzes)
      labs/
        linux-cli-basics-lab.ts
        powershell-basics-lab.ts
        index.ts            (extended to register the two new labs)
  tests/
    lib/curriculum/
      linux-powershell.test.ts     (loads each lesson, asserts frontmatter +
                                     quiz resolve, same shape as
                                     core-fundamentals.test.ts)
    lib/terminal-lab/
      linux-powershell.test.ts     (loads each lab, asserts it resolves and
                                     has a sane step count)
```

## Code Style

Lesson frontmatter, quiz data, and lab data all follow the shapes already
defined in `src/types/curriculum.ts` and `src/types/terminal-lab.ts` — no
schema changes anywhere.

```yaml
---
id: linux-cli-basics
moduleId: linux-powershell
title: Linux CLI Fundamentals
order: 1
summary: One sentence a lesson list could show.
quizId: linux-cli-basics-quiz
---
```

- Each lesson has 300–600 words of real prose, ends with a plain Markdown
  link to its paired lab (`[Try it in the lab](/labs/linux-cli-basics)`),
  and embeds its quiz via `<Quiz id="..." />` — **the exact tag is required
  in the body**, not just the frontmatter `quizId` (core-fundamentals hit
  this bug: frontmatter alone resolves the quiz for the loader, but doesn't
  render it — the regression test added there now also covers these two
  lessons).
- Each lab's steps use commands that match exactly what the paired lesson
  just taught, in the same order the lesson introduces them, so "read then
  do" feels continuous rather than jumping around.
- `order` values are sequential within `moduleId: linux-powershell` (1 and
  2) — same convention as `core-fundamentals`.

## Testing Strategy

- **Unit:** two regression test files, mirroring `core-fundamentals.test.ts`
  and the existing `lib/terminal-lab` test patterns — one asserting both
  lessons load with valid frontmatter, a resolvable quiz, *and* a `<Quiz
  id="..." />` tag present in the body (catching the core-fundamentals
  bug class directly); one asserting both labs load via `getLabById()` with
  a sane step count.
- **No new component/route tests** — `LessonRenderer`, `Quiz`, `Terminal`,
  `LabRunner`, and their routes are already covered generically; this module
  only adds data for them to render.
- **Browser:** manually verify at least one full lesson→lab path end-to-end
  (open lesson → read → follow the lab link → complete the lab → quiz back
  on the lesson → graded → reload both → still complete), and spot-check the
  other lesson/lab pair renders without errors.

## Boundaries

- **Always:** run `npm test`, `npm run typecheck`, `npm run lint` before
  considering a task in this module done. Every lesson→lab link must point
  to a lab id that actually exists and is loadable.
- **Ask first:** adding any new npm dependency; changing the `Lesson`/`Quiz`
  or `TerminalLab` content schemas; adding a lesson/lab *index* page — still
  `curriculum-sequencing`'s job, not this module's.
- **Never:** commit secrets/API keys; add real user accounts/auth; make real
  network calls; have a lab execute typed input as a real shell command —
  `terminal-lab-engine`'s existing pattern-match-only behavior is unchanged.

## Success Criteria

- Two lessons (`linux-cli-basics`, `powershell-basics`) each render at
  `/lessons/[id]` with real, accurate, non-placeholder prose and a working
  embedded quiz.
- Two labs (`linux-cli-basics-lab`, `powershell-basics-lab`) each render at
  `/labs/[id]`, their steps matching commands the paired lesson just taught,
  and are completable.
- Each lesson links to its paired lab; each quiz grades correctly, including
  a fill-in-blank answer that differs only in case/whitespace being graded
  correct.
- Reloading a completed lesson or lab shows it still complete, consistent
  with every prior module.
- `npm test` passes; `npm run typecheck` and `npm run lint` pass clean.

## Open Questions

1. **Scripting depth.** "CLI fundamentals & scripting" could mean a third,
   separate scripting-focused lesson per platform. Defaulting to folding a
   light taste of scripting (one variable, one loop or conditional) into
   each platform's single fundamentals lesson rather than adding two more
   lessons — keeps scope matched to `core-fundamentals`' precedent (short,
   focused lessons) and leaves room for a dedicated scripting module later
   if the catalog wants to go deeper.
2. **Lab step count.** Defaulting to 3–4 steps per lab (matching
   `terminal-lab-engine`'s own sample lab), covering the handful of commands
   each lesson actually introduces rather than exhaustively drilling every
   command mentioned.
