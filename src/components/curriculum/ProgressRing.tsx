const RADIUS = 15.5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRing({
  value,
  max,
  size = 36,
  strokeWidth = 3.5,
  tone = "primary",
  className,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  tone?: "primary" | "success";
  className?: string;
}) {
  const fraction = max > 0 ? value / max : 0;
  const offset = CIRCUMFERENCE * (1 - fraction);
  const toneClass =
    tone === "success" ? "text-[var(--node-done-face)]" : "text-[var(--node-active-face)]";

  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="18"
        cy="18"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-[var(--border)]"
      />
      <circle
        cx="18"
        cy="18"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 18 18)"
        className={`${toneClass} transition-[stroke-dashoffset] duration-500 ease-out`}
      />
    </svg>
  );
}
