import { Pill, FlaskConical, SprayCan, Droplets, Package } from 'lucide-react'
import { presentationLabels, type Presentation } from '@/types'

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

export function PresentationIcon({ presentation, className = 'w-5 h-5' }: PresentationIconProps) {
  const Icon = iconMap[presentation] || Pill
  const label = presentationLabels[presentation] || 'Medicament'
  return (
    <span title={label}>
      <Icon className={className} />
    </span>
  )
}
