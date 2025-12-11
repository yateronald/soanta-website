import { useState } from 'react'
import SectionTitle from '../shared/SectionTitle'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { products } from '../../data/products'
import './Products.css'

export default function Products() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({ threshold: 0.1 })

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }

  return (
    <section id="produits" className="products" ref={ref}>
      <div className="products__container">
        <SectionTitle 
          title="Nos Produits Premium" 
          subtitle="Des produits agricoles de qualité exceptionnelle, traçables de la source à l'export"
        />
        
        {/* Desktop Grid */}
        <div className={`products__grid ${isVisible ? 'products__grid--visible' : ''}`}>
          {products.map((product, index) => (
            <article 
              key={product.id} 
              className="products__card"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="products__image-wrapper">
                <img 
                  src={product.image} 
                  alt={`${product.name} - Produit premium de ${product.origin}`}
                  className="products__image"
                  loading="lazy"
                />
                <div className="products__badges">
                  {product.badges.map((badge, i) => (
                    <span key={i} className="products__badge">{badge}</span>
                  ))}
                </div>
              </div>
              <div className="products__content">
                <h3 className="products__name">{product.name}</h3>
                <p className="products__description">{product.description}</p>
                <div className="products__traceability">
                  <span className="products__origin">
                    🇨🇮 Origine: {product.origin} / {product.region}
                  </span>
                  {product.traceability && (
                    <span className="products__trace-badge">✓ Traçabilité garantie</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="products__carousel">
          <article className="products__carousel-item">
            <div className="products__image-wrapper">
              <img 
                src={products[activeIndex].image} 
                alt={`${products[activeIndex].name} - Produit premium de ${products[activeIndex].origin}`}
                className="products__image"
              />
              <div className="products__badges">
                {products[activeIndex].badges.map((badge, i) => (
                  <span key={i} className="products__badge">{badge}</span>
                ))}
              </div>
            </div>
            <div className="products__content">
              <h3 className="products__name">{products[activeIndex].name}</h3>
              <p className="products__description">{products[activeIndex].description}</p>
              <div className="products__traceability">
                <span className="products__origin">
                  🇨🇮 Origine: {products[activeIndex].origin} / {products[activeIndex].region}
                </span>
                {products[activeIndex].traceability && (
                  <span className="products__trace-badge">✓ Traçabilité garantie</span>
                )}
              </div>
            </div>
          </article>
          
          <div className="products__carousel-nav">
            <button 
              className="products__carousel-btn" 
              onClick={handlePrev}
              aria-label="Produit précédent"
            >
              ‹
            </button>
            <div className="products__carousel-dots">
              {products.map((_, index) => (
                <button
                  key={index}
                  className={`products__carousel-dot ${index === activeIndex ? 'products__carousel-dot--active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Voir ${products[index].name}`}
                />
              ))}
            </div>
            <button 
              className="products__carousel-btn" 
              onClick={handleNext}
              aria-label="Produit suivant"
            >
              ›
            </button>
          </div>
          <p className="products__carousel-counter">
            {activeIndex + 1} / {products.length}
          </p>
        </div>
      </div>
    </section>
  )
}
