import { describe, expect, it } from "vitest";
import { attemptConsoleAction, createScenarioState } from "@/lib/mock-console/engine";
import type { MockConsoleScenario } from "@/types/mock-console";

const scenario: MockConsoleScenario = {
  id: "test-scenario",
  title: "Test Scenario",
  productName: "Test Console",
  sections: [
    {
      id: "users",
      label: "Users",
      records: [
        { id: "user-1", title: "User One", fields: { status: "Active" } },
        { id: "user-2", title: "User Two", fields: { status: "Active" } },
      ],
    },
  ],
  actions: [
    {
      id: "suspend-1",
      label: "Suspend",
      sectionId: "users",
      recordId: "user-1",
      updates: { status: "Suspended" },
    },
    {
      id: "suspend-2",
      label: "Suspend",
      sectionId: "users",
      recordId: "user-2",
      updates: { status: "Suspended" },
    },
    {
      id: "promote-2",
      label: "Promote",
      sectionId: "users",
      recordId: "user-2",
      updates: { status: "Admin" },
    },
  ],
  tasks: [
    {
      id: "task-1",
      instructions: "Suspend user one.",
      expectedActionId: "suspend-1",
      successMessage: "Suspended user one.",
      fallbackMessage: "Wrong action for task 1.",
    },
    {
      id: "task-2",
      instructions: "Promote user two.",
      expectedActionId: "promote-2",
      successMessage: "Promoted user two.",
      fallbackMessage: "Wrong action for task 2.",
    },
  ],
};

describe("createScenarioState", () => {
  it("returns every record unpatched at task index 0", () => {
    const state = createScenarioState(scenario, 0);
    expect(state.records["user-1"].fields.status).toBe("Active");
    expect(state.records["user-2"].fields.status).toBe("Active");
    expect(state.completed).toBe(false);
  });

  it("replays prior tasks' expected actions when resuming mid-scenario", () => {
    const state = createScenarioState(scenario, 1);
    expect(state.records["user-1"].fields.status).toBe("Suspended");
    expect(state.records["user-2"].fields.status).toBe("Active");
    expect(state.completed).toBe(false);
  });

  it("marks completed and fully replays when currentTaskIndex reaches the task count", () => {
    const state = createScenarioState(scenario, 2);
    expect(state.records["user-1"].fields.status).toBe("Suspended");
    expect(state.records["user-2"].fields.status).toBe("Admin");
    expect(state.completed).toBe(true);
  });
});

describe("attemptConsoleAction", () => {
  it("applies the expected action's patch, advances, and reports success", () => {
    const state = createScenarioState(scenario, 0);
    const result = attemptConsoleAction(scenario, state, "suspend-1");

    expect(result.matched).toBe(true);
    expect(result.feedback).toBe("Suspended user one.");
    expect(result.state.records["user-1"].fields.status).toBe("Suspended");
    expect(result.state.currentTaskIndex).toBe(1);
    expect(result.state.completed).toBe(false);
  });

  it("returns the same state reference and fallback feedback for a wrong action", () => {
    const state = createScenarioState(scenario, 0);
    const result = attemptConsoleAction(scenario, state, "suspend-2");

    expect(result.matched).toBe(false);
    expect(result.feedback).toBe("Wrong action for task 1.");
    expect(result.state).toBe(state);
    expect(result.state.records["user-2"].fields.status).toBe("Active");
  });

  it("marks the scenario completed after the final task's expected action", () => {
    const state = createScenarioState(scenario, 1);
    const result = attemptConsoleAction(scenario, state, "promote-2");

    expect(result.matched).toBe(true);
    expect(result.state.completed).toBe(true);
    expect(result.state.currentTaskIndex).toBe(2);
  });

  it("is a no-op when the scenario is already completed", () => {
    const state = createScenarioState(scenario, 2);
    const result = attemptConsoleAction(scenario, state, "suspend-1");

    expect(result.matched).toBe(false);
    expect(result.state).toBe(state);
  });
});
