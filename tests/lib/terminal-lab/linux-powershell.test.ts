import { describe, expect, it } from "vitest";
import { getLabById } from "@/lib/terminal-lab/load";
import { matchCommand } from "@/lib/terminal-lab/match";

describe("linux-powershell labs", () => {
  it.each(["linux-cli-basics-lab", "powershell-basics-lab"])(
    "%s resolves with a sane step count",
    (labId) => {
      const lab = getLabById(labId);
      expect(lab).not.toBeNull();
      expect(lab!.steps.length).toBeGreaterThanOrEqual(3);
      expect(lab!.steps.length).toBeLessThanOrEqual(4);
    },
  );

  it("linux-cli-basics-lab's steps match the commands the lesson teaches, in order", () => {
    const lab = getLabById("linux-cli-basics-lab")!;
    const commands = ["pwd", "ls", "cat notes.txt", "cp notes.txt backup.txt"];

    lab.steps.forEach((step, index) => {
      const result = matchCommand(step, commands[index]);
      expect(result.matched, `step ${index} ("${step.id}") should match "${commands[index]}"`).toBe(
        true,
      );
    });
  });

  it("powershell-basics-lab's steps match the commands the lesson teaches, in order", () => {
    const lab = getLabById("powershell-basics-lab")!;
    const commands = [
      "Get-Process",
      "Get-Service",
      "Get-ChildItem",
      "Get-Process | Where-Object { $_.CPU -gt 100 }",
    ];

    lab.steps.forEach((step, index) => {
      const result = matchCommand(step, commands[index]);
      expect(result.matched, `step ${index} ("${step.id}") should match "${commands[index]}"`).toBe(
        true,
      );
    });
  });

  it("powershell-basics-lab accepts real aliases for get-process and get-service", () => {
    const lab = getLabById("powershell-basics-lab")!;
    const getProcessStep = lab.steps.find((step) => step.id === "get-process")!;
    const getServiceStep = lab.steps.find((step) => step.id === "get-service")!;

    expect(matchCommand(getProcessStep, "gps").matched).toBe(true);
    expect(matchCommand(getServiceStep, "gsv").matched).toBe(true);
  });

  it("powershell-basics-lab's pipeline-filter step tolerates alias and spacing variations", () => {
    const lab = getLabById("powershell-basics-lab")!;
    const pipelineStep = lab.steps.find((step) => step.id === "pipeline-filter")!;

    expect(matchCommand(pipelineStep, "gps | Where-Object { $_.CPU -gt 100 }").matched).toBe(true);
    expect(
      matchCommand(pipelineStep, "Get-Process|Where-Object{ $_.CPU -gt 100 }").matched,
    ).toBe(true);
    expect(matchCommand(pipelineStep, "Get-Process | Where-Object { $_.CPU -gt 5 }").matched).toBe(
      false,
    );
  });
});
