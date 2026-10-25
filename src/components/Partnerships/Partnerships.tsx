import { ArrowUpRight } from 'lucide-react'
import SectionTitle from '../shared/SectionTitle'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { partnerships, partners, keyAdvantages } from '../../data/partnerships'
import './Partnerships.css'

function displayDomain(url: string) {
  return new URL(url).hostname.replace(/^www\./, '')
}

export default function Partnerships() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="partenariats" className={`partnerships ${isVisible ? 'is-visible' : ''}`} ref={ref}>
      <div className="container">
        <SectionTitle
          light
          eyebrow="Partenariats"
          title="Construisons ensemble les filières agricoles de demain."
          subtitle="Investisseurs, importateurs, transformateurs ou logisticiens : nous structurons avec chaque partenaire une collaboration durable et transparente."
        />

        <div className="partnerships__grid">
          {partnerships.map((partnership, index) => (
            <article
              key={partnership.id}
              className="partnerships__item reveal"
              style={{ '--delay': `${index * 90}ms` } as React.CSSProperties}
            >
              <span className="partnerships__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="partnerships__title">{partnership.title}</h3>
              <p className="partnerships__description">{partnership.description}</p>
            </article>
          ))}
        </div>

        <ul className="partnerships__advantages reveal" aria-label="Nos atouts">
          {keyAdvantages.map((advantage) => (
            <li key={advantage}>{advantage}</li>
          ))}
        </ul>

        {partners.length > 0 && (
          <div className="partners reveal">
            <div className="partners__intro">
              <p className="eyebrow eyebrow--light">Ils nous font confiance</p>
              <h3 className="partners__title">Nos partenaires</h3>
            </div>
            <ul className="partners__list">
              {partners.map((partner) => (
                <li key={partner.id}>
                  <a
                    href={partner.url}
                    className="partners__link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${partner.name} — visiter le site (nouvel onglet)`}
                  >
                    <img
                      src={partner.logo}
                      alt={`Logo ${partner.name}`}
                      className="partners__logo"
                      loading="lazy"
                    />
                    <span className="partners__domain">
                      {displayDomain(partner.url)}
                      <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
