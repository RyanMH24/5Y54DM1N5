import type { CheatSheetCommand, CheatSheetShell } from "@/types/cheat-sheet";
import { commands } from "@/content/cheat-sheet";

export const SHELLS: { id: CheatSheetShell; label: string }[] = [
  { id: "linux", label: "Linux" },
  { id: "powershell", label: "PowerShell" },
  { id: "zsh", label: "Zsh" },
];

export function getAllCommands(): CheatSheetCommand[] {
  return commands;
}

export function getCommandsByShell(shell: CheatSheetShell): CheatSheetCommand[] {
  return commands.filter((entry) => entry.shell === shell);
}

function normalize(value: string): string {
  return value.toLowerCase();
}

export function searchCommands(
  allCommands: CheatSheetCommand[],
  query: string,
): CheatSheetCommand[] {
  const needle = normalize(query.trim());
  if (needle === "") return allCommands;

  return allCommands.filter((entry) => {
    const haystack = normalize([entry.command, entry.category, entry.description].join(" "));
    return haystack.includes(needle);
  });
}

export interface CheatSheetCategoryGroup {
  category: string;
  commands: CheatSheetCommand[];
}

export function groupByCategory(list: CheatSheetCommand[]): CheatSheetCategoryGroup[] {
  const order: string[] = [];
  const byCategory = new Map<string, CheatSheetCommand[]>();

  for (const entry of list) {
    if (!byCategory.has(entry.category)) {
      byCategory.set(entry.category, []);
      order.push(entry.category);
    }
    byCategory.get(entry.category)!.push(entry);
  }

  return order.map((category) => ({ category, commands: byCategory.get(category)! }));
}
