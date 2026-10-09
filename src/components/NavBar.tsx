import Link from "next/link";
import { Logo } from "./Logo";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="cursor-pointer">
          <Logo />
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-[var(--text-muted)]">
          <Link href="/cheat-sheet" className="cursor-pointer hover:text-[var(--text)]">
            Cheat Sheet
          </Link>
          <Link href="/glossary" className="cursor-pointer hover:text-[var(--text)]">
            Glossary
          </Link>
        </nav>
      </div>
    </header>
  );
}
