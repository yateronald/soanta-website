import SectionTitle from '../shared/SectionTitle'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import './About.css'

export default function About() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="about" className="about" ref={ref}>
      <div className="about__container">
        <SectionTitle 
          title="À Propos de SOANTA" 
          subtitle="Notre mission : valoriser les ressources agricoles ouest-africaines"
        />
        
        <div className={`about__content ${isVisible ? 'about__content--visible' : ''}`}>
          <div className="about__text">
            <div className="about__section">
              <h3 className="about__subtitle">Notre Histoire</h3>
              <p>
                Fondée en avril 2022, la <strong>Société Ouest Africaine de Négoce et de Transformation Agricole (SOANTA)</strong> est née de la volonté de créer un pont entre les richesses agricoles de la Côte d'Ivoire et les marchés internationaux.
              </p>
              <p>
                Basée à San Pedro, au cœur du hub portuaire de l'Afrique de l'Ouest, SOANTA s'est rapidement positionnée comme un acteur clé dans l'exportation de produits agricoles premium : cacao, noix de cajou et café.
              </p>
            </div>
            
            <div className="about__section">
              <h3 className="about__subtitle">Notre Mission</h3>
              <p>
                Nous nous engageons à valoriser les ressources agricoles ouest-africaines en garantissant une traçabilité complète, des pratiques durables et une qualité premium. Notre slogan <em>"Racines d'Afrique, saveurs du monde"</em> reflète notre ambition de partager l'excellence agricole ivoirienne avec le monde entier.
              </p>
            </div>
            
            <div className="about__section">
              <h3 className="about__subtitle">Notre Équipe</h3>
              <p>
                Dirigée par une équipe passionnée et expérimentée, SOANTA combine expertise locale et vision internationale pour développer des partenariats durables avec les producteurs, transformateurs et acheteurs du monde entier.
              </p>
            </div>
          </div>
          

        </div>
      </div>
    </section>
  )
}
