import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Children, isValidElement } from "react";
import ConsolePage from "@/app/consoles/[id]/page";
import { saveConsoleProgress } from "@/lib/mock-console/progress";

beforeEach(() => {
  localStorage.clear();
});

function selectRecord(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
}

function completeDemoScenario() {
  selectRecord("Jordan Lee");
  fireEvent.click(screen.getByRole("button", { name: "Suspend Account" }));
  fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));
  selectRecord("Avery Smith");
  fireEvent.click(screen.getByRole("button", { name: "Promote to Administrator" }));
}

describe("Console page", () => {
  it("passes only the serializable scenario id into the client runner", async () => {
    const page = await ConsolePage({ params: Promise.resolve({ id: "demo-scenario" }) });
    const runner = Children.toArray(page.props.children).at(-1);

    expect(isValidElement(runner)).toBe(true);
    if (!isValidElement<{ scenarioId?: string; scenario?: unknown }>(runner)) return;

    expect(runner.props.scenarioId).toBe("demo-scenario");
    expect(runner.props).not.toHaveProperty("scenario");
  });

  it("renders a known scenario and resumes from saved progress", async () => {
    saveConsoleProgress({
      scenarioId: "demo-scenario",
      currentTaskIndex: 1,
      completed: false,
      updatedAt: "2026-10-07T00:00:00.000Z",
    });

    render(await ConsolePage({ params: Promise.resolve({ id: "demo-scenario" }) }));

    expect(
      screen.getByRole("heading", { name: "Directory Admin — Demo Scenario", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Jordan Lee has confirmed their identity/)).toBeInTheDocument();
  });

  it("treats progress beyond the scenario's tasks as not started", async () => {
    saveConsoleProgress({
      scenarioId: "demo-scenario",
      currentTaskIndex: 99,
      completed: false,
      updatedAt: "2026-10-07T00:00:00.000Z",
    });

    render(await ConsolePage({ params: Promise.resolve({ id: "demo-scenario" }) }));

    expect(screen.getByText(/Jordan Lee's account needs to be suspended/)).toBeInTheDocument();
  });

  it("persists completion across a page remount and resets after storage is cleared", async () => {
    const firstVisit = render(
      await ConsolePage({ params: Promise.resolve({ id: "demo-scenario" }) }),
    );

    completeDemoScenario();
    expect(screen.getByRole("status")).toHaveTextContent("Scenario complete!");

    firstVisit.unmount();
    const secondVisit = render(
      await ConsolePage({ params: Promise.resolve({ id: "demo-scenario" }) }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Scenario complete!");

    secondVisit.unmount();
    localStorage.clear();
    render(await ConsolePage({ params: Promise.resolve({ id: "demo-scenario" }) }));
    expect(screen.getByText(/Jordan Lee's account needs to be suspended/)).toBeInTheDocument();
  });

  it("restarts the scenario back to the first task and clears saved progress", async () => {
    render(await ConsolePage({ params: Promise.resolve({ id: "demo-scenario" }) }));

    completeDemoScenario();
    expect(screen.getByRole("status")).toHaveTextContent("Scenario complete!");

    fireEvent.click(screen.getByRole("button", { name: "Restart" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText(/Jordan Lee's account needs to be suspended/)).toBeInTheDocument();
  });

  it("calls notFound for an unknown scenario id", async () => {
    await expect(
      ConsolePage({ params: Promise.resolve({ id: "does-not-exist" }) }),
    ).rejects.toThrow();
  });
});
