import type { TerminalLab } from "@/types/terminal-lab";

export const linuxCliBasicsLab: TerminalLab = {
  id: "linux-cli-basics-lab",
  title: "Linux CLI Basics",
  steps: [
    {
      id: "pwd",
      instructions: "Print your current working directory.",
      matches: [{ pattern: "pwd", output: "/home/learner/projects" }],
      fallbackOutput: "command not found — try `pwd`",
    },
    {
      id: "ls",
      instructions: "List the files in the current directory.",
      matches: [
        { pattern: "ls", output: "notes.txt  scripts/" },
        { pattern: /^ls\s+-la$/i, output: "drwxr-xr-x  notes.txt  scripts/" },
      ],
      fallbackOutput: "command not found — try `ls`",
    },
    {
      id: "cat",
      instructions: "Print the contents of notes.txt.",
      matches: [
        {
          pattern: "cat notes.txt",
          output: "TODO: review pull requests\nTODO: rotate API keys",
        },
      ],
      fallbackOutput: "command not found — try `cat notes.txt`",
    },
    {
      id: "cp",
      instructions: "Make a backup copy of notes.txt called backup.txt.",
      matches: [
        { pattern: "cp notes.txt backup.txt", output: "Copied notes.txt to backup.txt" },
      ],
      fallbackOutput: "command not found — try `cp notes.txt backup.txt`",
    },
  ],
};
