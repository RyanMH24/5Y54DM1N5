import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MockConsole } from "@/components/MockConsole";
import type { MockConsoleScenario } from "@/types/mock-console";

const scenario: MockConsoleScenario = {
  id: "test-scenario",
  title: "Test Console",
  productName: "Test Product",
  sections: [
    {
      id: "users",
      label: "Users",
      records: [
        { id: "user-1", title: "User One", fields: { status: "Active" } },
        { id: "user-2", title: "User Two", fields: { status: "Active" } },
      ],
    },
  ],
  actions: [
    {
      id: "suspend-1",
      label: "Suspend",
      sectionId: "users",
      recordId: "user-1",
      updates: { status: "Suspended" },
    },
    {
      id: "suspend-2",
      label: "Suspend",
      sectionId: "users",
      recordId: "user-2",
      updates: { status: "Suspended" },
    },
    {
      id: "promote-2",
      label: "Promote",
      sectionId: "users",
      recordId: "user-2",
      updates: { status: "Admin" },
    },
  ],
  tasks: [
    {
      id: "task-1",
      instructions: "Suspend user one.",
      expectedActionId: "suspend-1",
      successMessage: "Suspended user one.",
      fallbackMessage: "Wrong action for task 1.",
    },
    {
      id: "task-2",
      instructions: "Promote user two.",
      expectedActionId: "promote-2",
      successMessage: "Promoted user two.",
      fallbackMessage: "Wrong action for task 2.",
    },
  ],
};

function selectRecord(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
}

describe("MockConsole", () => {
  it("renders the current task's instructions, section nav, and the active section's records", () => {
    render(<MockConsole scenario={scenario} />);

    expect(screen.getByText("Suspend user one.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Users" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "User One" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "User Two" })).toBeInTheDocument();
  });

  it("shows a record's detail and available actions once selected", () => {
    render(<MockConsole scenario={scenario} />);
    selectRecord("User One");

    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Suspend" })).toBeInTheDocument();
  });

  it("does not change the task or call onProgress when switching sections or records", () => {
    const onProgress = vi.fn();
    render(<MockConsole scenario={scenario} onProgress={onProgress} />);

    selectRecord("User One");
    selectRecord("User Two");
    fireEvent.click(screen.getByRole("button", { name: "Users" }));

    expect(screen.getByText("Suspend user one.")).toBeInTheDocument();
    expect(onProgress).not.toHaveBeenCalled();
  });

  it("applies the expected action, shows success feedback, and advances to the next task", () => {
    const onProgress = vi.fn();
    render(<MockConsole scenario={scenario} onProgress={onProgress} />);

    selectRecord("User One");
    fireEvent.click(screen.getByRole("button", { name: "Suspend" }));

    expect(within(screen.getByRole("log")).getByText(/Suspended user one\./)).toBeInTheDocument();
    expect(screen.getByText("Suspended")).toBeInTheDocument();
    expect(screen.getByText("Promote user two.")).toBeInTheDocument();
    expect(onProgress).toHaveBeenCalledWith({ currentTaskIndex: 1, completed: false });
  });

  it("shows fallback feedback and does not mutate the record or advance on a wrong action", () => {
    const onProgress = vi.fn();
    render(<MockConsole scenario={scenario} onProgress={onProgress} />);

    selectRecord("User Two");
    fireEvent.click(screen.getByRole("button", { name: "Suspend" }));

    expect(within(screen.getByRole("log")).getByText(/Wrong action for task 1\./)).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Suspend user one.")).toBeInTheDocument();
    expect(onProgress).not.toHaveBeenCalled();
  });

  it("shows a completion state with a Next link back to the home page after the final task's expected action", () => {
    render(<MockConsole scenario={scenario} />);

    selectRecord("User One");
    fireEvent.click(screen.getByRole("button", { name: "Suspend" }));
    selectRecord("User Two");
    fireEvent.click(screen.getByRole("button", { name: "Promote" }));

    expect(screen.getByRole("status")).toHaveTextContent("Scenario complete!");
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/");
  });

  it("starts from initialTaskIndex when resuming", () => {
    render(<MockConsole scenario={scenario} initialTaskIndex={1} />);
    expect(screen.getByText("Promote user two.")).toBeInTheDocument();
  });

  it("omits the Restart button when onRestart isn't provided", () => {
    render(<MockConsole scenario={scenario} />);
    expect(screen.queryByRole("button", { name: "Restart" })).not.toBeInTheDocument();
  });

  it("renders a Restart button that calls onRestart, available even before the scenario is complete", () => {
    const onRestart = vi.fn();
    render(<MockConsole scenario={scenario} onRestart={onRestart} />);

    fireEvent.click(screen.getByRole("button", { name: "Restart" }));
    expect(onRestart).toHaveBeenCalledOnce();
  });
});
