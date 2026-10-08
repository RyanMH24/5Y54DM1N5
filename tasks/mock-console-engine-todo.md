# To-do: mock-console-engine

Plan: [mock-console-engine-plan.md](./mock-console-engine-plan.md) · Spec: [../SPEC-mock-console-engine.md](../SPEC-mock-console-engine.md)

## Phase 1: Foundation

- [x] Task 1: Shared types + pure engine (createScenarioState, attemptConsoleAction)
- [x] Task 2: Scenario progress persistence
- [x] Task 3: Scenario content loader + demo scenario fixture

### Checkpoint: Foundation
- [x] `npm test`, `npm run typecheck`, `npm run lint` all pass

## Phase 2: MockConsole component

- [x] Task 4: `MockConsole` component

### Checkpoint: Component
- [x] `MockConsole` component tests pass (navigate, act, fallback, advance, completion)

## Phase 3: Route & wiring

- [x] Task 5: `/consoles/[id]` route with progress persistence

### Checkpoint: Complete
- [x] Full flow works in the browser: open scenario → navigate sections →
      select records → take expected actions → completion → reload → still
      complete → clear localStorage → back to not-started → unknown id → 404
- [x] All spec Success Criteria met
- [ ] Review with project owner before starting the next module
