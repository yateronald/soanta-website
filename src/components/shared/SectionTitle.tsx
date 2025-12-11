import './SectionTitle.css'

interface SectionTitleProps {
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
}

export default function SectionTitle({
  title,
  subtitle,
  centered = true,
  light = false
}: SectionTitleProps) {
  return (
    <header className={`section-title ${centered ? 'section-title--centered' : ''} ${light ? 'section-title--light' : ''}`}>
      <h2 className="section-title__heading">{title}</h2>
      {subtitle && <p className="section-title__subtitle">{subtitle}</p>}
    </header>
  )
}
