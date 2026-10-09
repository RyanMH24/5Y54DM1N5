import { describe, expect, it } from "vitest";
import { getScenarioById } from "@/lib/mock-console/load";

describe("linux-fundamentals scenario", () => {
  it("resolves and every task's expected action exists and targets the right record", () => {
    const scenario = getScenarioById("linux-console-scenario");
    expect(scenario).not.toBeNull();
    expect(scenario!.tasks.length).toBe(11);

    for (const task of scenario!.tasks) {
      const action = scenario!.actions.find((a) => a.id === task.expectedActionId);
      expect(action, `task "${task.id}" expects a real action`).toBeDefined();

      const record = scenario!.sections
        .flatMap((section) => section.records)
        .find((r) => r.id === action!.recordId);
      expect(record, `action "${action!.id}" targets a real record`).toBeDefined();
    }
  });

  it("all five tasks walk the same server through its full lifecycle", () => {
    const scenario = getScenarioById("linux-console-scenario")!;
    const targetRecordIds = scenario.tasks.map((task) => {
      const action = scenario.actions.find((a) => a.id === task.expectedActionId)!;
      return action.recordId;
    });

    expect(new Set(targetRecordIds).size).toBe(1);
  });

  it("has at least one distractor action available on the server at every stage", () => {
    const scenario = getScenarioById("linux-console-scenario")!;

    for (const task of scenario.tasks) {
      const expectedAction = scenario.actions.find((a) => a.id === task.expectedActionId)!;
      const distractors = scenario.actions.filter(
        (a) => a.recordId === expectedAction.recordId && a.id !== expectedAction.id,
      );
      expect(
        distractors.length,
        `task "${task.id}" should have a distractor action on the same server`,
      ).toBeGreaterThan(0);
    }
  });
});
