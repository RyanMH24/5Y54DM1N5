import Link from "next/link";
import { Sparkle } from "./Sparkle";

interface ChallengeCompleteBannerProps {
  message: string;
  className?: string;
  onRestart?: () => void;
}

export function ChallengeCompleteBanner({ message, className, onRestart }: ChallengeCompleteBannerProps) {
  return (
    <div
      role="status"
      style={{ boxShadow: "0 0 20px 2px var(--node-done-glow)" }}
      className={`animate-complete-pop flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--node-done-face)]/15 px-4 py-3 text-sm font-semibold text-[var(--node-done-face)] ${className ?? ""}`}
    >
      <span className="flex items-center gap-2">
        <Sparkle className="h-4 w-4" />
        {message}
      </span>
      <span className="flex items-center gap-2">
        {onRestart && (
          <button type="button" onClick={onRestart} className="btn-game btn-game-muted">
            Restart
          </button>
        )}
        <Link href="/" className="btn-game btn-game-success">
          Next
        </Link>
      </span>
    </div>
  );
}
