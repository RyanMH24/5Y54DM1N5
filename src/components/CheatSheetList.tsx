import type { CheatSheetCategoryGroup } from "@/lib/cheat-sheet/load";

interface CheatSheetListProps {
  groups: CheatSheetCategoryGroup[];
}

export function CheatSheetList({ groups }: CheatSheetListProps) {
  if (groups.length === 0) {
    return (
      <p className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-muted)]">
        No commands match your search.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-8">
      {groups.map((group) => (
        <section key={group.category}>
          <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
            {group.category}
          </h2>
          <ul className="mt-3 space-y-2.5">
            {group.commands.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
              >
                <code className="rounded-md bg-[var(--bg)] px-1.5 py-0.5 font-mono text-sm font-bold text-[var(--node-active-side)]">
                  {entry.command}
                </code>
                <p className="mt-1.5 text-sm text-[var(--text-muted)]">{entry.description}</p>
                {entry.example && (
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-[var(--terminal-bg)] p-3 font-mono text-xs text-[var(--terminal-text)]">
                    {entry.example}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
