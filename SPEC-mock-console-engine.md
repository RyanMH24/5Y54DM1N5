# Spec: mock-console-engine

Module in [CAPABILITY_MAP.md](./CAPABILITY_MAP.md). Depends on: platform-shell.

## Objective

Build a reusable simulated SaaS admin console for guided practice. Future
`identity-device-mgmt` and `itsm-ticketing` modules will author Okta-, Jamf-,
and ServiceNow-style scenarios on top of this engine without connecting to
real services.

The user is a solo learner. A successful scenario lets the learner read a
task, navigate between console sections, select a record, choose a canned
action, see the affected record update, and advance through a sequential task
list. Incorrect actions show guidance and leave scenario state unchanged.
Completion and the current task persist across reloads.

This module proves the engine end to end with one product-neutral demo
scenario. Product-specific branding, realistic vendor content, and polished
visual design belong to later modules.

## Tech Stack

- Reuses the platform-shell app: Next.js 16 App Router, React 19, TypeScript,
  Vitest, and React Testing Library.
- Uses plain React state and localStorage. No state-management, form, or
  console-emulation dependency is added.
- Uses unstyled semantic HTML, consistent with the project's deferred visual
  design decision.
- Makes no external network requests and does not execute user-entered code.

## Commands

```text
Dev:       npm run dev
Build:     npm run build
Start:     npm run start
Test:      npm test
Test one:  npm test -- <test-path-or-pattern>
Lint:      npm run lint
Typecheck: npm run typecheck
```

## Public Contract

Scenario content is declarative data. IDs are unique within a scenario, field
values are displayable strings, and action updates are immutable patches.

```ts
export interface MockConsoleRecord {
  id: string;
  title: string;
  fields: Record<string, string>;
}

export interface MockConsoleSection {
  id: string;
  label: string;
  records: MockConsoleRecord[];
}

export interface MockConsoleAction {
  id: string;
  label: string;
  sectionId: string;
  recordId: string;
  updates: Record<string, string>;
}

export interface MockConsoleTask {
  id: string;
  instructions: string;
  expectedActionId: string;
  successMessage: string;
  fallbackMessage: string;
}

export interface MockConsoleScenario {
  id: string;
  title: string;
  productName: string;
  sections: MockConsoleSection[];
  actions: MockConsoleAction[];
  tasks: MockConsoleTask[];
}

export interface MockConsoleProgress {
  scenarioId: string;
  currentTaskIndex: number;
  completed: boolean;
  updatedAt: string;
}
```

The pure engine exposes two operations:

- `createScenarioState(scenario, currentTaskIndex)` constructs initial or
  resumed record state by replaying the expected actions for completed tasks.
- `attemptConsoleAction(scenario, state, actionId)` returns a new state plus a
  matched flag and feedback. The wrong action returns the same state reference;
  the expected action applies its patch, advances one task, and marks the
  scenario complete after the final task.

Missing scenario IDs return `null` from the loader. The route layer owns the
conversion to Next's not-found response, matching the glossary and terminal-lab
modules.

## Project Structure

```text
sysadmin-academy/
  SPEC-mock-console-engine.md
  src/
    app/
      consoles/
        [id]/page.tsx             dynamic demo-scenario route
    components/
      MockConsole.tsx             navigation, records, actions, feedback
      MockConsoleRunner.tsx       hydration-safe progress persistence
    content/
      mock-consoles/              declarative scenarios keyed by id
    lib/
      mock-console/
        engine.ts                 pure action checking and state transitions
        load.ts                   scenario lookup
        progress.ts               safe localStorage persistence
    types/
      mock-console.ts             shared content, state, and progress types
  tests/
    app/consoles/[id]/            route and persistence integration tests
    components/                   component behavior tests
    lib/mock-console/             pure engine, loader, and storage tests
```

## Code Style

- Keep content, pure state transitions, persistence, and React rendering in
  separate modules.
- Use explicit interfaces and named exports. Avoid generic framework
  abstractions until multiple scenarios demonstrate a need.
- Treat scenario definitions as immutable. State transitions create new
  records only for a successful expected action.
- Preserve the project's existing hydration-safe `useSyncExternalStore`
  pattern and stable parsed-object cache for localStorage snapshots.
- Use semantic elements: navigation buttons, record lists, labeled action
  buttons, a live feedback region, and a completion status.

Example transition:

```ts
const result = attemptConsoleAction(scenario, state, "activate-user");

if (result.matched) {
  // result.state contains the patched record and the next task index.
} else {
  // result.state is the original object and result.feedback contains guidance.
}
```

## Testing Strategy

- **Unit:** cover initial-state construction, deterministic replay on resume,
  correct-action patching, sequential advancement, completion, wrong-action
  immutability, unknown IDs, corrupted progress, and stable storage references.
- **Component:** cover section navigation, record selection, available actions,
  visible field updates, fallback feedback, task advancement, activity history,
  and completion.
- **Route/integration:** cover known and unknown scenario IDs, saved-task resume,
  completion persistence across remount, and reset after localStorage is
  cleared.
- **Browser:** run the demo scenario through every task, reload to confirm
  completion, clear localStorage to confirm reset, inspect the accessibility
  tree, and confirm the unknown route returns 404.
- Run the full test suite, typecheck, lint, and production build before the
  module is marked complete.

## Boundaries

- **Always:** keep scenario content declarative; keep engine transitions pure;
  validate localStorage data before use; render user-visible state with
  semantic HTML; preserve the existing project commands and conventions.
- **Ask first:** add a dependency; change this public scenario schema after a
  downstream module authors content against it; add vendor branding or copied
  vendor UI; introduce styling beyond the current project baseline; add any
  hosting or service cost.
- **Never:** connect to Okta, Jamf, ServiceNow, or another external admin
  service; request or store real credentials; execute learner input; mutate the
  local filesystem or network from a simulated action; imply the mock console
  is a real vendor product.

## Success Criteria

- A known demo scenario renders its title, current task, section navigation,
  record list, record detail, and applicable actions.
- The learner can switch sections and select records without changing task
  progress.
- Choosing the expected action updates the target record, shows success
  feedback, and advances exactly one task.
- Choosing any other action shows fallback guidance, does not mutate records,
  and does not advance.
- Activity remains visible for the current session.
- Completing the final task shows an announced completion state.
- Reloading reconstructs record state and restores the current task or
  completion from localStorage; corrupted or out-of-range data resets safely.
- An unknown scenario ID renders Next's not-found UI.
- Tests, typecheck, lint, production build, and the browser flow pass.

## Open Questions

No blocking questions. The following defaults become part of the contract on
approval:

1. Tasks are strictly sequential; branching and optional tasks are deferred.
2. Incorrect actions are non-mutating so learners cannot enter an unrecoverable
   state.
3. Persistence stores only task progress. Record state is reconstructed by
   replaying completed expected actions; activity history is session-only.
4. The demo is product-neutral. Vendor-specific layouts and terminology belong
   to their content modules.
