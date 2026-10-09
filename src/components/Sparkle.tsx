export function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`animate-sparkle text-[#fbbf24] drop-shadow ${className ?? "h-5 w-5"}`}
    >
      <path
        d="M12 2 13.8 9.2 21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-1.8L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
