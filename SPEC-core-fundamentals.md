# Spec: core-fundamentals

Module in [CAPABILITY_MAP.md](./CAPABILITY_MAP.md). Depends on: platform-shell, glossary.

## Objective

Author the first real lesson content: four short lessons covering networking
basics, OS fundamentals, hardware/troubleshooting, and terminology — the
foundation every other content module (`linux-powershell`,
`identity-device-mgmt`, `itsm-ticketing`) assumes a learner already has. This
is a content module, not an infrastructure module: platform-shell's lesson
renderer, quiz engine, and progress tracking already work generically for any
lesson id, and glossary already exists to link into — this module's entire
job is writing good lesson content and quizzes on top of that, with no new
application code.

**User:** a solo learner (currently just the project owner, reviewing as it's
built) — same as every prior module.

**Success looks like:** a learner opens any of the four lessons, reads
genuinely useful prose (not placeholder text), follows at least one link into
the glossary for a term the lesson uses, answers that lesson's quiz, gets
graded correctly, and has completion persist across a reload — the same
proven path as the platform-shell sample lesson, now with real content.

## Tech Stack

No new tech. Reuses platform-shell's existing machinery as-is:
`lib/curriculum/load.ts` (already loads any `content/lessons/*.mdx` by id
generically — not specific to the sample lesson), `lib/quiz` grading,
`lib/progress` persistence, `LessonRenderer`, `Quiz`/`QuizQuestion`, and the
`/lessons/[id]` route. Glossary cross-links are plain Markdown links to
`/glossary/[id]`, per glossary's established convention.

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
  SPEC-core-fundamentals.md
  src/
    content/
      lessons/
        networking-basics.mdx
        os-fundamentals.mdx
        hardware-troubleshooting.mdx
        terminology.mdx
      quizzes/
        networking-basics-quiz.ts
        os-fundamentals-quiz.ts
        hardware-troubleshooting-quiz.ts
        terminology-quiz.ts
        index.ts          (extended to register the four new quizzes)
  tests/
    lib/curriculum/
      core-fundamentals.test.ts   (loads each of the four lessons, asserts
                                    frontmatter + quiz resolve correctly)
```

## Code Style

Lesson frontmatter and quiz data follow exactly the shape already defined in
`src/types/curriculum.ts` and proven by `sample-lesson.mdx` — no schema
changes:

```yaml
---
id: networking-basics
moduleId: core-fundamentals
title: Networking Basics
order: 1
summary: One sentence a lesson list could show.
quizId: networking-basics-quiz
---
```

- Each lesson has 2–4 short sections of prose (roughly 300–600 words total —
  enough to teach the concept, not a textbook chapter) and links to at least
  one relevant glossary term via `[term](/glossary/id)`, reusing an existing
  glossary entry or noting in Open Questions if a needed term doesn't exist
  yet.
- Each quiz has 2–3 questions mixing multiple-choice and fill-in-blank, per
  the existing `lib/quiz` grading rules (fill-in-blank: case-insensitive,
  trimmed, whitespace-collapsed).
- `order` values are sequential within `moduleId: core-fundamentals`
  (1 through 4) — `curriculum-sequencing` will read this later; no UI in this
  module surfaces ordering (see Boundaries).

## Testing Strategy

- **Unit:** one test file asserting all four lessons load via
  `loadLesson()`, their frontmatter parses into a valid `Lesson`, and each
  resolves its referenced quiz — the same shape of coverage
  `tests/lib/curriculum/load.test.ts` already gives the sample lesson, now
  parametrized or repeated across the four real lessons.
- **No new component/route tests** — `LessonRenderer`, `Quiz`, and the
  `/lessons/[id]` route are already covered generically by platform-shell's
  test suite; this module doesn't change their behavior, only adds data for
  them to render.
- **Browser:** manually verify at least one full lesson end-to-end (open →
  read → follow a glossary link → come back → answer quiz → graded → reload
  → still complete), and spot-check the other three render without errors.

## Boundaries

- **Always:** run `npm test`, `npm run typecheck`, `npm run lint` before
  considering a task in this module done. Every glossary link in lesson
  content must point to a glossary id that actually exists.
- **Ask first:** adding any new npm dependency; changing the `Lesson`/`Quiz`
  content schema; adding a lesson *index/listing* page — that's explicitly
  `curriculum-sequencing`'s job per the capability map, not this module's.
- **Never:** commit secrets/API keys; add real user accounts/auth; make real
  network calls.

## Success Criteria

- Four lessons (`networking-basics`, `os-fundamentals`,
  `hardware-troubleshooting`, `terminology`) each render at `/lessons/[id]`
  with real, accurate, non-placeholder prose.
- Each lesson embeds a working quiz (2–3 questions, both question types
  represented across the four lessons) that grades correctly, including a
  fill-in-blank answer that differs only in case/whitespace being graded
  correct.
- Each lesson contains at least one working link to an existing glossary
  entry.
- Reloading a completed lesson shows it still complete (read back from
  localStorage), consistent with every prior lesson.
- `npm test` passes; `npm run typecheck` and `npm run lint` pass clean.

## Open Questions

1. **Glossary coverage gaps.** The current glossary (SSO, MDM, SLA,
   escalation, ticket queue, AD, GPO, endpoint) is identity/ITSM-leaning, not
   networking/OS-leaning. Defaulting to: link to whichever existing glossary
   terms are genuinely relevant (e.g. "endpoint" fits OS/hardware content
   naturally), and where a lesson needs a term that doesn't exist yet (e.g.
   "IP address," "DNS," "process"), either add it to the glossary content in
   this module (cheap, no schema change) or skip the link rather than force
   an irrelevant one. Resolving per-lesson during authoring rather than
   deciding abstractly here.
2. **Lesson depth.** Defaulting to short, focused lessons (300–600 words)
   over comprehensive textbook-style coverage — this is a bootcamp-style
   catalog, not a reference manual, and `curriculum-sequencing` will chain
   many such lessons together later.
