"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAllProgress } from "@/lib/curriculum-sequencing/reset";

export default function DemoResetPage() {
  const router = useRouter();

  useEffect(() => {
    clearAllProgress();
    router.replace("/");
  }, [router]);

  return (
    <main className="game-sky flex min-h-screen items-center justify-center px-4 text-center">
      <p className="text-sm text-[var(--text-muted)]">Resetting demo progress…</p>
    </main>
  );
}
