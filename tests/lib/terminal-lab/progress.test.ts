import { beforeEach, describe, expect, it } from "vitest";
import { clearLabProgress, loadLabProgress, saveLabProgress } from "@/lib/terminal-lab/progress";
import type { TerminalLabProgress } from "@/types/terminal-lab";

const sampleProgress: TerminalLabProgress = {
  labId: "lab-1",
  currentStepIndex: 1,
  completed: false,
  updatedAt: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  localStorage.clear();
});

describe("loadLabProgress", () => {
  it("returns null when nothing has been saved", () => {
    expect(loadLabProgress("lab-1")).toBeNull();
  });

  it("returns null for corrupted (non-JSON) data instead of throwing", () => {
    localStorage.setItem("sysadmin-academy:terminal-lab-progress:lab-1", "not json {{{");
    expect(loadLabProgress("lab-1")).toBeNull();
  });

  it("returns null for malformed JSON missing expected fields", () => {
    localStorage.setItem(
      "sysadmin-academy:terminal-lab-progress:lab-1",
      JSON.stringify({ foo: "bar" }),
    );
    expect(loadLabProgress("lab-1")).toBeNull();
  });

  it("returns null for a negative step index", () => {
    localStorage.setItem(
      "sysadmin-academy:terminal-lab-progress:lab-1",
      JSON.stringify({ ...sampleProgress, currentStepIndex: -1 }),
    );
    expect(loadLabProgress("lab-1")).toBeNull();
  });

  it("returns null when the stored lab id does not match the requested lab", () => {
    localStorage.setItem(
      "sysadmin-academy:terminal-lab-progress:lab-1",
      JSON.stringify({ ...sampleProgress, labId: "lab-2" }),
    );
    expect(loadLabProgress("lab-1")).toBeNull();
  });
});

describe("saveLabProgress / loadLabProgress", () => {
  it("reads back a saved record with the same shape", () => {
    saveLabProgress(sampleProgress);
    expect(loadLabProgress("lab-1")).toEqual(sampleProgress);
  });

  it("keeps records for different labs independent", () => {
    saveLabProgress(sampleProgress);
    saveLabProgress({ ...sampleProgress, labId: "lab-2", completed: true });
    expect(loadLabProgress("lab-1")?.completed).toBe(false);
    expect(loadLabProgress("lab-2")?.completed).toBe(true);
  });
});

describe("clearLabProgress", () => {
  it("resets a lab to not-started", () => {
    saveLabProgress(sampleProgress);
    clearLabProgress("lab-1");
    expect(loadLabProgress("lab-1")).toBeNull();
  });
});

describe("loadLabProgress reference stability", () => {
  it("returns the same object reference across repeated reads of an unchanged value", () => {
    saveLabProgress(sampleProgress);
    expect(loadLabProgress("lab-1")).toBe(loadLabProgress("lab-1"));
  });

  it("returns a new reference after the stored value changes", () => {
    saveLabProgress(sampleProgress);
    const first = loadLabProgress("lab-1");
    saveLabProgress({ ...sampleProgress, completed: true });
    const second = loadLabProgress("lab-1");
    expect(second).not.toBe(first);
    expect(second?.completed).toBe(true);
  });
});
