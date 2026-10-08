import type { TerminalLab } from "@/types/terminal-lab";

export const powershellBasicsLab: TerminalLab = {
  id: "powershell-basics-lab",
  title: "PowerShell Basics",
  steps: [
    {
      id: "get-process",
      instructions: "List the processes currently running on this machine.",
      matches: [
        {
          pattern: "Get-Process",
          output: "Handles  NPM(K)  WS(K)  CPU(s)  Id  ProcessName\n-------  ------  -----  ------  --  -----------\n    412      22  48920   12.34  7744  explorer",
        },
        {
          pattern: "gps",
          output: "Handles  NPM(K)  WS(K)  CPU(s)  Id  ProcessName\n-------  ------  -----  ------  --  -----------\n    412      22  48920   12.34  7744  explorer",
        },
      ],
      fallbackOutput: "The term is not recognized — try `Get-Process` (or its alias `gps`).",
    },
    {
      id: "get-service",
      instructions: "List Windows services and whether each one is running.",
      matches: [
        {
          pattern: "Get-Service",
          output: "Status   Name               DisplayName\n------   ----               -----------\nRunning  Spooler            Print Spooler\nStopped  Fax                Fax",
        },
        {
          pattern: "gsv",
          output: "Status   Name               DisplayName\n------   ----               -----------\nRunning  Spooler            Print Spooler\nStopped  Fax                Fax",
        },
      ],
      fallbackOutput: "The term is not recognized — try `Get-Service` (or its alias `gsv`).",
    },
    {
      id: "get-childitem",
      instructions: "List the files and folders in the current location.",
      matches: [
        { pattern: "Get-ChildItem", output: "notes.txt  scripts" },
        { pattern: "gci", output: "notes.txt  scripts" },
        { pattern: "dir", output: "notes.txt  scripts" },
      ],
      fallbackOutput: "The term is not recognized — try `Get-ChildItem` (or its alias `dir`).",
    },
    {
      id: "pipeline-filter",
      instructions:
        "Filter the running processes down to only ones using more than 100 CPU seconds: pipe Get-Process into Where-Object { $_.CPU -gt 100 }.",
      matches: [
        {
          pattern: /^\s*(get-process|gps)\s*\|\s*where-object\s*\{\s*\$_\.cpu\s*-gt\s*100\s*\}\s*$/i,
          output: "Handles  NPM(K)  WS(K)  CPU(s)  Id  ProcessName\n-------  ------  -----  ------  --  -----------\n   1820     110  88412  214.02  5120  sqlservr",
        },
      ],
      fallbackOutput:
        "The term is not recognized — try `Get-Process | Where-Object { $_.CPU -gt 100 }` (or `gps | Where-Object { $_.CPU -gt 100 }`).",
    },
  ],
};
