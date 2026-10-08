import type { TerminalLab } from "@/types/terminal-lab";
import { sampleLab } from "./sample-lab";

export const labs: Record<string, TerminalLab> = {
  [sampleLab.id]: sampleLab,
};
