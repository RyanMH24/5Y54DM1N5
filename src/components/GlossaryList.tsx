import Link from "next/link";
import type { GlossaryTerm } from "@/types/glossary";

interface GlossaryListProps {
  terms: GlossaryTerm[];
}

export function GlossaryList({ terms }: GlossaryListProps) {
  if (terms.length === 0) {
    return (
      <p className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-muted)]">
        No terms match your search.
      </p>
    );
  }

  return (
    <ul className="mt-5 space-y-2.5">
      {terms.map((term) => (
        <li
          key={term.id}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-colors duration-150 hover:bg-[var(--bg)]"
        >
          <Link
            href={`/glossary/${term.id}`}
            className="cursor-pointer text-sm font-bold text-[var(--node-active-side)] hover:underline"
          >
            {term.term}
            {term.acronymFor && <> ({term.acronymFor})</>}
          </Link>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{term.definition}</p>
        </li>
      ))}
    </ul>
  );
}
