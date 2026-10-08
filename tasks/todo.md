# To-do: platform-shell

Plan: [plan.md](./plan.md) · Spec: [../SPEC-platform-shell.md](../SPEC-platform-shell.md)

## Phase 1: Foundation

- [x] Task 1: Project scaffold & tooling
- [x] Task 2: Shared types + quiz grading engine
- [x] Task 3: Progress tracking helpers

### Checkpoint: Foundation
- [x] `npm test`, `npm run typecheck`, `npm run lint` all pass

## Phase 2: Content & Rendering

- [x] Task 4: Curriculum/content loader + sample lesson fixture
- [x] Task 5: Quiz UI components

### Checkpoint: Content & Rendering
- [x] Sample lesson's MDX and quiz data load and parse correctly
- [x] Quiz components render both question types and grade on submit

## Phase 3: End-to-end wiring

- [x] Task 6: LessonRenderer + lesson route
- [x] Task 7: Progress persistence wired into the lesson page

### Checkpoint: Complete
- [x] Full flow works in the browser: lesson → quiz → score → reload → progress persists
- [x] All spec Success Criteria met
- [ ] Review with project owner before starting the next module
