"use client";

import { useState } from "react";
import { getAllTerms, searchTerms } from "@/lib/glossary/load";
import { GlossarySearch } from "@/components/GlossarySearch";
import { GlossaryList } from "@/components/GlossaryList";

const allTerms = getAllTerms();

export default function GlossaryPage() {
  const [query, setQuery] = useState("");

  return (
    <main>
      <h1>Glossary</h1>
      <GlossarySearch value={query} onChange={setQuery} />
      <GlossaryList terms={searchTerms(allTerms, query)} />
    </main>
  );
}
