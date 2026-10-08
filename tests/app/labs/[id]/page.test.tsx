import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Children, isValidElement } from "react";
import LabPage from "@/app/labs/[id]/page";
import { saveLabProgress } from "@/lib/terminal-lab/progress";

beforeEach(() => {
  localStorage.clear();
});

function runCommand(command: string) {
  fireEvent.change(screen.getByLabelText("Command"), { target: { value: command } });
  fireEvent.click(screen.getByRole("button", { name: "Run" }));
}

describe("Lab page", () => {
  it("passes only the serializable lab id into the client runner", async () => {
    const page = await LabPage({ params: Promise.resolve({ id: "sample-lab" }) });
    const runner = Children.toArray(page.props.children).at(-1);

    expect(isValidElement(runner)).toBe(true);
    if (!isValidElement<{ labId?: string; lab?: unknown }>(runner)) return;

    expect(runner.props.labId).toBe("sample-lab");
    expect(runner.props).not.toHaveProperty("lab");
  });

  it("renders a known lab and resumes from saved progress", async () => {
    saveLabProgress({
      labId: "sample-lab",
      currentStepIndex: 1,
      completed: false,
      updatedAt: "2026-10-07T00:00:00.000Z",
    });

    render(await LabPage({ params: Promise.resolve({ id: "sample-lab" }) }));

    expect(
      screen.getByRole("heading", { name: "Explore the Filesystem", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: "Explore the Filesystem" }),
    ).toHaveLength(1);
    expect(screen.getByText("Print the current working directory.")).toBeInTheDocument();
  });

  it("treats progress beyond the lab's steps as not started", async () => {
    saveLabProgress({
      labId: "sample-lab",
      currentStepIndex: 99,
      completed: false,
      updatedAt: "2026-10-07T00:00:00.000Z",
    });

    render(await LabPage({ params: Promise.resolve({ id: "sample-lab" }) }));

    expect(screen.getByText("List the files in the current directory.")).toBeInTheDocument();
  });

  it("persists completion across a page remount and resets after storage is cleared", async () => {
    const firstVisit = render(
      await LabPage({ params: Promise.resolve({ id: "sample-lab" }) }),
    );

    runCommand("ls");
    runCommand("pwd");
    runCommand("whoami");
    expect(screen.getByText(/lab complete/i)).toBeInTheDocument();

    firstVisit.unmount();
    const secondVisit = render(
      await LabPage({ params: Promise.resolve({ id: "sample-lab" }) }),
    );
    expect(screen.getByText(/lab complete/i)).toBeInTheDocument();

    secondVisit.unmount();
    localStorage.clear();
    render(await LabPage({ params: Promise.resolve({ id: "sample-lab" }) }));
    expect(screen.getByText("List the files in the current directory.")).toBeInTheDocument();
  });

  it("calls notFound for an unknown lab id", async () => {
    await expect(
      LabPage({ params: Promise.resolve({ id: "does-not-exist" }) }),
    ).rejects.toThrow();
  });
});
