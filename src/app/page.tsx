import { CurriculumPath } from "@/components/CurriculumPath";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-6 text-center">
        <h1 className="text-glow animate-text-flicker text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
          Sysadmin Academy
        </h1>
        <p className="animate-fade-in-up-delayed mx-auto mt-2 max-w-prose text-[var(--text-muted)]">
          Follow this six-week path from core concepts through hands-on administration.
        </p>
      </header>
      <CurriculumPath />
    </main>
  );
}
