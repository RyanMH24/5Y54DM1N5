# Implementation Plan: glossary

Spec: [../SPEC-glossary.md](../SPEC-glossary.md)

## Overview

Build a searchable glossary on top of the existing platform-shell app: a typed
term model, structured content data, a pure search/filter function, two UI
components (search input, filtered list), and two routes (an index with
search, and a per-term detail page). Finish by proving the stated
cross-linking success criterion — a plain Markdown link from the existing
sample lesson to a glossary term that resolves.

## Architecture Decisions

- `lib/glossary` logic (load all terms, get by id, filter/search) is pure
  functions with no React dependency, mirroring platform-shell's
  `lib/quiz`/`lib/progress` split — testable in isolation, UI built on top.
- Search is a case-insensitive substring match across `term`, `acronymFor`,
  and `definition`, computed client-side over the full (small) term list — no
  new dependency, no server round-trip. See SPEC-glossary.md Open Question 2.
- Cross-linking from lessons uses plain Markdown links to `/glossary/[id]`,
  not a dedicated embed component — `next-mdx-remote` already resolves
  standard links, so this needs no new lesson-rendering infrastructure. See
  SPEC-glossary.md Open Question 1.
- `/glossary/[id]` uses Next's `notFound()` for an unknown id, consistent
  with platform-shell's "fail loudly, not silently empty" rule for missing
  referenced data (`QuizNotFoundError` there; a 404 here, since this is a
  user-navigable route rather than a content-authoring error).

## Task List

### Phase 1: Foundation

- [x] Task 1: Shared type, content data, and glossary lib (load/get/search)

### Checkpoint: Foundation
- [x] `npm test`, `npm run typecheck`, `npm run lint` all pass
- [x] No UI yet — this checkpoint is logic-only

### Phase 2: UI Components

- [x] Task 2: GlossarySearch component
- [x] Task 3: GlossaryList component

### Checkpoint: Components
- [x] `GlossarySearch` renders an input and calls back on change (component test)
- [x] `GlossaryList` renders terms and reacts to a filter string (component test)

### Phase 3: Routes & cross-linking

- [x] Task 4: `/glossary` index route (search + list wired together)
- [x] Task 5: `/glossary/[id]` detail route with not-found handling
- [x] Task 6: Cross-link demo from the sample lesson to a glossary term

### Checkpoint: Complete
- [x] `npm run dev` → open `/glossary` → search narrows the list → open a term
      → detail page renders → visiting an unknown id shows not-found
- [x] The sample lesson's glossary link navigates to the correct term page
- [x] All spec Success Criteria met
- [ ] Review with project owner before starting the next module
      (`terminal-lab-engine`, `mock-console-engine`, or others per
      CAPABILITY_MAP.md build order)

## Task Details

### Task 1: Shared type, content data, and glossary lib
**Description:** Define `GlossaryTerm` in `src/types/glossary.ts`. Add
structured term data under `src/content/glossary/` covering the terms named
in the spec (SSO, MDM, SLA, escalation, ticket queue, AD, GPO, endpoint) plus
a registry (`src/content/glossary/index.ts`) keyed by id. Implement
`lib/glossary`: `getAllTerms()`, `getTermById(id)`, and a pure
`searchTerms(terms, query)` filter predicate. Fully unit tested.
**Acceptance criteria:**
- [x] `getAllTerms()` returns every term from the content registry
- [x] `getTermById()` returns the matching term, and a clear not-found result
      (not a throw — this is a lookup helper used by both the list and the
      detail route, which handle "missing" differently) for an unknown id
- [x] `searchTerms()` matches case-insensitively against term, acronym, and
      definition text; an empty query returns every term
