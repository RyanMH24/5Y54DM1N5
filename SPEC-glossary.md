# Spec: glossary

Module in [CAPABILITY_MAP.md](./CAPABILITY_MAP.md). Depends on: platform-shell.

## Objective

A searchable reference of sysadmin terms and acronyms (SSO, MDM, SLA, escalation,
ticket queue, AD, GPO, endpoint, etc.), browsable on its own and linkable from
lesson content.

**User:** a solo learner (currently just the project owner, reviewing as it's built) —
same as platform-shell.

**Success looks like:** a learner opens the glossary, searches or scans the term
list, reads a definition, and can follow a link from a lesson straight to the
glossary entry that explains a term used there.

## Tech Stack

- Reuses the platform-shell app: Next.js (App Router) + TypeScript + React,
  Vitest + React Testing Library, npm.
- No new dependencies — search is a simple client-side substring filter, not a
  fuzzy-search library (the term list is small; fuzzy matching is unneeded
  complexity for now — see Open Questions).
- No CSS framework — plain unstyled markup (per platform-shell's deferred
  UI/visual design decision).

## Commands

Same as platform-shell (shared app):

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
  SPEC-glossary.md
  src/
    app/
      glossary/
        page.tsx           → glossary index: search input + term list
        [id]/page.tsx       → single term detail page (deep-link target)
    content/
      glossary/            → structured term data, keyed by id
    components/
      GlossaryList.tsx      → renders a list of terms, given a filter string
      GlossarySearch.tsx     → search input, lifts filter text to parent
    lib/
      glossary/             → load all terms, get term by id, filter/search logic
    types/
      glossary.ts            → GlossaryTerm type
  tests/                    → mirrors src/, as in platform-shell
```

## Code Style

```ts
// src/types/glossary.ts
export interface GlossaryTerm {
  id: string; // slug, e.g. "sso" — used in the /glossary/[id] route
  term: string; // display name, e.g. "SSO"
  acronymFor?: string; // e.g. "Single Sign-On"; omitted for non-acronym terms
  definition: string;
}
```

- Same conventions as platform-shell: explicit/narrow types, pure functions for
  logic that doesn't need React (`lib/glossary`), content data kept separate
  from rendering logic.
- Cross-linking from a lesson is a plain MDX/Markdown link to `/glossary/[id]`
  (e.g. `[SSO](/glossary/sso)`) — no dedicated embed component. Lesson content
  already renders through `next-mdx-remote`, which resolves standard links for
  free; a bespoke `<GlossaryTerm id="..." />` component would duplicate that
  for no behavior lessons actually need yet (see Open Questions).

## Testing Strategy

Vitest + React Testing Library, same split as platform-shell:

- **Unit (high coverage expected):** `lib/glossary` — loading all terms,
  resolving a term by id (including a not-found case), and the search/filter
  predicate (matches on term name, expanded acronym, and definition text,
  case-insensitive).
- **Component (smoke-level):** `GlossaryList` renders terms and reacts to a
  filter string; `GlossarySearch` calls back with typed input.
- Tests live under `tests/`, mirroring the `src/` path of what they cover.

## Boundaries

- **Always:** run `npm test`, `npm run typecheck`, `npm run lint` before
  considering a task in this module done. Keep glossary content data separate
  from rendering/search logic (mirrors platform-shell's content/lib split).
- **Ask first:** adding any new npm dependency (e.g. a fuzzy-search library);
  changing the glossary data file schema once other modules
  (`core-fundamentals`, `linux-powershell`, etc.) start linking into it;
  anything implying ongoing hosting cost.
- **Never:** commit secrets/API keys; add real user accounts/auth; make real
  network calls to any third party.

## Success Criteria

- `/glossary` lists every term with its definition (and expanded acronym,
  when present).
- Typing in the search box filters the visible list live, matching against
  term name, expanded acronym, and definition text, case-insensitively.
- `/glossary/[id]` renders a single term's full detail; visiting an unknown id
  fails loudly (not a silent blank page) via Next's not-found handling.
- A Markdown link from lesson content to `/glossary/[id]` resolves to that
  term's detail page.
- `npm test` passes, with high coverage on `lib/glossary`.
- `npm run typecheck` and `npm run lint` pass clean.

## Open Questions

1. **Cross-link mechanism.** Defaulting to plain Markdown links
   (`[SSO](/glossary/sso)`) from lesson MDX rather than a dedicated
   `<GlossaryTerm id="..." />` embed component — simpler, and MDX already
   renders standard links. Revisit if a later module wants inline
   hover-definitions or auto-linking of terms mentioned in prose.
2. **Search strictness.** Defaulting to a simple case-insensitive substring
   match across term/acronym/definition, no fuzzy/typo-tolerant matching and
   no new dependency. The term list is expected to stay small (tens, not
   hundreds, of entries) for the life of this project.
3. **Related terms / cross-references within the glossary.** Out of scope for
   this module — the `GlossaryTerm` type carries only what's needed for
   search and display today. Add a relation field later if a module actually
   needs it, rather than carrying unused schema now.
