import './SectionTitle.css'

interface SectionTitleProps {
  title: string
  eyebrow?: string
  subtitle?: string
  centered?: boolean
  light?: boolean
}

export default function SectionTitle({
  title,
  eyebrow,
  subtitle,
  centered = false,
  light = false
}: SectionTitleProps) {
  return (
    <header className={`section-title ${centered ? 'section-title--centered' : ''} ${light ? 'section-title--light' : ''}`}>
      <div className="section-title__main reveal">
        {eyebrow && <p className={`eyebrow ${light ? 'eyebrow--light' : ''}`}>{eyebrow}</p>}
        <h2 className="section-title__heading">{title}</h2>
      </div>
      {subtitle && (
        <p className="section-title__subtitle reveal" style={{ '--delay': '120ms' } as React.CSSProperties}>
          {subtitle}
        </p>
      )}
    </header>
  )
}
