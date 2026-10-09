import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Terminal } from "@/components/Terminal";
import type { TerminalLab } from "@/types/terminal-lab";

const lab: TerminalLab = {
  id: "test-lab",
  title: "Test Lab",
  steps: [
    {
      id: "step-1",
      instructions: "List files.",
      matches: [{ pattern: "ls", output: "file1.txt" }],
      fallbackOutput: "not found",
    },
    {
      id: "step-2",
      instructions: "Print working directory.",
      matches: [{ pattern: "pwd", output: "/home/learner" }],
      fallbackOutput: "not found",
    },
  ],
};

function runCommand(command: string) {
  fireEvent.change(screen.getByLabelText("Command"), { target: { value: command } });
  fireEvent.click(screen.getByRole("button", { name: "Run" }));
}

describe("Terminal", () => {
  it("renders the current step's instructions", () => {
    render(<Terminal lab={lab} />);
    expect(screen.getByText("List files.")).toBeInTheDocument();
    expect(screen.getByRole("log", { name: "Command history" })).toBeInTheDocument();
  });

  it("shows matched output and advances to the next step on a matching command", () => {
    render(<Terminal lab={lab} />);
    runCommand("ls");

    expect(screen.getByText("file1.txt")).toBeInTheDocument();
    expect(screen.getByText("Print working directory.")).toBeInTheDocument();
  });

  it("shows fallback output and stays on the same step for a non-matching command", () => {
    render(<Terminal lab={lab} />);
    runCommand("rm -rf /");

    expect(screen.getByText("not found")).toBeInTheDocument();
    expect(screen.getByText("List files.")).toBeInTheDocument();
  });

  it("shows a completion state with a Next link back to the home page after the last step's command matches", () => {
    render(<Terminal lab={lab} />);
    runCommand("ls");
    runCommand("pwd");

    expect(screen.getByRole("status")).toHaveTextContent(/lab complete/i);
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/");
  });

  it("calls onProgress with the updated step index and completion state", () => {
    const onProgress = vi.fn();
    render(<Terminal lab={lab} onProgress={onProgress} />);
    runCommand("ls");

    expect(onProgress).toHaveBeenCalledWith({ currentStepIndex: 1, completed: false });
  });

  it("does not call onProgress for a non-matching command", () => {
    const onProgress = vi.fn();
    render(<Terminal lab={lab} onProgress={onProgress} />);
    runCommand("nope");

    expect(onProgress).not.toHaveBeenCalled();
  });

  it("starts from initialProgress when resuming", () => {
    render(<Terminal lab={lab} initialProgress={{ currentStepIndex: 1, completed: false }} />);
    expect(screen.getByText("Print working directory.")).toBeInTheDocument();
  });

  it("starts in the completed state when resuming an already-completed lab", () => {
    render(<Terminal lab={lab} initialProgress={{ currentStepIndex: 2, completed: true }} />);
    expect(screen.getByText(/lab complete/i)).toBeInTheDocument();
  });

  it("omits the Restart button when onRestart isn't provided", () => {
    render(<Terminal lab={lab} />);
    expect(screen.queryByRole("button", { name: "Restart" })).not.toBeInTheDocument();
  });

  it("renders a Restart button that calls onRestart, available even before the lab is complete", () => {
    const onRestart = vi.fn();
    render(<Terminal lab={lab} onRestart={onRestart} />);

    fireEvent.click(screen.getByRole("button", { name: "Restart" }));
    expect(onRestart).toHaveBeenCalledOnce();
  });
});
