import Link from "next/link";
import type { GlossaryTerm } from "@/types/glossary";

interface GlossaryListProps {
  terms: GlossaryTerm[];
}

export function GlossaryList({ terms }: GlossaryListProps) {
  if (terms.length === 0) {
    return <p>No terms match your search.</p>;
  }

  return (
    <ul>
      {terms.map((term) => (
        <li key={term.id}>
          <Link href={`/glossary/${term.id}`}>
            {term.term}
            {term.acronymFor && <> ({term.acronymFor})</>}
          </Link>
          <p>{term.definition}</p>
        </li>
      ))}
    </ul>
  );
}
