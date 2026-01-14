import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__main">
          <div className="footer__brand">
            <img 
              src="/images/logo.png" 
              alt="Logo SOANTA - Société Ouest Africaine de Négoce et de Transformation Agricole" 
              className="footer__logo"
            />
            <p className="footer__tagline">
              Racines d'Afrique, saveurs du monde
            </p>
            <p className="footer__description">
              Valorisation des ressources agricoles ouest-africaines
            </p>
          </div>

          <div className="footer__info">
            <h4 className="footer__title">Informations Légales</h4>
            <ul className="footer__list">
              <li>
                <strong>RCCM:</strong> CISAP2022B375
              </li>
              <li>
                <strong>Capital:</strong> 10 000 000 FCFA
              </li>
              <li>
                <strong>Siège:</strong> San Pedro, Côte d'Ivoire
              </li>
            </ul>
          </div>

          <div className="footer__contact">
            <h4 className="footer__title">Contact</h4>
            <address className="footer__address">
              <p>
                <span aria-hidden="true">📍</span> Lotissement Corniche, Quartier Balmer
              </p>
              <p>San Pedro, Côte d'Ivoire</p>
              <p>
                <span aria-hidden="true">📮</span> 26 BP 944 Abidjan 26
              </p>
            </address>
          </div>

          <div className="footer__map">
            <h4 className="footer__title">Localisation</h4>
            <div className="footer__map-container">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-6.65%2C4.72%2C-6.60%2C4.77&layer=mapnik&marker=4.7485%2C-6.6363"
                width="100%"
                height="150"
                style={{ border: 0, borderRadius: 'var(--radius-md)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation SOANTA à San Pedro, Côte d'Ivoire"
              />
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} SOANTA - Société Ouest Africaine de Négoce et de Transformation Agricole. Tous droits réservés.
          </p>
          <p className="footer__conception">
            Conception : African wind gate
          </p>
        </div>
      </div>
    </footer>
  )
}
