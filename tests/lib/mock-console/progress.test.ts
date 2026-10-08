import { beforeEach, describe, expect, it } from "vitest";
import {
  clearConsoleProgress,
  loadConsoleProgress,
  saveConsoleProgress,
} from "@/lib/mock-console/progress";
import type { MockConsoleProgress } from "@/types/mock-console";

const sampleProgress: MockConsoleProgress = {
  scenarioId: "scenario-1",
  currentTaskIndex: 1,
  completed: false,
  updatedAt: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  localStorage.clear();
});

describe("loadConsoleProgress", () => {
  it("returns null when nothing has been saved", () => {
    expect(loadConsoleProgress("scenario-1")).toBeNull();
  });

  it("returns null for corrupted (non-JSON) data instead of throwing", () => {
    localStorage.setItem("sysadmin-academy:mock-console-progress:scenario-1", "not json {{{");
    expect(loadConsoleProgress("scenario-1")).toBeNull();
  });

  it("returns null for malformed JSON missing expected fields", () => {
    localStorage.setItem(
      "sysadmin-academy:mock-console-progress:scenario-1",
      JSON.stringify({ foo: "bar" }),
    );
    expect(loadConsoleProgress("scenario-1")).toBeNull();
  });

  it("returns null for a negative task index", () => {
    localStorage.setItem(
      "sysadmin-academy:mock-console-progress:scenario-1",
      JSON.stringify({ ...sampleProgress, currentTaskIndex: -1 }),
    );
    expect(loadConsoleProgress("scenario-1")).toBeNull();
  });

  it("returns null when the stored scenario id does not match the requested one", () => {
    localStorage.setItem(
      "sysadmin-academy:mock-console-progress:scenario-1",
      JSON.stringify({ ...sampleProgress, scenarioId: "scenario-2" }),
    );
    expect(loadConsoleProgress("scenario-1")).toBeNull();
  });
});

describe("saveConsoleProgress / loadConsoleProgress", () => {
  it("reads back a saved record with the same shape", () => {
    saveConsoleProgress(sampleProgress);
    expect(loadConsoleProgress("scenario-1")).toEqual(sampleProgress);
  });

  it("keeps records for different scenarios independent", () => {
    saveConsoleProgress(sampleProgress);
    saveConsoleProgress({ ...sampleProgress, scenarioId: "scenario-2", completed: true });
    expect(loadConsoleProgress("scenario-1")?.completed).toBe(false);
    expect(loadConsoleProgress("scenario-2")?.completed).toBe(true);
  });
});

describe("clearConsoleProgress", () => {
  it("resets a scenario to not-started", () => {
    saveConsoleProgress(sampleProgress);
    clearConsoleProgress("scenario-1");
    expect(loadConsoleProgress("scenario-1")).toBeNull();
  });
});

describe("loadConsoleProgress reference stability", () => {
  it("returns the same object reference across repeated reads of an unchanged value", () => {
    saveConsoleProgress(sampleProgress);
    expect(loadConsoleProgress("scenario-1")).toBe(loadConsoleProgress("scenario-1"));
  });

  it("returns a new reference after the stored value changes", () => {
    saveConsoleProgress(sampleProgress);
    const first = loadConsoleProgress("scenario-1");
    saveConsoleProgress({ ...sampleProgress, completed: true });
    const second = loadConsoleProgress("scenario-1");
    expect(second).not.toBe(first);
    expect(second?.completed).toBe(true);
  });
});
