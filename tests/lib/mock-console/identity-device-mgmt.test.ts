import { describe, expect, it } from "vitest";
import { getScenarioById } from "@/lib/mock-console/load";

describe("identity-device-mgmt scenarios", () => {
  it.each(["identity-console-scenario", "device-console-scenario"])(
    "%s resolves and every task's expected action exists and targets the right record",
    (scenarioId) => {
      const scenario = getScenarioById(scenarioId);
      expect(scenario).not.toBeNull();
      expect(scenario!.tasks.length).toBeGreaterThan(0);

      for (const task of scenario!.tasks) {
        const action = scenario!.actions.find((a) => a.id === task.expectedActionId);
        expect(action, `task "${task.id}" expects a real action`).toBeDefined();

        const record = scenario!.sections
          .flatMap((section) => section.records)
          .find((r) => r.id === action!.recordId);
        expect(record, `action "${action!.id}" targets a real record`).toBeDefined();
      }
    },
  );

  it("each scenario has at least one distractor action per task's record", () => {
    for (const scenarioId of ["identity-console-scenario", "device-console-scenario"]) {
      const scenario = getScenarioById(scenarioId)!;

      for (const task of scenario.tasks) {
        const expectedAction = scenario.actions.find((a) => a.id === task.expectedActionId)!;
        const distractors = scenario.actions.filter(
          (a) => a.recordId === expectedAction.recordId && a.id !== expectedAction.id,
        );
        expect(
          distractors.length,
          `task "${task.id}" should have a distractor action on the same record`,
        ).toBeGreaterThan(0);
      }
    }
  });
});
