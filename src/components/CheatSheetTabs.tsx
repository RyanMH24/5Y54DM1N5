"use client";

import { SHELLS } from "@/lib/cheat-sheet/load";
import type { CheatSheetShell } from "@/types/cheat-sheet";

interface CheatSheetTabsProps {
  value: CheatSheetShell;
  onChange: (shell: CheatSheetShell) => void;
}

export function CheatSheetTabs({ value, onChange }: CheatSheetTabsProps) {
  return (
    <div role="tablist" aria-label="Shell" className="mt-5 flex gap-2">
      {SHELLS.map((shell) => (
        <button
          key={shell.id}
          type="button"
          role="tab"
          aria-selected={shell.id === value}
          onClick={() => onChange(shell.id)}
          className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-bold transition-colors duration-150 ${
            shell.id === value
              ? "bg-[var(--node-active-face)] text-[var(--node-active-icon)]"
              : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          {shell.label}
        </button>
      ))}
    </div>
  );
}
