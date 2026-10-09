import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: "800" });

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg viewBox="0 0 40 40" aria-hidden="true" className="h-8 w-8 flex-shrink-0">
        <defs>
          <linearGradient id="logo-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--node-active-highlight)" />
            <stop offset="55%" stopColor="var(--node-active-face)" />
            <stop offset="100%" stopColor="var(--node-active-side)" />
          </linearGradient>
        </defs>
        <rect
          x="1.5"
          y="1.5"
          width="37"
          height="37"
          rx="9"
          fill="var(--surface)"
          stroke="url(#logo-face)"
          strokeWidth="2"
        />
        <path
          d="M11 15.5 17 20l-6 4.5M19.5 26h9.5"
          stroke="var(--node-active-face)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ filter: "drop-shadow(0 0 4px var(--node-active-face))" }}
        />
      </svg>
      <span
        className={`${orbitron.className} text-glow animate-text-flicker text-[var(--node-active-face)]`}
        style={{ fontSize: "1.1rem", letterSpacing: "0.04em" }}
      >
        5Y54DM1N5
      </span>
    </span>
  );
}
