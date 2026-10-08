# Spec: identity-device-mgmt

Module in [CAPABILITY_MAP.md](./CAPABILITY_MAP.md). Depends on: platform-shell, glossary, mock-console-engine.

## Objective

Author two lesson→scenario pairs covering the concepts behind Okta-style
SSO/identity management, Microsoft AD/Entra ID directory basics, and
Jamf-style Apple MDM device management — a learner reads the concept, then
practices the matching workflow in a simulated admin console. Like
`linux-powershell`, this is a content module: platform-shell's lesson/quiz
machinery and mock-console-engine's `MockConsole` already work generically
for any lesson/scenario id. This module's job is writing good lesson
content and console scenarios on top of that — no new application code.

Per mock-console-engine's own spec boundary ("never imply the mock console
is a real vendor product"), the two console scenarios are **product-neutral**
— themed around the real workflows (provisioning a user, enrolling and
locking a device) without copying Okta's or Jamf's actual branding, layout,
or terminology. This mirrors how `mock-console-engine`'s own demo scenario
used "Directory Admin" rather than a real product name.

**User:** a solo learner (currently just the project owner, reviewing as it's
built) — same as every prior module.

**Success looks like:** a learner opens the identity lesson, reads real
prose about SSO/AD/Entra ID concepts and the user lifecycle, follows a link
into the paired identity console scenario, provisions and later deactivates
a user by taking the correct actions, returns to the lesson, answers its
quiz correctly, and has both the lesson's and the scenario's completion
persist across a reload. Same proven path again, this time with
`mock-console-engine` instead of `terminal-lab-engine`.

## Tech Stack

No new tech. Reuses existing machinery as-is: `lib/curriculum/load.ts`,
`lib/quiz`, `lib/progress`, `LessonRenderer`, `Quiz`/`QuizQuestion`, and
`/lessons/[id]` for lesson content; `lib/mock-console/load.ts`,
`lib/mock-console/engine.ts`, `lib/mock-console/progress.ts`,
`MockConsole`, `MockConsoleRunner`, and `/consoles/[id]` for the guided
scenarios. Lesson-to-scenario links are plain Markdown links
(`[try it](/consoles/id)`), same convention as every prior cross-link.

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
  SPEC-identity-device-mgmt.md
  src/
    content/
      lessons/
        identity-access-basics.mdx
        apple-mdm-basics.mdx
      quizzes/
        identity-access-basics-quiz.ts
        apple-mdm-basics-quiz.ts
        index.ts            (extended to register the two new quizzes)
      mock-consoles/
        identity-console-scenario.ts
        device-console-scenario.ts
        index.ts            (extended to register the two new scenarios)
  tests/
    lib/curriculum/
      identity-device-mgmt.test.ts   (mirrors linux-powershell.test.ts:
                                       lessons load, quiz resolves, the
                                       `<Quiz id="..." />` tag is present,
                                       each links to its paired scenario)
    lib/mock-console/
      identity-device-mgmt.test.ts   (loads each scenario, asserts it
                                       resolves and the expected actions for
                                       its tasks actually exist on the
                                       right records)
```

## Code Style

Lesson frontmatter, quiz data, and scenario data all follow the shapes
already defined in `src/types/curriculum.ts` and `src/types/mock-console.ts`
— no schema changes anywhere.

```yaml
---
id: identity-access-basics
moduleId: identity-device-mgmt
title: Identity & Access Fundamentals
order: 1
summary: One sentence a lesson list could show.
quizId: identity-access-basics-quiz
---
```

- Each lesson has 300–600 words of real prose, ends with a plain Markdown
  link to its paired scenario (`[Try it in the console](/consoles/id)`),
  and embeds its quiz via `<Quiz id="..." />` **in the body** — not just
  the frontmatter `quizId` (the bug class hit once in `core-fundamentals`
  and guarded against since; the regression test here asserts it directly,
  same as `linux-powershell.test.ts`).
- Each scenario's tasks walk the exact workflow its paired lesson just
  described (e.g. provision → assign access → deactivate), using
  product-neutral section/action labels ("Provision Account," "Assign App
  Access," not any real vendor's actual button text).
- `order` values are sequential within `moduleId: identity-device-mgmt`
  (1 and 2) — same convention as `core-fundamentals`/`linux-powershell`.

## Testing Strategy

- **Unit:** two regression test files, mirroring the `linux-powershell`
  pattern — one asserting both lessons load with valid frontmatter, a
  resolvable quiz, the `<Quiz id="..." />` body tag, and a link to their
  paired scenario; one asserting both scenarios load via
  `getScenarioById()` and that every task's `expectedActionId` actually
  exists in the scenario's `actions` list on the right record (a content
  typo here would otherwise only surface as "nothing I click ever works" in
  the browser).
- **No new component/route tests** — `LessonRenderer`, `Quiz`,
  `MockConsole`, `MockConsoleRunner`, and their routes are already covered
  generically; this module only adds data for them to render.
- **Browser:** manually verify at least one full lesson→scenario path
  end-to-end (open lesson → read → follow the console link → complete the
  scenario → quiz back on the lesson → graded → reload both → still
  complete), and spot-check the other lesson/scenario pair renders without
  errors.

## Boundaries

- **Always:** run `npm test`, `npm run typecheck`, `npm run lint` before
  considering a task in this module done. Every lesson→scenario link must
  point to a scenario id that actually exists and is loadable. Scenario
  content stays product-neutral per mock-console-engine's own boundary.
- **Ask first:** adding any new npm dependency; changing the `Lesson`/`Quiz`
  or `MockConsoleScenario` content schemas; adding a lesson/scenario *index*
  page — still `curriculum-sequencing`'s job, not this module's.
- **Never:** commit secrets/API keys; add real user accounts/auth; make real
  network calls; connect to Okta, Microsoft Entra ID, or Jamf; use their
  real branding, logos, or copied UI text — inherited directly from
  `mock-console-engine`'s own "never imply a real vendor product" rule.

## Success Criteria

- Two lessons (`identity-access-basics`, `apple-mdm-basics`) each render at
  `/lessons/[id]` with real, accurate, non-placeholder prose and a working
  embedded quiz.
- Two scenarios (`identity-console-scenario`, `device-console-scenario`)
  each render at `/consoles/[id]`, their tasks matching the workflow the
  paired lesson just taught, and are completable.
- Each lesson links to its paired scenario; each quiz grades correctly,
  including a fill-in-blank answer that differs only in case/whitespace
  being graded correct.
- Reloading a completed lesson or scenario shows it still complete,
  consistent with every prior module.
- `npm test` passes; `npm run typecheck` and `npm run lint` pass clean.

## Open Questions

1. **Scope of "AD/Entra ID basics."** Folding it into the identity lesson
   alongside SSO rather than giving it a third, separate lesson — AD/Entra
   ID is conceptually continuous with "who has access to what," and
   `core-fundamentals`' terminology lesson already introduced AD and GPO at
   a glossary level. This lesson goes one level deeper (the directory as
   the source of truth that SSO and provisioning both read from) without
   duplicating that glossary content. Keeps scope matched to
   `linux-powershell`'s precedent (two lesson→practice pairs).
2. **Scenario task count.** Defaulting to 3 tasks per scenario (matching
   `mock-console-engine`'s own demo scenario), covering a realistic
   mini-lifecycle (e.g. provision → assign → deactivate, or enroll →
   configure → remote-lock) rather than an exhaustive feature tour.
