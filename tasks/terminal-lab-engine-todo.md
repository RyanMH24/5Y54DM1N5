# To-do: terminal-lab-engine

Plan: [terminal-lab-engine-plan.md](./terminal-lab-engine-plan.md) · Spec: [../SPEC-terminal-lab-engine.md](../SPEC-terminal-lab-engine.md)

## Phase 1: Foundation

- [x] Task 1: Shared types + command-matching logic
- [x] Task 2: Lab progress persistence
- [x] Task 3: Lab content loader + sample lab fixture

### Checkpoint: Foundation
- [x] `npm test`, `npm run typecheck`, `npm run lint` all pass

## Phase 2: Terminal component

- [x] Task 4: `Terminal` component

### Checkpoint: Component
- [x] `Terminal` component tests pass (match, advance, fallback, completion)

## Phase 3: Route & wiring

- [x] Task 5: `/labs/[id]` route with progress persistence

### Checkpoint: Complete
- [x] Full flow works in the browser: open lab → type commands → advance
      through steps → completion → reload → still complete → clear
      localStorage → back to not-started
- [x] All spec Success Criteria met
- [x] Review with project owner before starting the next module
