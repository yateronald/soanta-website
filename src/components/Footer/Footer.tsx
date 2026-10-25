import useScrollTo from '../../hooks/useScrollTo'
import { partners } from '../../data/partnerships'
import './Footer.css'

const navItems = [
  { id: 'services', label: 'Activités' },
  { id: 'produits', label: 'Filières' },
  { id: 'partenariats', label: 'Partenariats' },
  { id: 'about', label: 'À propos' },
  { id: 'contact', label: 'Contact' }
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { scrollTo } = useScrollTo()

  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__main">
          <div className="footer__brand">
            <img
              src="/images/logo-light.png"
              alt="SOANTA - Société Ouest Africaine de Négoce et de Transformation Agricole"
              className="footer__logo"
              width={673}
              height={192}
              loading="lazy"
            />
            <p className="footer__tagline">Racines d'Afrique, saveurs du monde.</p>
            <p className="footer__description">
              Négoce et transformation de cacao, noix de cajou et café depuis San Pedro, Côte d'Ivoire.
            </p>
          </div>

          <nav className="footer__col" aria-label="Navigation du pied de page">
            <h4 className="footer__title">Navigation</h4>
            <ul className="footer__list">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="footer__link"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollTo(item.id)
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h4 className="footer__title">Informations légales</h4>
            <ul className="footer__list">
              <li>RCCM : CISAP2022B375</li>
              <li>Capital : 10 000 000 FCFA</li>
              <li>Siège : San Pedro, Côte d'Ivoire</li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__title">Contact</h4>
            <address className="footer__address">
              Lotissement Corniche, Quartier Balmer
              <br />
              San Pedro, Côte d'Ivoire
              <br />
              26 BP 944 Abidjan 26
            </address>
            {partners.length > 0 && (
              <>
                <h4 className="footer__title footer__title--spaced">Partenaires</h4>
                <ul className="footer__list">
                  {partners.map((partner) => (
                    <li key={partner.id}>
                      {partner.url ? (
                        <a
                          href={partner.url}
                          className="footer__link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {partner.name}
                        </a>
                      ) : (
                        partner.name
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} SOANTA — Société Ouest Africaine de Négoce et de Transformation Agricole. Tous droits réservés.
          </p>
          <p className="footer__conception">Conception : African wind gate</p>
        </div>
      </div>
    </footer>
  )
}
