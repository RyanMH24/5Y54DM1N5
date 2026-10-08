# Spec: itsm-ticketing

Module in [CAPABILITY_MAP.md](./CAPABILITY_MAP.md). Depends on: platform-shell, glossary, mock-console-engine.

## Objective

Author one lesson→scenario pair covering the ServiceNow-style ticket queue
workflow: a ticket arrives, gets triaged, gets escalated when it's beyond
the first tier, and gets closed once resolved. Unlike `linux-powershell` and
`identity-device-mgmt` (two distinct topics each, so two lesson→practice
pairs), this module covers one continuous workflow — intake through
closing is a single narrative arc, not two separate concepts — so it gets
one deeper lesson and one scenario that walks a single ticket through its
full lifecycle. Like every content module before it, platform-shell's
lesson/quiz machinery and mock-console-engine's `MockConsole` already work
generically; this module's job is writing the lesson and scenario content,
no new application code.

Per mock-console-engine's own spec boundary ("never imply the mock console
is a real vendor product"), the scenario is **product-neutral** — themed
around the real workflow without copying ServiceNow's actual branding,
field names, or layout.

**User:** a solo learner (currently just the project owner, reviewing as it's
built) — same as every prior module.

**Success looks like:** a learner opens the lesson, reads real prose about
triage, escalation, and closing, follows a link into the paired ticket
console scenario, triages a ticket, escalates it, and closes it by taking
the correct actions in order, returns to the lesson, answers its quiz
correctly, and has both the lesson's and the scenario's completion persist
across a reload.

## Tech Stack

No new tech. Reuses existing machinery as-is: `lib/curriculum/load.ts`,
`lib/quiz`, `lib/progress`, `LessonRenderer`, `Quiz`/`QuizQuestion`, and
`/lessons/[id]` for lesson content; `lib/mock-console/load.ts`,
`lib/mock-console/engine.ts`, `lib/mock-console/progress.ts`,
`MockConsole`, `MockConsoleRunner`, and `/consoles/[id]` for the guided
scenario. The lesson-to-scenario link is a plain Markdown link
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
  SPEC-itsm-ticketing.md
  src/
    content/
      lessons/
        itsm-ticket-lifecycle.mdx
      quizzes/
        itsm-ticket-lifecycle-quiz.ts
        index.ts            (extended to register the new quiz)
      mock-consoles/
        ticket-console-scenario.ts
        index.ts            (extended to register the new scenario)
  tests/
    lib/curriculum/
      itsm-ticketing.test.ts   (mirrors identity-device-mgmt.test.ts:
                                 lesson loads, quiz resolves, the
                                 `<Quiz id="..." />` tag is present, links
                                 to the paired scenario)
    lib/mock-console/
      itsm-ticketing.test.ts   (loads the scenario, asserts every task's
                                 expected action exists and targets the
                                 right record, and every task operates on
                                 the same ticket — one continuous lifecycle,
                                 not three unrelated actions)
```

## Code Style

Lesson frontmatter, quiz data, and scenario data all follow the shapes
already defined in `src/types/curriculum.ts` and `src/types/mock-console.ts`
— no schema changes anywhere.

```yaml
---
id: itsm-ticket-lifecycle
moduleId: itsm-ticketing
title: The Ticket Lifecycle
order: 1
summary: One sentence a lesson list could show.
quizId: itsm-ticket-lifecycle-quiz
---
```

- The lesson has 300–600 words of real prose, ends with a plain Markdown
  link to the paired scenario (`[Try it in the console](/consoles/id)`),
  and embeds its quiz via `<Quiz id="..." />` **in the body** — not just
  the frontmatter `quizId` (the bug class guarded against since
  `core-fundamentals`; the regression test here asserts it directly).
- The scenario's three tasks (triage → escalate → close) all target the
  *same* ticket record, so completing the scenario reads as one ticket's
  full journey rather than three disconnected actions — a second ticket
  record exists in the queue purely to host distractor actions, and is
  never itself a task target.
- `order: 1` — this is the module's only lesson, so there's no sequencing
  to get right within the module (unlike the two-lesson modules before it).

## Testing Strategy

- **Unit:** one regression test file for the lesson (mirrors
  `identity-device-mgmt.test.ts`: frontmatter, quiz resolution, the
  `<Quiz id="..." />` body tag, and the scenario link) and one for the
  scenario (asserts it resolves, every task's `expectedActionId` is a real
  action targeting the right record, and — specific to this module — every
  task's target record is the *same* ticket, not three different ones).
- **No new component/route tests** — `LessonRenderer`, `Quiz`,
  `MockConsole`, `MockConsoleRunner`, and their routes are already covered
  generically; this module only adds data for them to render.
- **Browser:** manually verify the lesson→scenario path end-to-end (open
  lesson → read → follow the console link → triage → escalate → close →
  quiz back on the lesson → graded → reload both → still complete).

## Boundaries

- **Always:** run `npm test`, `npm run typecheck`, `npm run lint` before
  considering a task in this module done. The lesson→scenario link must
  point to a scenario id that actually exists and is loadable. Scenario
  content stays product-neutral per mock-console-engine's own boundary.
- **Ask first:** adding any new npm dependency; changing the `Lesson`/`Quiz`
  or `MockConsoleScenario` content schemas; adding a lesson/scenario *index*
  page — still `curriculum-sequencing`'s job, not this module's.
- **Never:** commit secrets/API keys; add real user accounts/auth; make real
  network calls; connect to ServiceNow or imitate its real branding, field
  names, or UI — inherited directly from `mock-console-engine`'s own "never
  imply a real vendor product" rule.

## Success Criteria

- The lesson (`itsm-ticket-lifecycle`) renders at `/lessons/itsm-ticket-
  lifecycle` with real, accurate, non-placeholder prose and a working
  embedded quiz.
- The scenario (`ticket-console-scenario`) renders at `/consoles/ticket-
  console-scenario`; triaging, escalating, and closing the same ticket in
  order completes it.
- The lesson links to the scenario; the quiz grades correctly, including a
  fill-in-blank answer that differs only in case/whitespace being graded
  correct.
- Reloading a completed lesson or scenario shows it still complete,
  consistent with every prior module.
- `npm test` passes; `npm run typecheck` and `npm run lint` pass clean.

## Open Questions

1. **One pair instead of two.** `core-fundamentals` had four lessons;
   `linux-powershell` and `identity-device-mgmt` each had two lesson→
   practice pairs, one per distinct topic. This module's topic (the ticket
   lifecycle) doesn't split into two independent concepts the way "Linux vs.
   PowerShell" or "identity vs. device management" did — intake, triage,
   escalation, and closing are stages of *one* process. Defaulting to one
   deeper lesson and one scenario that walks the full lifecycle on a single
   ticket, rather than forcing an artificial second pair. Revisit if the
   catalog later wants, say, a separate lesson on writing good ticket notes
   or SLA management.
2. **"Intake" isn't a console action.** A ticket arriving in the queue is
   usually automatic (a user submits a request, a monitoring alert fires),
   not something an admin clicks a button for. The lesson covers intake as
   context; the scenario's three actionable tasks are triage, escalate, and
   close — the parts of the lifecycle a human actually acts on.
