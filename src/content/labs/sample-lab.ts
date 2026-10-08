import type { TerminalLab } from "@/types/terminal-lab";

export const sampleLab: TerminalLab = {
  id: "sample-lab",
  title: "Explore the Filesystem",
  steps: [
    {
      id: "list-files",
      instructions: "List the files in the current directory.",
      matches: [
        { pattern: "ls", output: "notes.txt  scripts/  logs/" },
        { pattern: /^ls\s+-la$/i, output: "drwxr-xr-x  notes.txt  scripts/  logs/" },
      ],
      fallbackOutput: "command not found — try `ls`",
    },
    {
      id: "print-working-directory",
      instructions: "Print the current working directory.",
      matches: [{ pattern: "pwd", output: "/home/learner" }],
      fallbackOutput: "command not found — try `pwd`",
    },
    {
      id: "whoami",
      instructions: "Print the current user.",
      matches: [{ pattern: "whoami", output: "learner" }],
      fallbackOutput: "command not found — try `whoami`",
    },
  ],
};
