import Button from '../shared/Button'
import useScrollTo from '../../hooks/useScrollTo'
import './Hero.css'

export default function Hero() {
  const { scrollTo } = useScrollTo()

  const handleCTAClick = () => {
    scrollTo('contact')
  }

  return (
    <section id="accueil" className="hero">
      <div className="hero__overlay"></div>
      <div className="hero__content">
        <img 
          src="/images/logo.png" 
          alt="Logo SOANTA - Société Ouest Africaine de Négoce et de Transformation Agricole" 
          className="hero__logo"
        />
        <h1 className="hero__title">
          Racines d'Afrique, saveurs du monde
        </h1>
        <p className="hero__subtitle">
          Valorisation des ressources agricoles ouest-africaines
        </p>
        <Button 
          variant="primary" 
          size="large"
          onClick={handleCTAClick}
          aria-label="Devenir partenaire - Contactez-nous"
        >
          Devenir Partenaire
        </Button>
      </div>
      <div className="hero__scroll-indicator" aria-hidden="true">
        <span className="hero__scroll-arrow"></span>
      </div>
    </section>
  )
}
