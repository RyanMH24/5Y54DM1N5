"use client";

import { useState } from "react";
import { getAllTerms, searchTerms } from "@/lib/glossary/load";
import { GlossarySearch } from "@/components/GlossarySearch";
import { GlossaryList } from "@/components/GlossaryList";

const allTerms = getAllTerms();

export default function GlossaryPage() {
  const [query, setQuery] = useState("");

  return (
    <main className="game-sky min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
          Glossary
        </h1>
        <GlossarySearch value={query} onChange={setQuery} />
        <GlossaryList terms={searchTerms(allTerms, query)} />
      </div>
    </main>
  );
}
