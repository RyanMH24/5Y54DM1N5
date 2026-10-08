import { describe, expect, it } from "vitest";
import { getLabById } from "@/lib/terminal-lab/load";

describe("getLabById", () => {
  it("returns the matching lab for a known id", () => {
    const lab = getLabById("sample-lab");
    expect(lab).not.toBeNull();
    expect(lab?.steps.length).toBeGreaterThan(0);
  });

  it("returns null for an unknown id", () => {
    expect(getLabById("does-not-exist")).toBeNull();
  });
});
