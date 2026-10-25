import { ArrowRight, ArrowDown } from 'lucide-react'
import Button from '../shared/Button'
import useScrollTo from '../../hooks/useScrollTo'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import './Hero.css'

const facts = [
  { value: '2022', label: 'Année de création' },
  { value: 'San Pedro', label: 'Hub portuaire d\'export' },
  { value: '3', label: 'Filières : cacao, cajou, café' },
  { value: '100 %', label: 'Des lots traçables' }
]

export default function Hero() {
  const { scrollTo } = useScrollTo()
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({ threshold: 0 })

  return (
    <section id="accueil" className={`hero ${isVisible ? 'is-visible' : ''}`} ref={ref}>
      <img
        src="/images/hero-cacao.webp"
        alt=""
        className="hero__media"
        fetchPriority="high"
      />
      <div className="hero__shade" aria-hidden="true"></div>

      <div className="hero__inner container">
        <div className="hero__content">
          <p className="eyebrow eyebrow--light reveal">
            Négoce &amp; transformation agricole — Côte d'Ivoire
          </p>
          <h1 className="hero__title reveal" style={{ '--delay': '80ms' } as React.CSSProperties}>
            Racines d'Afrique,
            <br />
            <em>saveurs du monde.</em>
          </h1>
          <p className="hero__lead reveal" style={{ '--delay': '160ms' } as React.CSSProperties}>
            Depuis San Pedro, SOANTA source, transforme et exporte le cacao, la noix de cajou
            et le café ivoiriens — avec une traçabilité de la source jusqu'à l'export.
          </p>
          <div className="hero__actions reveal" style={{ '--delay': '240ms' } as React.CSSProperties}>
            <Button
              variant="primary"
              size="large"
              onClick={() => scrollTo('contact')}
              aria-label="Devenir partenaire - Contactez-nous"
            >
              Devenir partenaire
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button variant="outline" size="large" onClick={() => scrollTo('produits')}>
              Découvrir nos filières
            </Button>
          </div>
        </div>
      </div>

      <div className="hero__facts">
        <dl className="hero__facts-list container">
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              className="hero__fact reveal"
              style={{ '--delay': `${320 + index * 80}ms` } as React.CSSProperties}
            >
              <dt className="hero__fact-label">{fact.label}</dt>
              <dd className="hero__fact-value">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button
        type="button"
        className="hero__scroll"
        onClick={() => scrollTo('services')}
        aria-label="Faire défiler vers nos activités"
      >
        <ArrowDown size={18} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </section>
  )
}
