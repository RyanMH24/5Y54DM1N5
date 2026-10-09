"use client";

interface CheatSheetSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CheatSheetSearch({ value, onChange }: CheatSheetSearchProps) {
  return (
    <label className="mt-5 block">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        Search commands
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by command or description..."
        className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition-colors duration-150 focus:border-[var(--node-active-face)]"
      />
    </label>
  );
}
