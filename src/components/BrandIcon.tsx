// Brand mark for "Método Alimentación Bíblica":
// — Wheat stalk + olive branch over a bowl. Biblical food symbols (bread & olive),
// representing the app's promise: nourishment rooted in the Scriptures.
// Uses the app's palette (olive → gold gradient).

export function BrandIcon({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`bg-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6B8E23" />
          <stop offset="100%" stopColor="#D4A373" />
        </linearGradient>
        <linearGradient id={`leaf-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#EFE7DD" />
        </linearGradient>
      </defs>
      <rect width="192" height="192" rx="42" fill={`url(#bg-${size})`} />

      {/* Bowl */}
      <path d="M52 118 Q96 158 140 118 L138 110 L54 110 Z" fill="#8B5E3C" opacity="0.85" />
      <ellipse cx="96" cy="110" rx="44" ry="6" fill="#FFFDF8" opacity="0.5" />

      {/* Wheat stalk */}
      <g transform="translate(70 95) rotate(-22)" fill={`url(#leaf-${size})`}>
        <ellipse cx="0" cy="-30" rx="3.5" ry="7" />
        <ellipse cx="-5" cy="-22" rx="3.5" ry="7" />
        <ellipse cx="5" cy="-22" rx="3.5" ry="7" />
        <ellipse cx="-5" cy="-14" rx="3.5" ry="7" />
        <ellipse cx="5" cy="-14" rx="3.5" ry="7" />
        <rect x="-0.6" y="-8" width="1.2" height="14" fill="#FFFDF8" />
      </g>

      {/* Olive branch */}
      <g transform="translate(116 60)" fill={`url(#leaf-${size})`}>
        <path
          d="M0 0 Q-6 18 -8 38"
          stroke="#FFFDF8"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="-12" cy="6" rx="5" ry="10" transform="rotate(-30 -12 6)" />
        <ellipse cx="5" cy="10" rx="5" ry="10" transform="rotate(40 5 10)" />
        <ellipse cx="-15" cy="22" rx="5" ry="10" transform="rotate(-50 -15 22)" />
        <ellipse cx="3" cy="26" rx="5" ry="10" transform="rotate(60 3 26)" />
        <circle cx="-8" cy="14" r="2.5" fill="#6B8E23" />
        <circle cx="-2" cy="20" r="2.5" fill="#6B8E23" />
      </g>
    </svg>
  );
}
