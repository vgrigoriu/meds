import { Pill, Wine, SprayCan, Droplets, Bandage } from 'lucide-react'
import type { Presentation } from '../types'

interface PresentationIconProps {
  presentation: Presentation
  className?: string
}

const iconMap: Record<Presentation, React.ComponentType<{ className?: string }>> = {
  pill: Pill,
  syrup: Wine,
  'nasal-spray': SprayCan,
  cream: Droplets,
  drops: Droplets,
  bandage: Bandage,
}

export function PresentationIcon({ presentation, className = 'w-5 h-5' }: PresentationIconProps) {
  const Icon = iconMap[presentation] || Pill
  return <Icon className={className} />
}
