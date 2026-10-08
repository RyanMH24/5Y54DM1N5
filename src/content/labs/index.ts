import type { TerminalLab } from "@/types/terminal-lab";
import { sampleLab } from "./sample-lab";
import { linuxCliBasicsLab } from "./linux-cli-basics-lab";
import { powershellBasicsLab } from "./powershell-basics-lab";

export const labs: Record<string, TerminalLab> = {
  [sampleLab.id]: sampleLab,
  [linuxCliBasicsLab.id]: linuxCliBasicsLab,
  [powershellBasicsLab.id]: powershellBasicsLab,
};
