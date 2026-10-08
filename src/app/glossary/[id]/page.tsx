import { notFound } from "next/navigation";
import { getTermById } from "@/lib/glossary/load";

interface GlossaryTermPageProps {
  params: Promise<{ id: string }>;
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const { id } = await params;
  const term = getTermById(id);

  if (!term) {
    notFound();
  }

  return (
    <main>
      <h1>
        {term.term}
        {term.acronymFor && ` (${term.acronymFor})`}
      </h1>
      <p>{term.definition}</p>
    </main>
  );
}
