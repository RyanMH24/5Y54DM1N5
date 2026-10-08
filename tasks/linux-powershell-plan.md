# Implementation Plan: linux-powershell

Spec: [../SPEC-linux-powershell.md](../SPEC-linux-powershell.md)

## Overview

Author two lesson→lab pairs — Linux CLI fundamentals and PowerShell
fundamentals — on top of platform-shell's lesson/quiz machinery and
terminal-lab-engine's `Terminal`. No new application code: this is content
authoring, verified by the existing render/grade/match/persist pipeline.

## Architecture Decisions

- Each lesson ends with a plain Markdown link to its paired lab
  (`[Try it in the lab](/labs/id)`), mirroring glossary's established
  cross-link convention — no new embed component.
- Lab steps use the literal commands the paired lesson just taught, in the
  same order, so the lesson and lab read as one continuous "learn then do"
  unit even though they're two separate routes (no lesson/lab linking
  infrastructure exists yet — that's `curriculum-sequencing`'s job).
- The core-fundamentals module shipped with a real bug: lesson frontmatter
  declared a `quizId` but the MDX body never embedded `<Quiz id="..." />`,
  so the quiz silently didn't render even though the loader resolved it
  fine. Task 1 and Task 3 here explicitly double-check this tag is present
  before moving on, and the regression test (Task 5) asserts it directly —
  same fix already applied retroactively to core-fundamentals.

## Task List

### Phase 1: Linux

- [x] Task 1: Linux CLI Fundamentals lesson + quiz
- [x] Task 2: Linux CLI Basics lab

### Checkpoint: Linux
- [x] Lesson renders with its quiz embedded; lab renders and is completable
- [x] Lesson links to the lab

### Phase 2: PowerShell

- [x] Task 3: PowerShell Fundamentals lesson + quiz
- [x] Task 4: PowerShell Basics lab

### Checkpoint: PowerShell
- [x] Lesson renders with its quiz embedded; lab renders and is completable
- [x] Lesson links to the lab

### Phase 3: Verification

- [x] Task 5: Regression tests + full browser verification

### Checkpoint: Complete
- [x] One lesson→lab pair walked fully end-to-end in the browser: lesson →
      quiz graded → lab link → lab completed → reload both → still complete
- [x] The other lesson→lab pair spot-checked to render without errors
- [x] All spec Success Criteria met
- [ ] Review with project owner before starting the next module
      (`identity-device-mgmt`, `itsm-ticketing`, per CAPABILITY_MAP.md build
      order)

## Task Details

### Task 1: Linux CLI Fundamentals lesson + quiz
**Description:** Write `content/lessons/linux-cli-basics.mdx` (navigating
the filesystem, viewing/copying/moving/removing files, checking running
processes, a taste of a one-line script — 300–600 words) and
`content/quizzes/linux-cli-basics-quiz.ts` (2–3 questions). End with a link
to `/labs/linux-cli-basics-lab`.
**Acceptance criteria:**
- [x] Lesson frontmatter is valid (`id: linux-cli-basics`, `moduleId: linux-
      powershell`, `order: 1`, correct `quizId`)
- [x] The MDX body contains `<Quiz id="linux-cli-basics-quiz" />` (not just
      the frontmatter `quizId`)
- [x] Lesson links to its paired lab
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
**Dependencies:** None
**Files likely touched:** `src/content/lessons/linux-cli-basics.mdx`, `src/content/quizzes/linux-cli-basics-quiz.ts`, `src/content/quizzes/index.ts`
**Estimated scope:** Small-Medium

### Task 2: Linux CLI Basics lab
**Description:** Write `content/labs/linux-cli-basics-lab.ts`: 3–4 steps
using the exact commands Task 1's lesson introduced (e.g. `pwd`, `ls`,
`cat somefile`, a simple `cp`/`mv`), each with realistic simulated output.
**Acceptance criteria:**
- [x] `getLabById("linux-cli-basics-lab")` resolves and has 3–4 steps
- [x] Each step's expected command matches what the lesson taught, in the
      same order
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
- [x] Manual check: `npm run dev`, visit `/labs/linux-cli-basics-lab`, walk
      through it once