**Verification:**
- [x] Tests pass: `npm test -- lib/glossary`
- [x] Typecheck passes: `npm run typecheck`
**Dependencies:** None (platform-shell's app shell already exists)
**Files likely touched:** `src/types/glossary.ts`, `src/content/glossary/*.ts`, `src/lib/glossary/load.ts`, `tests/lib/glossary/load.test.ts`
**Estimated scope:** Small-Medium

### Task 2: GlossarySearch component
**Description:** A controlled text input that calls an `onChange(query)` prop
as the learner types. No local filtering logic here — purely an input +
callback, matching platform-shell's pattern of keeping components thin and
logic in `lib/`.
**Acceptance criteria:**
- [x] Renders a labeled text input
- [x] Typing calls `onChange` with the current input value
**Verification:**
- [x] Tests pass: `npm test -- components/GlossarySearch`
**Dependencies:** None
**Files likely touched:** `src/components/GlossarySearch.tsx`, `tests/components/GlossarySearch.test.tsx`
**Estimated scope:** Small

### Task 3: GlossaryList component
**Description:** Renders a list of `GlossaryTerm`s (term, expanded acronym if
present, definition), each linking to its `/glossary/[id]` detail page.
**Acceptance criteria:**
- [x] Renders one entry per term passed in, each a link to `/glossary/{id}`
- [x] Renders an acronym's expansion when `acronymFor` is present, and omits
      it cleanly when absent
- [x] Renders an empty-state message when given an empty list (e.g. no search
      results)
**Verification:**
- [x] Tests pass: `npm test -- components/GlossaryList`
**Dependencies:** Task 1 (uses `GlossaryTerm` type)
**Files likely touched:** `src/components/GlossaryList.tsx`, `tests/components/GlossaryList.test.tsx`
**Estimated scope:** Small

### Task 4: `/glossary` index route
**Description:** Client component page composing `GlossarySearch` and
`GlossaryList`: holds the current query in state, computes the filtered list
via `lib/glossary`'s `searchTerms()`, and renders it. Terms are loaded once
at build/request time via `getAllTerms()` and passed down; filtering itself
is client-side.
**Acceptance criteria:**
- [x] Visiting `/glossary` lists every term
- [x] Typing in the search box narrows the visible list live, by the same
      matching rules as `searchTerms()`
**Verification:**
- [x] Tests pass: `npm test -- app/glossary`
- [x] Manual check: `npm run dev`, visit `/glossary`, confirm search narrows
      the list and clearing it restores the full list
**Dependencies:** Task 1, Task 2, Task 3
**Files likely touched:** `src/app/glossary/page.tsx`, `tests/app/glossary/page.test.tsx`
**Estimated scope:** Small-Medium

### Task 5: `/glossary/[id]` detail route
**Description:** Server component route rendering a single term's full
detail (term, expanded acronym, definition). An id with no matching term
calls Next's `notFound()` rather than rendering an empty/broken page.
**Acceptance criteria:**
- [x] Visiting `/glossary/{known-id}` renders that term's detail
- [x] Visiting `/glossary/{unknown-id}` renders Next's not-found UI, not a
      blank or broken page
**Verification:**
- [x] Tests pass: `npm test -- app/glossary`
- [x] Manual check: `npm run dev`, visit a known term and an unknown id
**Dependencies:** Task 1
**Files likely touched:** `src/app/glossary/[id]/page.tsx`, `tests/app/glossary/[id]/page.test.tsx`
**Estimated scope:** Small

### Task 6: Cross-link demo from the sample lesson
**Description:** Add one plain Markdown link from
`src/content/lessons/sample-lesson.mdx` to a relevant glossary term's
`/glossary/[id]` page, proving the stated cross-linking success criterion
end-to-end.
**Acceptance criteria:**
- [x] The sample lesson's MDX body contains a Markdown link to an existing
      `/glossary/[id]`
- [x] Clicking that link in the rendered lesson page navigates to the correct
      glossary detail page
**Verification:**
- [x] Tests pass: full suite `npm test`
- [x] Manual check: `npm run dev`, open the sample lesson, click the glossary
      link, confirm it lands on the right term
**Dependencies:** Task 5
**Files likely touched:** `src/content/lessons/sample-lesson.mdx`
**Estimated scope:** Small

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Term list grows past "small" and substring search feels inadequate | Low | Search logic is isolated in one pure function (`searchTerms`) — swapping in a real search library later doesn't touch UI or content |
| `/glossary/[id]` not-found handling diverges from Next's conventions across versions | Low | This app already reads `node_modules/next/dist/docs/` before writing App Router code (per AGENTS.md) — check the current `notFound()` / `not-found.tsx` convention there before implementing Task 5 |
| Glossary content schema needs a field later modules want (e.g. related terms) | Low | Explicitly deferred per SPEC-glossary.md Open Question 3 — add the field when a real consumer needs it |

## Open Questions

None outstanding — spec's three open questions were resolved with stated
defaults (see SPEC-glossary.md § Open Questions). Flag here if that changes
during implementation.
