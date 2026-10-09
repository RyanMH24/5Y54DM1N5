"use client";

import { useState } from "react";
import { getCommandsByShell, groupByCategory, searchCommands } from "@/lib/cheat-sheet/load";
import { CheatSheetTabs } from "@/components/CheatSheetTabs";
import { CheatSheetSearch } from "@/components/CheatSheetSearch";
import { CheatSheetList } from "@/components/CheatSheetList";
import type { CheatSheetShell } from "@/types/cheat-sheet";

export default function CheatSheetPage() {
  const [shell, setShell] = useState<CheatSheetShell>("linux");
  const [query, setQuery] = useState("");

  const groups = groupByCategory(searchCommands(getCommandsByShell(shell), query));

  return (
    <main className="game-sky min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
          Command Cheat Sheet
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Quick reference for the commands, cmdlets, and tools you&apos;ll reach for most.
        </p>
        <CheatSheetTabs value={shell} onChange={setShell} />
        <CheatSheetSearch value={query} onChange={setQuery} />
        <CheatSheetList groups={groups} />
      </div>
    </main>
  );
}
