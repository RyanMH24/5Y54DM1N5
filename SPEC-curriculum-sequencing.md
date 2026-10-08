# Spec: curriculum-sequencing

Module in [CAPABILITY_MAP.md](./CAPABILITY_MAP.md). Depends on:
core-fundamentals, linux-powershell, identity-device-mgmt, itsm-ticketing.

## Objective

Turn the finished lesson, lab, and mock-console content into one visible,
ordered learning path that a solo learner can follow over roughly six weeks.
The current home page is still scaffold copy and every activity is reachable
only by knowing its URL; this module replaces that dead end with a curriculum
dashboard that answers three questions at a glance:

1. What have I completed?
2. What should I do next?
3. What comes later in the path?

The path contains the four real content modules in dependency order:
core fundamentals first, then Linux/PowerShell, identity/device management,
and ITSM/ticketing. Within a module, each lesson is followed immediately by
its paired practice activity when one exists. The sample lesson, sample lab,
and demo console remain development fixtures and do not appear in the learner
path.

**User:** a solo learner using one browser with no account, consistent with
the rest of the application.

**Success looks like:** a new learner opens `/`, sees the complete six-week
path with the first lesson available and later work visibly locked, completes
activities in order, returns to `/`, and sees completion counts plus the next
activity unlocked from the progress already stored by the existing lesson,
terminal-lab, and mock-console engines.

## Tech Stack

No new dependencies. Reuse Next.js 16 App Router, React 19, TypeScript,
Vitest, and React Testing Library already installed by `platform-shell`.

Sequencing adds a static curriculum catalog and a small aggregation layer; it
does **not** replace or copy the existing persistence implementations:

- lessons: `lib/progress/storage.ts`
- terminal labs: `lib/terminal-lab/progress.ts`
- mock-console scenarios: `lib/mock-console/progress.ts`

The dashboard is a client component because completion is browser-local and
unavailable during server rendering. Catalog validation and unlock derivation
remain pure functions so they can be unit tested without React or
`localStorage`.

## Commands

```
Dev:       npm run dev
Build:     npm run build
Start:     npm run start
Test:      npm test              # vitest run
Lint:      npm run lint
Typecheck: npm run typecheck     # tsc --noEmit
```

## Project Structure

```
sysadmin-academy/
  SPEC-curriculum-sequencing.md
  src/
    app/
      page.tsx                         (replaces scaffold copy with dashboard)
    components/
      CurriculumPath.tsx               (client-side progress/unlock view)
    content/
      curriculum/
        path.ts                         (the canonical ordered catalog)
    lib/
      curriculum-sequencing/
        progress.ts                     (reads existing stores + derives state)
    types/
      curriculum-sequencing.ts          (catalog and view-state contracts)
  tests/
    app/
      page.test.tsx                     (dashboard integration behavior)
    lib/
      curriculum-sequencing/
        progress.test.ts                (ordering, completion, unlock rules)
```

No new route is needed: `/` is the curriculum dashboard. Existing
`/lessons/[id]`, `/labs/[id]`, `/consoles/[id]`, and `/glossary` routes stay
unchanged.

## Code Style

Represent the path as typed data, not route-name conventions or conditionals
spread through the component. Activity kinds are a discriminated union so the
progress adapter and URL are explicit.

```ts
type CurriculumActivity =
  | { id: string; kind: "lesson"; title: string; href: `/lessons/${string}` }
  | { id: string; kind: "lab"; title: string; href: `/labs/${string}` }
  | { id: string; kind: "console"; title: string; href: `/consoles/${string}` };

interface CurriculumModule {
  id: string;
  title: string;
  schedule: string;
  activities: CurriculumActivity[];
}
```

The canonical sequence is:

1. **Core Fundamentals — Week 1:** Networking Basics, OS Fundamentals,
   Hardware & Troubleshooting, Sysadmin Terminology.
2. **Linux & PowerShell — Weeks 2–3:** Linux CLI Fundamentals → Linux CLI
   lab → PowerShell Fundamentals → PowerShell lab.
3. **Identity & Device Management — Weeks 4–5:** Identity & Access
   Fundamentals → identity console → Apple MDM Fundamentals → device console.
4. **ITSM & Ticketing — Week 6:** The Ticket Lifecycle → ticket console.

