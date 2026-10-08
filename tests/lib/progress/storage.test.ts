import { beforeEach, describe, expect, it } from "vitest";
import { clearProgress, loadProgress, saveProgress } from "@/lib/progress/storage";
import type { ProgressRecord } from "@/types/curriculum";

const sampleRecord: ProgressRecord = {
  lessonId: "lesson-1",
  completed: true,
  score: 1,
  questions: [{ questionId: "q1", lastAnswer: "a", correct: true }],
  updatedAt: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  localStorage.clear();
});

describe("loadProgress", () => {
  it("returns null when nothing has been saved", () => {
    expect(loadProgress("lesson-1")).toBeNull();
  });

  it("returns null for corrupted (non-JSON) data instead of throwing", () => {
    localStorage.setItem("sysadmin-academy:progress:lesson-1", "not json {{{");
    expect(loadProgress("lesson-1")).toBeNull();
  });

  it("returns null for malformed JSON missing expected fields", () => {
    localStorage.setItem("sysadmin-academy:progress:lesson-1", JSON.stringify({ foo: "bar" }));
    expect(loadProgress("lesson-1")).toBeNull();
  });
});

describe("saveProgress / loadProgress", () => {
  it("reads back a saved record with the same shape", () => {
    saveProgress(sampleRecord);
    expect(loadProgress("lesson-1")).toEqual(sampleRecord);
  });

  it("keeps records for different lessons independent", () => {
    saveProgress(sampleRecord);
    saveProgress({ ...sampleRecord, lessonId: "lesson-2", completed: false });
    expect(loadProgress("lesson-1")?.completed).toBe(true);
    expect(loadProgress("lesson-2")?.completed).toBe(false);
  });
});

describe("clearProgress", () => {
  it("resets a lesson to not-started", () => {
    saveProgress(sampleRecord);
    clearProgress("lesson-1");
    expect(loadProgress("lesson-1")).toBeNull();
  });
});

describe("loadProgress reference stability", () => {
  it("returns the same object reference across repeated reads of an unchanged value", () => {
    saveProgress(sampleRecord);
    expect(loadProgress("lesson-1")).toBe(loadProgress("lesson-1"));
  });

  it("returns a new reference after the stored value changes", () => {
    saveProgress(sampleRecord);
    const first = loadProgress("lesson-1");
    saveProgress({ ...sampleRecord, completed: false });
    const second = loadProgress("lesson-1");
    expect(second).not.toBe(first);
    expect(second?.completed).toBe(false);
  });
});
