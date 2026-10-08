# Implementation Plan: identity-device-mgmt

Spec: [../SPEC-identity-device-mgmt.md](../SPEC-identity-device-mgmt.md)

## Overview

Author two lesson→scenario pairs — Identity & Access Fundamentals (SSO,
AD/Entra ID, user lifecycle) and Apple MDM Fundamentals (device enrollment,
configuration, remote lock) — on top of platform-shell's lesson/quiz
machinery and mock-console-engine's `MockConsole`. No new application code:
this is content authoring, verified by the existing render/grade/engine/
persist pipeline.

## Architecture Decisions

- Each lesson ends with a plain Markdown link to its paired scenario
  (`[Try it in the console](/consoles/id)`), same convention as
  `linux-powershell`'s lesson→lab links.
- Scenario content is product-neutral (no real Okta/Jamf branding or copied
  UI), per `mock-console-engine`'s own spec boundary — section/action labels
  describe the workflow generically ("Provision Account," "Enroll Device").
- `core-fundamentals` shipped with a missing-`<Quiz/>`-tag bug and
  `linux-powershell` guarded against repeating it; this module's lessons and
  regression test (Task 5) do the same.
- A new risk specific to this module (mock-console content, not MDX): a
  task's `expectedActionId` could typo-reference an action that doesn't
  exist, or exists on the wrong record — `attemptConsoleAction` would then
  silently never match. Task 5's regression test asserts every task's
  `expectedActionId` resolves to a real action in the scenario's `actions`
  list before any browser check, so this fails fast as a unit test instead
  of as "nothing I click works" in the browser.

## Task List

### Phase 1: Identity

- [x] Task 1: Identity & Access Fundamentals lesson + quiz
- [x] Task 2: Identity console scenario

### Checkpoint: Identity
- [x] Lesson renders with its quiz embedded; scenario renders and is
      completable
- [x] Lesson links to the scenario

### Phase 2: Apple MDM

- [x] Task 3: Apple MDM Fundamentals lesson + quiz
- [x] Task 4: Device console scenario

### Checkpoint: Apple MDM
- [x] Lesson renders with its quiz embedded; scenario renders and is
      completable
- [x] Lesson links to the scenario

### Phase 3: Verification

- [x] Task 5: Regression tests + full browser verification

### Checkpoint: Complete
- [x] One lesson→scenario pair walked fully end-to-end in the browser:
      lesson → quiz graded → console link → scenario completed → reload
      both → still complete
- [x] The other lesson→scenario pair spot-checked to render without errors
- [x] All spec Success Criteria met
- [ ] Review with project owner before starting the next module
      (`itsm-ticketing`, per CAPABILITY_MAP.md build order)

## Task Details

### Task 1: Identity & Access Fundamentals lesson + quiz
**Description:** Write `content/lessons/identity-access-basics.mdx` (SSO
recap, what a directory service like AD/Entra ID actually is, the user
provisioning/deprovisioning lifecycle — 300–600 words) and
`content/quizzes/identity-access-basics-quiz.ts` (2–3 questions). End with a
link to `/consoles/identity-console-scenario`.
**Acceptance criteria:**
- [x] Lesson frontmatter is valid (`id: identity-access-basics`, `moduleId:
      identity-device-mgmt`, `order: 1`, correct `quizId`)
- [x] The MDX body contains `<Quiz id="identity-access-basics-quiz" />`
- [x] Lesson links to its paired scenario
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
**Dependencies:** None
**Files likely touched:** `src/content/lessons/identity-access-basics.mdx`, `src/content/quizzes/identity-access-basics-quiz.ts`, `src/content/quizzes/index.ts`
**Estimated scope:** Small-Medium

### Task 2: Identity console scenario
**Description:** Write `content/mock-consoles/identity-console-scenario.ts`:
one section of user records, a product-neutral action set, and 3 sequential
tasks walking provision → assign app access → deactivate, matching Task 1's
lesson.
**Acceptance criteria:**
- [x] `getScenarioById("identity-console-scenario")` resolves with 3 tasks
- [x] Every task's `expectedActionId` exists in the scenario's `actions`
      list and targets the record the task's instructions describe
