import type { CurriculumActivityStatus } from "@/types/curriculum-sequencing";

export function StatusIcon({
  status,
  bare = false,
  className,
}: {
  status: CurriculumActivityStatus;
  bare?: boolean;
  className?: string;
}) {
  if (status === "completed") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
        {!bare && <circle cx="8" cy="8" r="7" className="fill-current opacity-15" />}
        <path
          d="M5 8.2 7.1 10.3 11.2 5.8"
          stroke="currentColor"
          strokeWidth={bare ? "2" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  if (status === "available") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
        {!bare && <circle cx="8" cy="8" r="7" className="fill-current opacity-15" />}
        <path d="M6 4.3 11.5 8 6 11.7Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      {!bare && <rect x="3.5" y="7" width="9" height="6" rx="1.3" className="fill-current opacity-15" />}
      {bare && <rect x="3.5" y="7" width="9" height="6" rx="1.3" fill="currentColor" />}
      <path
        d="M5.5 7V5.3a2.5 2.5 0 0 1 5 0V7"
        stroke="currentColor"
        strokeWidth={bare ? "1.6" : "1.4"}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
