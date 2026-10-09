export type CheatSheetShell = "linux" | "powershell" | "zsh";

export interface CheatSheetCommand {
  id: string;
  shell: CheatSheetShell;
  category: string;
  command: string;
  description: string;
  example?: string;
}
