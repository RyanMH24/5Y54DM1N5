import type { TerminalLab } from "@/types/terminal-lab";
import { labs } from "@/content/labs";

export function getLabById(id: string): TerminalLab | null {
  return labs[id] ?? null;
}
