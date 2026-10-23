// The site's brand mark: a radar scope (cyan rings + green sweep + blip),
// matching favicon.svg and the og card. Used in the nav and the hero terminal bar.
export function RadarMark({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="21" stroke="#22d3ee" strokeWidth="3" />
      <circle cx="32" cy="32" r="11" stroke="#22d3ee" strokeWidth="1.5" opacity="0.45" />
      <path d="M32 32 L32 12 A20 20 0 0 1 50.6 24.4 Z" fill="#00ff9c" opacity="0.3" />
      <line x1="32" y1="32" x2="50.6" y2="24.4" stroke="#00ff9c" strokeWidth="2.4" />
      <circle cx="45" cy="23" r="3" fill="#00ff9c" />
    </svg>
  );
}
