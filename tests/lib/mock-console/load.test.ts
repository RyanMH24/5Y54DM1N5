import { describe, expect, it } from "vitest";
import { getScenarioById } from "@/lib/mock-console/load";

describe("getScenarioById", () => {
  it("returns the matching scenario for a known id", () => {
    const scenario = getScenarioById("demo-scenario");
    expect(scenario).not.toBeNull();
    expect(scenario?.tasks.length).toBeGreaterThan(0);
  });

  it("returns null for an unknown id", () => {
    expect(getScenarioById("does-not-exist")).toBeNull();
  });

  it("has at least one distractor action per record that no task expects", () => {
    const scenario = getScenarioById("demo-scenario")!;
    const expectedActionIds = new Set(scenario.tasks.map((task) => task.expectedActionId));
    const distractors = scenario.actions.filter((action) => !expectedActionIds.has(action.id));
    expect(distractors.length).toBeGreaterThan(0);
  });
});
