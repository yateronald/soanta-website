import { useState, useEffect } from 'react'
import useScrollTo from '../../hooks/useScrollTo'
import './Header.css'

const navItems = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'services', label: 'Services' },
  { id: 'produits', label: 'Produits' },
  { id: 'partenariats', label: 'Partenariats' },
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
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (id: string) => {
    if (id === 'accueil') {
      scrollToTop()
    } else {
      scrollTo(id)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
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
            src="/images/logo.png" 
            alt="Logo SOANTA - Société Ouest Africaine de Négoce et de Transformation Agricole" 
            className="header__logo-img"
          />
        </a>

        <button
          className={`header__mobile-toggle ${isMobileMenuOpen ? 'header__mobile-toggle--open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="header__mobile-toggle-bar"></span>
          <span className="header__mobile-toggle-bar"></span>
          <span className="header__mobile-toggle-bar"></span>
        </button>

        <nav 
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
                    handleNavClick(item.id)
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
