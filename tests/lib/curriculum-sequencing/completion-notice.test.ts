import { beforeEach, describe, expect, it } from "vitest";
import {
  hasSeenCompletionNotice,
  markCompletionNoticeSeen,
} from "@/lib/curriculum-sequencing/completion-notice";

beforeEach(() => {
  localStorage.clear();
});

describe("completion notice storage", () => {
  it("has not been seen before anything is recorded", () => {
    expect(hasSeenCompletionNotice()).toBe(false);
  });

  it("is seen after being marked", () => {
    markCompletionNoticeSeen();

    expect(hasSeenCompletionNotice()).toBe(true);
  });
});
