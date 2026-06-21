interface BrandLogoProps {
  className?: string
}

/**
 * MYO'S compass emblem: a four-point diamond in blue / teal / indigo
 * with a white center, ringed by a purple-to-teal gradient circle.
 */
export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="MYO'S logo"
      className={className}
    >
      <defs>
        <linearGradient id="myos-ring" x1="6" y1="6" x2="42" y2="42">
          <stop offset="0%" stopColor="#7c5cfc" />
          <stop offset="55%" stopColor="#4db6e8" />
          <stop offset="100%" stopColor="#3fc7c0" />
        </linearGradient>
      </defs>

      {/* outer ring */}
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke="url(#myos-ring)"
        strokeWidth="1.75"
      />

      {/* diamond: four triangles meeting at the center */}
      {/* top-left */}
      <path d="M24 8 L11 24 L24 24 Z" fill="#2f5ad0" />
      {/* top-right */}
      <path d="M24 8 L37 24 L24 24 Z" fill="#3fc2c9" />
      {/* bottom-right */}
      <path d="M37 24 L24 40 L24 24 Z" fill="#3f5fe0" />
      {/* bottom-left */}
      <path d="M11 24 L24 40 L24 24 Z" fill="#6a44e0" />

      {/* center node */}
      <circle cx="24" cy="24" r="3.1" fill="#ffffff" />
    </svg>
  )
}
