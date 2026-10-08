# Implementation Plan: core-fundamentals

Spec: [../SPEC-core-fundamentals.md](../SPEC-core-fundamentals.md)

## Overview

Author four short, real lessons (networking basics, OS fundamentals,
hardware/troubleshooting, terminology), each with a working quiz and at
least one glossary cross-link, on top of platform-shell's already-generic
lesson/quiz/progress machinery. No new application code — this is content
authoring, verified by the existing test/render/grading pipeline.

## Architecture Decisions

- `lib/curriculum/load.ts` already loads any `content/lessons/*.mdx` by id
  generically (proven by `sample-lesson.mdx`) — no loader changes needed.
  Each new lesson just needs correct frontmatter (`id`, `moduleId: "core-
  fundamentals"`, `title`, `order`, `summary`, `quizId`) and a registered
  quiz in `content/quizzes/index.ts`.
- The glossary currently leans identity/ITSM (SSO, MDM, SLA, escalation,
  ticket queue, AD, GPO, endpoint) with no networking terms. Rather than
  force an irrelevant link from the networking lesson, add two small,
  genuinely useful glossary entries (`dns`, `ip-address`) as part of Task 1
  — cheap, no schema change, and useful to later modules too. The other
  three lessons link to terms that already exist.
- No lesson-index/listing page is built here — per the spec's Boundaries,
  that's `curriculum-sequencing`'s job. Lessons are reachable directly at
  `/lessons/[id]`, same as the platform-shell sample lesson today.

## Task List

### Phase 1: Content

- [ ] Task 1: Networking Basics lesson + quiz (+ two new glossary terms)
- [ ] Task 2: OS Fundamentals lesson + quiz
- [ ] Task 3: Hardware & Troubleshooting lesson + quiz
- [ ] Task 4: Terminology lesson + quiz

### Checkpoint: Content
- [x] All four lessons load via `loadLesson()`, frontmatter is valid, each
      resolves its quiz (regression test covering all four)
- [x] `npm test`, `npm run typecheck`, `npm run lint` all pass

### Phase 2: Verification

- [x] Task 5: Full-suite regression test + browser verification

### Checkpoint: Complete
- [x] One full lesson walked end-to-end in the browser: open → read →
      follow a glossary link → return → answer quiz → graded correctly →
      reload → still complete
- [x] The other three lessons spot-checked to render without errors and
      their glossary links resolve
- [x] All spec Success Criteria met
- [ ] Review with project owner before starting the next module
      (`linux-powershell`, `identity-device-mgmt`, `itsm-ticketing`, per
      CAPABILITY_MAP.md build order)

## Task Details

### Task 1: Networking Basics lesson + quiz
**Description:** Write `content/lessons/networking-basics.mdx` (IP
addressing basics, DNS, what a network/subnet is — 300–600 words) and
`content/quizzes/networking-basics-quiz.ts` (2–3 questions). Add `dns` and
`ip-address` entries to `content/glossary/terms.ts` so the lesson can link
to them naturally; link at least one in the lesson body.
**Acceptance criteria:**
- [x] Lesson frontmatter is valid (`id: networking-basics`, `moduleId: core-
      fundamentals`, `order: 1`, correct `quizId`)
- [x] Lesson links to at least one of the two new glossary terms
- [x] Quiz has 2–3 questions and grades correctly (manual spot-check or unit
      test via existing `lib/quiz` tests against the new question data)
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
- [x] `npm test -- lib/glossary` still passes (new terms don't break search)
**Dependencies:** None
**Files likely touched:** `src/content/lessons/networking-basics.mdx`, `src/content/quizzes/networking-basics-quiz.ts`, `src/content/quizzes/index.ts`, `src/content/glossary/terms.ts`
**Estimated scope:** Small-Medium

### Task 2: OS Fundamentals lesson + quiz
**Description:** Write `content/lessons/os-fundamentals.mdx` (what an
operating system does, processes, the filesystem — 300–600 words) and
`content/quizzes/os-fundamentals-quiz.ts`. Link to the existing `endpoint`
glossary term.
**Acceptance criteria:**
- [x] Lesson frontmatter is valid (`order: 2`, correct `quizId`)
- [x] Lesson links to the `endpoint` glossary term
- [x] Quiz has 2–3 questions and grades correctly
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
**Dependencies:** None
**Files likely touched:** `src/content/lessons/os-fundamentals.mdx`, `src/content/quizzes/os-fundamentals-quiz.ts`, `src/content/quizzes/index.ts`
**Estimated scope:** Small-Medium

### Task 3: Hardware & Troubleshooting lesson + quiz
**Description:** Write `content/lessons/hardware-troubleshooting.mdx` (core
hardware components, a basic troubleshooting method — 300–600 words) and
`content/quizzes/hardware-troubleshooting-quiz.ts`. Link to the existing
`endpoint` glossary term.
**Acceptance criteria:**
- [x] Lesson frontmatter is valid (`order: 3`, correct `quizId`)
- [x] Lesson links to a relevant glossary term
- [x] Quiz has 2–3 questions and grades correctly
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
**Dependencies:** None
**Files likely touched:** `src/content/lessons/hardware-troubleshooting.mdx`, `src/content/quizzes/hardware-troubleshooting-quiz.ts`, `src/content/quizzes/index.ts`
**Estimated scope:** Small-Medium

### Task 4: Terminology lesson + quiz
**Description:** Write `content/lessons/terminology.mdx` (a tour of the
acronyms/terms a sysadmin hears day to day — 300–600 words) and
`content/quizzes/terminology-quiz.ts`. This lesson is the natural home for
multiple glossary links since it's specifically about terminology — link to
several existing terms (e.g. `sso`, `ad`, `gpo`, `escalation`).
**Acceptance criteria:**
- [x] Lesson frontmatter is valid (`order: 4`, correct `quizId`)
- [x] Lesson links to at least three existing glossary terms
- [x] Quiz has 2–3 questions and grades correctly
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
**Dependencies:** None
**Files likely touched:** `src/content/lessons/terminology.mdx`, `src/content/quizzes/terminology-quiz.ts`, `src/content/quizzes/index.ts`
**Estimated scope:** Small-Medium

### Task 5: Full-suite regression test + browser verification
**Description:** Add `tests/lib/curriculum/core-fundamentals.test.ts`
asserting all four lessons load, parse, and resolve their quizzes (same
shape as the existing sample-lesson coverage). Run the full suite,
typecheck, lint, and build. Manually walk one lesson end-to-end in the
browser and spot-check the other three.
**Acceptance criteria:**
- [x] All four lessons load successfully via `loadLesson()` with valid
      frontmatter and a resolvable quiz
- [x] `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` all
      pass
**Verification:**
- [x] Tests pass: full suite `npm test`
- [x] Manual check: the Phase 2 checkpoint flow above, done by hand in the
      browser
**Dependencies:** Task 1, Task 2, Task 3, Task 4
**Files likely touched:** `tests/lib/curriculum/core-fundamentals.test.ts`
**Estimated scope:** Small

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content quality is the only real risk in a content-only module — inaccurate or placeholder-feeling prose would defeat the point | Medium | Write genuine, accurate, concise lesson content per task; no lorem-ipsum or stub text |
| A lesson's glossary link points to a term that doesn't exist (typo in id) | Low | Regression test (Task 5) + manual spot-check cover this; glossary ids are a small, known, fixed set |

## Open Questions

None outstanding — spec's two open questions were resolved with stated
defaults (see SPEC-core-fundamentals.md § Open Questions). Flag here if that
changes during implementation.
