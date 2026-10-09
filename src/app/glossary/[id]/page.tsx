import { notFound } from "next/navigation";
import { getAllTerms, getTermById } from "@/lib/glossary/load";

interface GlossaryTermPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllTerms().map((term) => ({ id: term.id }));
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const { id } = await params;
  const term = getTermById(id);

  if (!term) {
    notFound();
  }

  return (
    <main className="game-sky min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
          {term.term}
          {term.acronymFor && (
            <span className="ml-2 text-lg font-medium text-[var(--text-muted)]">
              ({term.acronymFor})
            </span>
          )}
        </h1>
        <p className="mt-3 leading-relaxed text-[var(--text)]">{term.definition}</p>
      </div>
    </main>
  );
}
