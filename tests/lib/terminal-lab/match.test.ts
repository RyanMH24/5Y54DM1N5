import { describe, expect, it } from "vitest";
import { matchCommand } from "@/lib/terminal-lab/match";
import type { TerminalLabStep } from "@/types/terminal-lab";

const step: TerminalLabStep = {
  id: "step-1",
  instructions: "List the files in the current directory.",
  matches: [
    { pattern: "ls", output: "file1.txt  file2.txt" },
    { pattern: /^ls\s+-la$/i, output: "drwxr-xr-x  file1.txt  file2.txt" },
  ],
  fallbackOutput: "command not found",
};

describe("matchCommand", () => {
  it("matches a string pattern exactly", () => {
    expect(matchCommand(step, "ls")).toEqual({
      matched: true,
      output: "file1.txt  file2.txt",
    });
  });

  it("matches a string pattern case-insensitively, trimmed, with collapsed whitespace", () => {
    expect(matchCommand(step, "  LS  ")).toEqual({
      matched: true,
      output: "file1.txt  file2.txt",
    });
  });

  it("matches a RegExp pattern via .test()", () => {
    expect(matchCommand(step, "ls -la")).toEqual({
      matched: true,
      output: "drwxr-xr-x  file1.txt  file2.txt",
    });
  });

  it("returns the fallback output when nothing matches", () => {
    expect(matchCommand(step, "rm -rf /")).toEqual({
      matched: false,
      output: "command not found",
    });
  });

  it("uses the first matching pattern when more than one could match", () => {
    const ambiguousStep: TerminalLabStep = {
      id: "step-2",
      instructions: "...",
      matches: [
        { pattern: /^ls/, output: "first match" },
        { pattern: "ls", output: "second match" },
      ],
      fallbackOutput: "nope",
    };
    expect(matchCommand(ambiguousStep, "ls")).toEqual({ matched: true, output: "first match" });
  });
});
