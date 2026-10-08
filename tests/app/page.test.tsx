import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import HomePage from "@/app/page";
import { curriculumModules, flattenCurriculum } from "@/content/curriculum/path";
import { saveProgress } from "@/lib/progress/storage";
import { saveLabProgress } from "@/lib/terminal-lab/progress";
import { saveConsoleProgress } from "@/lib/mock-console/progress";
import type { CurriculumActivity } from "@/types/curriculum-sequencing";

const activities = flattenCurriculum(curriculumModules);

function completeActivity(activity: CurriculumActivity) {
  if (activity.kind === "lesson") {
    saveProgress({
      lessonId: activity.id,
      completed: true,
      score: 1,
      questions: [],
      updatedAt: "2026-10-07T00:00:00.000Z",
    });
  } else if (activity.kind === "lab") {
    saveLabProgress({
      labId: activity.id,
      currentStepIndex: 4,
      completed: true,
      updatedAt: "2026-10-07T00:00:00.000Z",
    });
  } else {
    saveConsoleProgress({
      scenarioId: activity.id,
      currentTaskIndex: 3,
      completed: true,
      updatedAt: "2026-10-07T00:00:00.000Z",
    });
  }
}

beforeEach(() => {
  localStorage.clear();
});

describe("Home page curriculum dashboard", () => {
  it("shows the full path with only the first activity available for a new learner", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Sysadmin Academy", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("0/14 complete");
    expect(screen.getAllByRole("heading", { level: 2 }).map(({ textContent }) => textContent)).toEqual(
      ["Core Fundamentals", "Linux & PowerShell", "Identity & Device Management", "ITSM & Ticketing"],
    );
    expect(screen.getByRole("link", { name: "Networking Basics" })).toHaveAttribute(
      "href",
      "/lessons/networking-basics",
    );
    expect(screen.queryByRole("link", { name: "OS Fundamentals" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Up next")).toHaveLength(1);
    expect(screen.getAllByText("Locked")).toHaveLength(13);
  });

  it("reflects a consecutive prefix completed across lesson, lab, and console stores", () => {
    activities.slice(0, 10).forEach(completeActivity);

    render(<HomePage />);

    expect(screen.getByRole("status")).toHaveTextContent("10/14 complete");
    expect(screen.getAllByText("Completed")).toHaveLength(10);
    expect(screen.getByRole("link", { name: "Apple MDM Fundamentals" })).toHaveAttribute(
      "href",
      "/lessons/apple-mdm-basics",
    );
    expect(screen.queryByRole("link", { name: "Device Console Scenario" })).not.toBeInTheDocument();
  });

  it("keeps an out-of-order completed activity linked without unlocking past the gap", () => {
    completeActivity(activities[1]);

    render(<HomePage />);

    const completedItem = screen.getByText("OS Fundamentals").closest("li");
    const lockedItem = screen.getByText("Hardware & Troubleshooting").closest("li");

    expect(screen.getByRole("status")).toHaveTextContent("1/14 complete");
    expect(screen.getByRole("link", { name: "Networking Basics" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "OS Fundamentals" })).toBeInTheDocument();
    expect(within(completedItem!).getByText("Completed")).toBeInTheDocument();
    expect(within(lockedItem!).getByText("Locked")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Hardware & Troubleshooting" })).not.toBeInTheDocument();
  });

  it("shows a completion message when every activity is complete", () => {
    activities.forEach(completeActivity);

    render(<HomePage />);

    expect(screen.getByRole("status")).toHaveTextContent("14/14 complete");
    expect(screen.getByText("Curriculum complete")).toBeInTheDocument();
    expect(screen.queryByText("Up next")).not.toBeInTheDocument();
    expect(screen.queryByText("Locked")).not.toBeInTheDocument();
  });
});
