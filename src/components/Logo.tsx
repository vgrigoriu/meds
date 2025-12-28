interface LogoProps {
  size?: 'sm' | 'lg'
  className?: string
}

export function Logo({ size = 'sm', className = '' }: LogoProps) {
  const dimensions = size === 'lg' ? 'w-24 h-24' : 'w-8 h-8'

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${dimensions} ${className}`}
    >
      <defs>
        {/* Gradient for pill depth */}
        <linearGradient id="pillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white"/>
          <stop offset="100%" stopColor="#e2e8f0"/>
        </linearGradient>
        {/* Highlight gradient */}
        <linearGradient id="highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Teal background circle */}
      <circle cx="32" cy="32" r="30" className="fill-teal-500"/>
      {/* Pill shadow */}
      <circle cx="33" cy="34" r="18" className="fill-teal-700/50"/>
      {/* White round pill with gradient */}
      <circle cx="32" cy="32" r="18" fill="url(#pillGradient)"/>
      {/* Top highlight */}
      <ellipse cx="32" cy="26" rx="12" ry="6" fill="url(#highlight)"/>
      {/* Carved M - shadow on top-left (inside the groove) */}
      <path
        d="M24 40 L24 26 L32 34 L40 26 L40 40"
        fill="none"
        className="stroke-slate-400"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(-0.5, -0.5)"
      />
      {/* Carved M - highlight on bottom-right (light catching bottom edge) */}
      <path
        d="M24 40 L24 26 L32 34 L40 26 L40 40"
        fill="none"
        className="stroke-white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0.5, 0.5)"
      />
    </svg>
  )
}