- [x] At least one distractor action exists per task's record (so a "wrong
      action" path is real, not vacuous)
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
- [x] Manual check: `npm run dev`, visit `/consoles/identity-console-
      scenario`, walk through it once
**Dependencies:** Task 1 (scenario content should match the lesson's exact workflow)
**Files likely touched:** `src/content/mock-consoles/identity-console-scenario.ts`, `src/content/mock-consoles/index.ts`
**Estimated scope:** Medium

### Task 3: Apple MDM Fundamentals lesson + quiz
**Description:** Write `content/lessons/apple-mdm-basics.mdx` (what MDM
does for Apple devices, enrollment, configuration profiles, remote
lock/wipe for a lost device — 300–600 words) and
`content/quizzes/apple-mdm-basics-quiz.ts`. End with a link to
`/consoles/device-console-scenario`.
**Acceptance criteria:**
- [x] Lesson frontmatter is valid (`id: apple-mdm-basics`, `order: 2`,
      correct `quizId`)
- [x] The MDX body contains `<Quiz id="apple-mdm-basics-quiz" />`
- [x] Lesson links to its paired scenario
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
**Dependencies:** None
**Files likely touched:** `src/content/lessons/apple-mdm-basics.mdx`, `src/content/quizzes/apple-mdm-basics-quiz.ts`, `src/content/quizzes/index.ts`
**Estimated scope:** Small-Medium

### Task 4: Device console scenario
**Description:** Write `content/mock-consoles/device-console-scenario.ts`:
one section of device records, a product-neutral action set, and 3
sequential tasks walking enroll → apply a configuration profile → remote-
lock a lost device, matching Task 3's lesson.
**Acceptance criteria:**
- [x] `getScenarioById("device-console-scenario")` resolves with 3 tasks
- [x] Every task's `expectedActionId` exists in the scenario's `actions`
      list and targets the record the task's instructions describe
- [x] At least one distractor action exists per task's record
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
- [x] Manual check: `npm run dev`, visit `/consoles/device-console-
      scenario`, walk through it once
**Dependencies:** Task 3
**Files likely touched:** `src/content/mock-consoles/device-console-scenario.ts`, `src/content/mock-consoles/index.ts`
**Estimated scope:** Medium

### Task 5: Regression tests + full browser verification
**Description:** Add `tests/lib/curriculum/identity-device-mgmt.test.ts`
(mirrors `linux-powershell.test.ts`: frontmatter, quiz resolution, the
`<Quiz id="..." />` body tag, and the scenario link) and
`tests/lib/mock-console/identity-device-mgmt.test.ts` (asserts both
scenarios resolve and every task's `expectedActionId` is a real,
correctly-targeted action). Run the full suite, typecheck, lint, and build.
Manually walk one lesson→scenario pair end-to-end and spot-check the other.
**Acceptance criteria:**
- [x] Both lessons load successfully with valid frontmatter, a resolvable
      quiz, and the quiz tag present in the body
- [x] Both scenarios load successfully with every task's expected action
      verified against the scenario's action list
- [x] `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` all
      pass
**Verification:**
- [x] Tests pass: full suite `npm test`
- [x] Manual check: the Phase 3 checkpoint flow above, done by hand in the
      browser
**Dependencies:** Task 1, Task 2, Task 3, Task 4
**Files likely touched:** `tests/lib/curriculum/identity-device-mgmt.test.ts`, `tests/lib/mock-console/identity-device-mgmt.test.ts`
**Estimated scope:** Small

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Repeating the core-fundamentals missing-`<Quiz/>`-tag bug | Medium | Explicitly called out in acceptance criteria for Tasks 1 and 3, and directly asserted in Task 5's regression test |
| A scenario task's `expectedActionId` references a nonexistent or wrong-record action, making the task impossible to complete in the browser | Medium | Task 5's regression test validates every task's expected action against the scenario's actual `actions` list before any manual browser check |
| Scenario content drifts into implying a real vendor product (Okta/Jamf branding or copied terminology) | Low | Product-neutral labels checked explicitly in Tasks 2 and 4's acceptance criteria, inherited from mock-console-engine's own boundary |

## Open Questions

None outstanding — spec's two open questions were resolved with stated
defaults (see SPEC-identity-device-mgmt.md § Open Questions). Flag here if
that changes during implementation.
