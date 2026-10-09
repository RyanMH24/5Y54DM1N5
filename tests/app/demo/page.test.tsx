import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import DemoResetPage from "@/app/demo/page";
import { saveProgress } from "@/lib/progress/storage";
import { saveLabProgress } from "@/lib/terminal-lab/progress";
import { saveConsoleProgress } from "@/lib/mock-console/progress";
import { markCompletionNoticeSeen, hasSeenCompletionNotice } from "@/lib/curriculum-sequencing/completion-notice";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

beforeEach(() => {
  localStorage.clear();
  replace.mockClear();
});

describe("Demo reset page", () => {
  it("clears every kind of saved progress and redirects to the home page", () => {
    saveProgress({
      lessonId: "networking-basics",
      completed: true,
      score: 1,
      questions: [],
      updatedAt: "2026-10-07T00:00:00.000Z",
    });
    saveLabProgress({
      labId: "linux-cli-basics-lab",
      currentStepIndex: 4,
      completed: true,
      updatedAt: "2026-10-07T00:00:00.000Z",
    });
    saveConsoleProgress({
      scenarioId: "identity-console-scenario",
      currentTaskIndex: 3,
      completed: true,
      updatedAt: "2026-10-07T00:00:00.000Z",
    });
    markCompletionNoticeSeen();

    render(<DemoResetPage />);

    expect(localStorage.getItem("sysadmin-academy:progress:networking-basics")).toBeNull();
    expect(
      localStorage.getItem("sysadmin-academy:terminal-lab-progress:linux-cli-basics-lab"),
    ).toBeNull();
    expect(
      localStorage.getItem("sysadmin-academy:mock-console-progress:identity-console-scenario"),
    ).toBeNull();
    expect(hasSeenCompletionNotice()).toBe(false);
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("leaves unrelated localStorage keys alone", () => {
    localStorage.setItem("some-other-app:preference", "dark");

    render(<DemoResetPage />);

    expect(localStorage.getItem("some-other-app:preference")).toBe("dark");
  });
});