That is 14 activities total. Each activity derives one of three states:

- `completed`: its existing progress record has `completed: true`;
- `available`: it is the first activity, or every earlier activity in the
  global path is completed;
- `locked`: one or more earlier activities are incomplete.

Completed activities remain linked even if browser data was manually created
out of order. Completing an activity out of order does not unlock later work:
later work becomes available only when **all** preceding activities are
complete. The dashboard never writes completion itself.

## Testing Strategy

- **Pure unit tests:** flatten the catalog in its declared order, map each
  activity kind to the correct existing progress reader, and verify zero,
  partial, complete, corrupted/missing, and out-of-order progress states.
- **Catalog integrity tests:** assert ids and hrefs are unique, every real
  lesson/lab/scenario appears exactly once, fixtures are excluded, and the
  activity ids resolve through the existing content loaders.
- **Component/page tests:** with empty `localStorage`, `/` renders all four
  modules, `0/14 complete`, one available activity, and locked later
  activities without navigable links. Seed lesson/lab/console progress and
  assert the count, status labels, links, and next activity update correctly.
- **Regression:** run the entire suite plus typecheck, lint, and production
  build because the dashboard imports all three progress systems.
- **Browser:** start with cleared storage, complete the first lesson, return
  home, confirm the second lesson unlocks; seed or complete the intervening
  path and verify a lesson→lab boundary and a lesson→console boundary also
  unlock correctly after navigation/reload.

Tests should assert accessible roles and status text rather than CSS classes.
No snapshot-only coverage.

## Boundaries

- **Always:** use the existing per-activity progress records as the source of
  truth; keep the catalog order explicit and covered by integrity tests; show
  a textual state (`Completed`, `Up next`, or `Locked`) for every activity;
  expose an overall `completed/total` summary; run `npm test`,
  `npm run typecheck`, `npm run lint`, and `npm run build` before completion.
- **Ask first:** changing any existing progress schema or storage key; adding
  an npm dependency; changing lesson/lab/scenario completion semantics;
  reordering the approved module dependency path; adding estimated scores,
  due dates, accounts, or server persistence.
- **Never:** duplicate progress into a new curriculum-level `localStorage`
  record; include sample/demo fixtures in the real path; erase progress from
  the dashboard; make network calls; treat client-side locks as an
  authorization or security boundary.

## Success Criteria

- `/` renders the four modules and all 14 real activities in the canonical
  order, with the stated week groupings and working links for completed or
  available activities.
- With no saved progress, the dashboard displays `0/14 complete`, marks the
  first lesson `Up next`, and marks all later activities `Locked` without
  making them clickable from the dashboard.
- Completing any lesson, terminal lab, or mock-console scenario is reflected
  on the dashboard from that activity's existing progress store after
  returning to or reloading `/`; no separate dashboard persistence is used.
- Completing the current activity unlocks exactly the next activity. Module
  boundaries and lesson→practice boundaries use the same global rule.
- Completed activities remain revisit-able. Direct activity URLs continue to
  render even when the dashboard marks the activity locked, so existing
  lesson cross-links, bookmarks, tests, and authoring workflows do not break.
- Missing or corrupted progress is treated as incomplete and never crashes
  the dashboard, matching the existing storage helpers.
- The dashboard exposes useful progress text and semantic headings/links
  without relying on styling for meaning.
- `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` all
  pass, followed by the browser flow described in Testing Strategy.

## Open Questions

1. **Locks are guidance, not route guards.** Defaulting to disabled links on
   the dashboard while leaving direct URLs accessible. With browser-only
   progress and no accounts, route-level enforcement would not provide real
   security and would break existing cross-links and direct content review.
2. **Quiz completion has no score threshold.** Existing lesson persistence
   marks a lesson complete whenever its quiz is submitted, regardless of
   score. Defaulting to that established meaning instead of quietly changing
   platform-shell behavior inside the sequencing module.
3. **One linear path.** Defaulting to the dependency/build order already
   approved in `CAPABILITY_MAP.md`, with practice immediately after its paired
   lesson. There are no electives or parallel branches in this first version.
4. **Six-week labels, no deadlines.** The capability map asks for a one- to
   two-month path. Defaulting to informational Week 1 through Week 6 module
   labels without dates, reminders, pacing enforcement, or per-activity time
   estimates.
