import type { GlossaryTerm } from "@/types/glossary";
import { terms } from "@/content/glossary";

export function getAllTerms(): GlossaryTerm[] {
  return terms;
}

export function getTermById(id: string): GlossaryTerm | null {
  return terms.find((term) => term.id === id) ?? null;
}

function normalize(value: string): string {
  return value.toLowerCase();
}

export function searchTerms(allTerms: GlossaryTerm[], query: string): GlossaryTerm[] {
  const needle = normalize(query.trim());
  if (needle === "") return allTerms;

  return allTerms.filter((term) => {
    const haystack = normalize([term.term, term.acronymFor ?? "", term.definition].join(" "));
    return haystack.includes(needle);
  });
}
