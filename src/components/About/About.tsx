import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { aboutImage } from '../../data/assets'
import './About.css'

const pillars = [
  {
    title: 'Notre histoire',
    text: (
      <>
        Fondée en avril 2022, la <strong>Société Ouest Africaine de Négoce et de Transformation
        Agricole</strong> est née de la volonté de créer un pont entre les richesses agricoles de la
        Côte d'Ivoire et les marchés internationaux. Basée à San Pedro, au cœur du hub portuaire de
        l'Afrique de l'Ouest, SOANTA s'est rapidement positionnée sur l'exportation de cacao, de noix
        de cajou et de café.
      </>
    )
  },
  {
    title: 'Notre mission',
    text: (
      <>
        Valoriser les ressources agricoles ouest-africaines en garantissant une traçabilité complète,
        des pratiques durables et une qualité constante, pour partager l'excellence agricole
        ivoirienne avec le monde entier.
      </>
    )
  },
  {
    title: 'Notre équipe',
    text: (
      <>
        Une équipe passionnée et expérimentée, qui combine expertise locale et vision internationale
        pour bâtir des partenariats durables avec les producteurs, transformateurs et acheteurs du
        monde entier.
      </>
    )
  }
]

export default function About() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="about" className={`about ${isVisible ? 'is-visible' : ''}`} ref={ref}>
      <div className="container about__grid">
        <figure className="about__figure reveal">
          <img
            src={aboutImage}
            alt="Noix de cajou en séchage sur des nattes tressées en Côte d'Ivoire"
            className="about__image"
            loading="lazy"
            width={1410}
            height={960}
          />
          <figcaption className="about__caption">
            Séchage de noix de cajou — région de San Pedro
          </figcaption>
        </figure>

        <div className="about__content">
          <p className="eyebrow reveal">À propos de SOANTA</p>
          <h2 className="about__title reveal" style={{ '--delay': '80ms' } as React.CSSProperties}>
            Une maison ivoirienne, tournée vers le monde.
          </h2>
          <blockquote className="about__quote reveal" style={{ '--delay': '160ms' } as React.CSSProperties}>
            « Racines d'Afrique, saveurs du monde » — notre signature résume notre ambition :
            faire rayonner le meilleur de l'agriculture ivoirienne.
          </blockquote>

          <div className="about__pillars">
            {pillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="about__pillar reveal"
                style={{ '--delay': `${220 + index * 80}ms` } as React.CSSProperties}
              >
                <h3 className="about__pillar-title">{pillar.title}</h3>
                <p className="about__pillar-text">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
