# To-do: curriculum-sequencing

Plan: [curriculum-sequencing-plan.md](./curriculum-sequencing-plan.md) · Spec:
[../SPEC-curriculum-sequencing.md](../SPEC-curriculum-sequencing.md)

## Phase 1: Catalog and state foundation

- [x] Task 1: Typed curriculum catalog + integrity tests
- [ ] Task 2: Cross-store progress derivation + unit tests

### Checkpoint: Foundation

- [ ] Catalog resolves all 14 real activities once in the approved order
- [ ] Progress states cover empty, partial, out-of-order, corrupted, and
      complete storage
- [ ] Focused tests, typecheck, and lint pass

## Phase 2: Dashboard and end-to-end verification

- [ ] Task 3: Curriculum dashboard on `/`
- [ ] Task 4: Full regression + browser verification

### Checkpoint: Complete

- [ ] Cleared browser shows `0/14 complete`, one `Up next`, and 13 locked items
- [ ] Lesson→lesson, lesson→lab, and lesson→console boundaries unlock correctly
- [ ] Completed activities remain linked and direct locked URLs still render
- [ ] Full test, typecheck, lint, and build gates pass
- [ ] All spec Success Criteria met
- [ ] Review with project owner before considering the capability map complete