**Dependencies:** Task 1 (lab content should match the lesson's exact commands)
**Files likely touched:** `src/content/labs/linux-cli-basics-lab.ts`, `src/content/labs/index.ts`
**Estimated scope:** Small-Medium

### Task 3: PowerShell Fundamentals lesson + quiz
**Description:** Write `content/lessons/powershell-basics.mdx` (cmdlet
Verb-Noun naming, a couple of common cmdlets, the pipeline, a taste of a
one-line variable/loop — 300–600 words) and
`content/quizzes/powershell-basics-quiz.ts`. End with a link to
`/labs/powershell-basics-lab`.
**Acceptance criteria:**
- [x] Lesson frontmatter is valid (`id: powershell-basics`, `order: 2`,
      correct `quizId`)
- [x] The MDX body contains `<Quiz id="powershell-basics-quiz" />`
- [x] Lesson links to its paired lab
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
**Dependencies:** None
**Files likely touched:** `src/content/lessons/powershell-basics.mdx`, `src/content/quizzes/powershell-basics-quiz.ts`, `src/content/quizzes/index.ts`
**Estimated scope:** Small-Medium

### Task 4: PowerShell Basics lab
**Description:** Write `content/labs/powershell-basics-lab.ts`: 3–4 steps
using the exact cmdlets Task 3's lesson introduced (e.g. `Get-Process`,
`Get-Service`, `Get-ChildItem`), each with realistic simulated output.
**Acceptance criteria:**
- [x] `getLabById("powershell-basics-lab")` resolves and has 3–4 steps
- [x] Each step's expected command matches what the lesson taught, in the
      same order
**Verification:**
- [x] `npm run typecheck` and `npm run lint` pass
- [x] Manual check: `npm run dev`, visit `/labs/powershell-basics-lab`, walk
      through it once
**Dependencies:** Task 3
**Files likely touched:** `src/content/labs/powershell-basics-lab.ts`, `src/content/labs/index.ts`
**Estimated scope:** Small-Medium

### Task 5: Regression tests + full browser verification
**Description:** Add `tests/lib/curriculum/linux-powershell.test.ts`
(mirrors `core-fundamentals.test.ts`, including the `<Quiz id="..." />`
body-tag assertion) and `tests/lib/terminal-lab/linux-powershell.test.ts`
(asserts both labs resolve with a sane step count). Run the full suite,
typecheck, lint, and build. Manually walk one lesson→lab pair end-to-end and
spot-check the other.
**Acceptance criteria:**
- [x] Both lessons load successfully with valid frontmatter, a resolvable
      quiz, and the quiz tag present in the body
- [x] Both labs load successfully with a sane step count
- [x] `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` all
      pass
**Verification:**
- [x] Tests pass: full suite `npm test`
- [x] Manual check: the Phase 3 checkpoint flow above, done by hand in the
      browser
**Dependencies:** Task 1, Task 2, Task 3, Task 4
**Files likely touched:** `tests/lib/curriculum/linux-powershell.test.ts`, `tests/lib/terminal-lab/linux-powershell.test.ts`
**Estimated scope:** Small

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Repeating the core-fundamentals missing-`<Quiz/>`-tag bug | Medium | Explicitly called out in acceptance criteria for Tasks 1 and 3, and directly asserted in Task 5's regression test |
| Lab steps drift from what the lesson actually taught (commands introduced in a different order, or not at all) | Low | Lab content (Tasks 2, 4) is written immediately after and depends on its paired lesson, using the lesson's own command list as the step list |

## Open Questions

None outstanding — spec's two open questions were resolved with stated
defaults (see SPEC-linux-powershell.md § Open Questions). Flag here if that
changes during implementation.
