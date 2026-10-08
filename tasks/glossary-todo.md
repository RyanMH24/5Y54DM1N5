# To-do: glossary

Plan: [glossary-plan.md](./glossary-plan.md) · Spec: [../SPEC-glossary.md](../SPEC-glossary.md)

## Phase 1: Foundation

- [x] Task 1: Shared type, content data, and glossary lib (load/get/search)

### Checkpoint: Foundation
- [x] `npm test`, `npm run typecheck`, `npm run lint` all pass

## Phase 2: UI Components

- [x] Task 2: GlossarySearch component
- [x] Task 3: GlossaryList component

### Checkpoint: Components
- [x] GlossarySearch and GlossaryList component tests pass

## Phase 3: Routes & cross-linking

- [x] Task 4: `/glossary` index route (search + list wired together)
- [x] Task 5: `/glossary/[id]` detail route with not-found handling
- [x] Task 6: Cross-link demo from the sample lesson to a glossary term

### Checkpoint: Complete
- [x] Full flow works in the browser: browse → search → open a term → detail
      renders; unknown id → not-found; sample lesson's glossary link resolves
- [x] All spec Success Criteria met
- [ ] Review with project owner before starting the next module
