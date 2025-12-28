import { Pill, FlaskConical, SprayCan, Droplets, Package } from 'lucide-react'
import type { Presentation } from '@/types'

interface PresentationIconProps {
  presentation: Presentation
  className?: string
}

const iconMap: Record<Presentation, React.ComponentType<{ className?: string }>> = {
  pill: Pill,
  syrup: FlaskConical,
  spray: SprayCan,
  cream: Droplets,
  drops: Droplets,
  other: Package,
}

const labelMap: Record<Presentation, string> = {
  pill: 'Pastilă',
  syrup: 'Sirop',
  spray: 'Spray',
  cream: 'Cremă',
  drops: 'Picături',
  other: 'Altele',
}

export function PresentationIcon({ presentation, className = 'w-5 h-5' }: PresentationIconProps) {
  const Icon = iconMap[presentation] || Pill
  const label = labelMap[presentation] || 'Medicament'
  return (
    <span title={label}>
      <Icon className={className} />
    </span>
  )
}
