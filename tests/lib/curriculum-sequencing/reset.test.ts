import { beforeEach, describe, expect, it } from "vitest";
import { clearAllProgress } from "@/lib/curriculum-sequencing/reset";

beforeEach(() => {
  localStorage.clear();
});

describe("clearAllProgress", () => {
  it("removes every key under the app's storage namespace", () => {
    localStorage.setItem("sysadmin-academy:progress:networking-basics", "{}");
    localStorage.setItem("sysadmin-academy:terminal-lab-progress:linux-cli-basics-lab", "{}");
    localStorage.setItem(
      "sysadmin-academy:mock-console-progress:identity-console-scenario",
      "{}",
    );
    localStorage.setItem("sysadmin-academy:curriculum-completion-seen", "true");

    clearAllProgress();

    expect(localStorage.length).toBe(0);
  });

  it("leaves keys outside the app's storage namespace untouched", () => {
    localStorage.setItem("sysadmin-academy:progress:networking-basics", "{}");
    localStorage.setItem("some-other-app:preference", "dark");

    clearAllProgress();

    expect(localStorage.getItem("sysadmin-academy:progress:networking-basics")).toBeNull();
    expect(localStorage.getItem("some-other-app:preference")).toBe("dark");
  });

  it("is a no-op when nothing is stored", () => {
    expect(() => clearAllProgress()).not.toThrow();
    expect(localStorage.length).toBe(0);
  });
});
