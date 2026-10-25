import SectionTitle from '../shared/SectionTitle'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { services } from '../../data/services'
import './Services.css'

export default function Services() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="services" className={`services ${isVisible ? 'is-visible' : ''}`} ref={ref}>
      <div className="container">
        <SectionTitle
          eyebrow="Nos activités"
          title="Du champ au conteneur, une chaîne de valeur maîtrisée."
          subtitle="Cinq métiers complémentaires pour valoriser les ressources agricoles ouest-africaines, de l'accompagnement des producteurs jusqu'aux marchés internationaux."
        />

        <ol className="services__list">
          {services.map((service, index) => (
            <li
              key={service.id}
              className="services__item reveal"
              style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}
            >
              <span className="services__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="services__heading">
                <h3 className="services__title">{service.title}</h3>
                <p className="services__tagline">{service.shortDescription}</p>
              </div>
              <p className="services__description">{service.detailedDescription}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
