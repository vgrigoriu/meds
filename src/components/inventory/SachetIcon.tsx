interface SachetIconProps {
  className?: string
}

export function SachetIcon({ className = 'w-5 h-5' }: SachetIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 5.5 8.2 4h7.6L17 5.5" />
      <path d="M7 18.5 8.2 20h7.6l1.2-1.5" />
      <path d="M8 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M8.8 8.5h6.4" />
      <path d="M9.5 12h5" />
      <path d="M10 15.5h4" />
    </svg>
  )
}
