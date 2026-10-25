import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import useScrollTo from '../../hooks/useScrollTo'
import './Header.css'

const navItems = [
  { id: 'services', label: 'Activités' },
  { id: 'produits', label: 'Filières' },
  { id: 'partenariats', label: 'Partenariats' },
  { id: 'about', label: 'À propos' },
  { id: 'contact', label: 'Contact' }
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { scrollTo, scrollToTop } = useScrollTo({
    onScrollComplete: () => setIsMobileMenuOpen(false)
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header
      className={`header ${isScrolled ? 'header--scrolled' : ''} ${isMobileMenuOpen ? 'header--menu-open' : ''}`}
    >
      <div className="header__container container">
        <a
          href="#accueil"
          className="header__logo"
          onClick={(e) => {
            e.preventDefault()
            scrollToTop()
          }}
          aria-label="SOANTA - Retour à l'accueil"
        >
          <img
            src="/images/logo-light.png"
            alt="SOANTA - Société Ouest Africaine de Négoce et de Transformation Agricole"
            className="header__logo-img"
            width={673}
            height={192}
          />
        </a>

        <nav
          id="main-nav"
          className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}
          aria-label="Navigation principale"
        >
          <ul className="header__nav-list">
            {navItems.map((item) => (
              <li key={item.id} className="header__nav-item">
                <a
                  href={`#${item.id}`}
                  className="header__nav-link"
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
          <a
            href="#contact"
            className="header__cta"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('contact')
            }}
          >
            Devenir partenaire
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </a>
        </nav>

        <button
          className={`header__mobile-toggle ${isMobileMenuOpen ? 'header__mobile-toggle--open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-nav"
        >
          <span className="header__mobile-toggle-bar"></span>
          <span className="header__mobile-toggle-bar"></span>
        </button>
      </div>
    </header>
  )
}
