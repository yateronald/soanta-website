import type { ReactNode } from 'react'
import './Card.css'

interface CardProps {
  children: ReactNode
  title?: string
  icon?: string
  expandable?: boolean
  isExpanded?: boolean
  expandedContent?: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({
  children,
  title,
  icon,
  expandable = false,
  isExpanded = false,
  expandedContent,
  className = '',
  onClick
}: CardProps) {

  const handleClick = () => {
    onClick?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <article
      className={`card ${isExpanded ? 'card--expanded' : ''} ${expandable ? 'card--expandable' : ''} ${className}`}
      onClick={expandable ? handleClick : undefined}
      onKeyDown={expandable ? handleKeyDown : undefined}
      tabIndex={expandable ? 0 : undefined}
      role={expandable ? 'button' : undefined}
      aria-expanded={expandable ? isExpanded : undefined}
    >
      {icon && <span className="card__icon" aria-hidden="true">{icon}</span>}
      {title && <h3 className="card__title">{title}</h3>}
      <div className="card__content">
        {children}
      </div>
      {expandable && (
        <div className="card__expand-indicator">
          <span className={`card__expand-icon ${isExpanded ? 'card__expand-icon--rotated' : ''}`}>
            ▼
          </span>
          <span className="card__expand-text">
            {isExpanded ? 'Réduire' : 'En savoir plus'}
          </span>
        </div>
      )}
      {expandable && expandedContent && isExpanded && (
        <div className="card__expanded-content">
          {expandedContent}
        </div>
      )}
    </article>
  )
}
