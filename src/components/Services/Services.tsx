import { useState } from 'react'
import SectionTitle from '../shared/SectionTitle'
import Card from '../shared/Card'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { services } from '../../data/services'
import './Services.css'

export default function Services() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({ threshold: 0.1 })

  const handleCardClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section id="services" className="services" ref={ref}>
      <div className="services__container">
        <SectionTitle 
          title="Nos Activités" 
          subtitle="Découvrez nos domaines d'expertise dans la valorisation des ressources agricoles ouest-africaines"
        />
        
        <div className={`services__grid ${isVisible ? 'services__grid--visible' : ''}`}>
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="services__card-wrapper"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card
                title={service.title}
                icon={service.icon}
                expandable={true}
                isExpanded={expandedId === service.id}
                expandedContent={service.detailedDescription}
                onClick={() => handleCardClick(service.id)}
              >
                {service.shortDescription}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
