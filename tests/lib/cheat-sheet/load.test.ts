import { describe, expect, it } from "vitest";
import {
  getAllCommands,
  getCommandsByShell,
  groupByCategory,
  searchCommands,
} from "@/lib/cheat-sheet/load";
import type { CheatSheetCommand } from "@/types/cheat-sheet";

describe("getAllCommands", () => {
  it("returns every command from the content registry", () => {
    const all = getAllCommands();
    expect(all.length).toBeGreaterThan(0);
    expect(all.map((c) => c.id)).toContain("linux-ps");
  });
});

describe("getCommandsByShell", () => {
  it("returns only commands for the requested shell", () => {
    const linuxCommands = getCommandsByShell("linux");
    expect(linuxCommands.length).toBeGreaterThan(0);
    expect(linuxCommands.every((c) => c.shell === "linux")).toBe(true);
  });

  it("keeps each shell distinct", () => {
    expect(getCommandsByShell("powershell").some((c) => c.command === "Get-Process")).toBe(true);
    expect(getCommandsByShell("zsh").some((c) => c.command === "Get-Process")).toBe(false);
  });
});

describe("searchCommands", () => {
  const sample: CheatSheetCommand[] = [
    {
      id: "linux-ps",
      shell: "linux",
      category: "Processes & Services",
      command: "ps aux",
      description: "List every running process.",
    },
    {
      id: "linux-chmod",
      shell: "linux",
      category: "Users & Permissions",
      command: "chmod",
      description: "Change a file's permission bits.",
    },
  ];

  it("returns every command for an empty query", () => {
    expect(searchCommands(sample, "")).toEqual(sample);
    expect(searchCommands(sample, "   ")).toEqual(sample);
  });

  it("matches case-insensitively on the command name", () => {
    expect(searchCommands(sample, "PS AUX")).toEqual([sample[0]]);
  });

  it("matches on the description", () => {
    expect(searchCommands(sample, "permission bits")).toEqual([sample[1]]);
  });

  it("matches on the category", () => {
    expect(searchCommands(sample, "Users & Permissions")).toEqual([sample[1]]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(searchCommands(sample, "nonexistent")).toEqual([]);
  });
});

describe("groupByCategory", () => {
  it("groups commands under their category, preserving first-seen category order", () => {
    const sample: CheatSheetCommand[] = [
      {
        id: "a",
        shell: "linux",
        category: "Navigation & Files",
        command: "pwd",
        description: "x",
      },
      {
        id: "b",
        shell: "linux",
        category: "Processes & Services",
        command: "ps",
        description: "y",
      },
      {
        id: "c",
        shell: "linux",
        category: "Navigation & Files",
        command: "cd",
        description: "z",
      },
    ];

    expect(groupByCategory(sample)).toEqual([
      { category: "Navigation & Files", commands: [sample[0], sample[2]] },
      { category: "Processes & Services", commands: [sample[1]] },
    ]);
  });

  it("returns an empty array for an empty list", () => {
    expect(groupByCategory([])).toEqual([]);
  });
});
