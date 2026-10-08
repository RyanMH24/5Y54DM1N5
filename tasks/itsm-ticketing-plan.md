# Implementation Plan: itsm-ticketing

Spec: [../SPEC-itsm-ticketing.md](../SPEC-itsm-ticketing.md)

## Overview

Author one lesson→scenario pair — the ticket lifecycle (triage, escalation,
closing) — on top of platform-shell's lesson/quiz machinery and
mock-console-engine's `MockConsole`. Unlike the prior two content modules,
this is a single pair, not two: the topic is one continuous workflow, not
two independent concepts. No new application code: content authoring,
verified by the existing render/grade/engine/persist pipeline.

## Architecture Decisions

- The lesson ends with a plain Markdown link to the paired scenario
  (`[Try it in the console](/consoles/id)`), same convention as every prior
  module's lesson→practice link.
- Scenario content is product-neutral (no real ServiceNow branding or
  copied UI), per `mock-console-engine`'s own spec boundary.
- All three of the scenario's tasks (triage → escalate → close) target the
  *same* ticket record — one ticket's full journey, not three unrelated
  actions on three different tickets. A second ticket record exists purely
  to host distractor actions.
- Same guardrails as the last two modules: the regression test asserts the
  `<Quiz id="..." />` body tag is present (not just the frontmatter
  `quizId`), and validates every task's `expectedActionId` against the
  scenario's real `actions` list before any manual browser check.

## Task List

### Phase 1: Content

- [x] Task 1: Ticket Lifecycle lesson + quiz
- [x] Task 2: Ticket console scenario

### Checkpoint: Content
- [x] Lesson renders with its quiz embedded; scenario renders and is
      completable
- [x] Lesson links to the scenario

### Phase 2: Verification

- [x] Task 3: Regression tests + full browser verification

### Checkpoint: Complete
- [x] Lesson→scenario pair walked fully end-to-end in the browser: lesson →
      quiz graded → console link → triage → escalate → close → reload both
      → still complete
- [x] All spec Success Criteria met
- [ ] Review with project owner — this completes the current
      CAPABILITY_MAP.md build wave (`core-fundamentals`,
      `linux-powershell`, `identity-device-mgmt`, `itsm-ticketing`); next up
      is `curriculum-sequencing`, which depends on all four

## Task Details

### Task 1: Ticket Lifecycle lesson + quiz
**Description:** Write `content/lessons/itsm-ticket-lifecycle.mdx` (how a
ticket arrives, what triage means, when and how to escalate, what to record
before closing — 300–600 words) and
`content/quizzes/itsm-ticket-lifecycle-quiz.ts` (2–3 questions). End with a
link to `/consoles/ticket-console-scenario`.
**Acceptance criteria:**
- [x] Lesson frontmatter is valid (`id: itsm-ticket-lifecycle`, `moduleId:
      itsm-ticketing`, `order: 1`, correct `quizId`)
- [x] The MDX body contains `<Quiz id="itsm-ticket-lifecycle-quiz" />`
- [x] Lesson links to its paired scenario
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
**Dependencies:** None
**Files likely touched:** `src/content/lessons/itsm-ticket-lifecycle.mdx`, `src/content/quizzes/itsm-ticket-lifecycle-quiz.ts`, `src/content/quizzes/index.ts`
**Estimated scope:** Small-Medium

### Task 2: Ticket console scenario
**Description:** Write `content/mock-consoles/ticket-console-scenario.ts`:
a ticket queue section with two ticket records, a product-neutral action
set, and 3 sequential tasks — triage, escalate, close — all targeting the
same ticket, matching Task 1's lesson. The second ticket exists only to
host distractor actions.
**Acceptance criteria:**
- [x] `getScenarioById("ticket-console-scenario")` resolves with 3 tasks
- [x] All three tasks' expected actions target the same ticket record
- [x] Every task's `expectedActionId` exists in the scenario's `actions`
      list and targets the record the task's instructions describe
- [x] At least one distractor action exists per task's record
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
- [x] Manual check: `npm run dev`, visit `/consoles/ticket-console-
      scenario`, walk through it once
**Dependencies:** Task 1 (scenario content should match the lesson's exact workflow)
**Files likely touched:** `src/content/mock-consoles/ticket-console-scenario.ts`, `src/content/mock-consoles/index.ts`
**Estimated scope:** Medium

### Task 3: Regression tests + full browser verification
**Description:** Add `tests/lib/curriculum/itsm-ticketing.test.ts` (mirrors
`identity-device-mgmt.test.ts`: frontmatter, quiz resolution, the
`<Quiz id="..." />` body tag, and the scenario link) and
`tests/lib/mock-console/itsm-ticketing.test.ts` (asserts the scenario
resolves, every task's `expectedActionId` is a real, correctly-targeted
action, and all three tasks target the same record). Run the full suite,
typecheck, lint, and build. Manually walk the lesson→scenario pair
end-to-end.
**Acceptance criteria:**
- [x] The lesson loads successfully with valid frontmatter, a resolvable
      quiz, and the quiz tag present in the body
- [x] The scenario loads successfully with every task's expected action
      verified against the scenario's action list, and all three tasks
      confirmed to target the same ticket record
- [x] `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` all
      pass
**Verification:**
- [x] Tests pass: full suite `npm test`
- [x] Manual check: the Phase 2 checkpoint flow above, done by hand in the
      browser
**Dependencies:** Task 1, Task 2
**Files likely touched:** `tests/lib/curriculum/itsm-ticketing.test.ts`, `tests/lib/mock-console/itsm-ticketing.test.ts`
**Estimated scope:** Small

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Repeating the core-fundamentals missing-`<Quiz/>`-tag bug | Medium | Explicitly called out in Task 1's acceptance criteria and directly asserted in Task 3's regression test |
| A scenario task's `expectedActionId` references a nonexistent or wrong-record action | Medium | Task 3's regression test validates every task's expected action against the scenario's actual `actions` list before any manual browser check |
| Scenario content drifts into implying a real vendor product (ServiceNow branding or copied field names) | Low | Product-neutral labels checked explicitly in Task 2's acceptance criteria, inherited from mock-console-engine's own boundary |

## Open Questions

None outstanding — spec's two open questions were resolved with stated
defaults (see SPEC-itsm-ticketing.md § Open Questions). Flag here if that
changes during implementation.
