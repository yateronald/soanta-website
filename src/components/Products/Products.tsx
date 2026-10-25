import SectionTitle from '../shared/SectionTitle'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { products } from '../../data/products'
import './Products.css'

export default function Products() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="produits" className={`products ${isVisible ? 'is-visible' : ''}`} ref={ref}>
      <div className="container">
        <SectionTitle
          eyebrow="Nos filières"
          title="Trois produits, une même exigence de qualité à l'origine."
          subtitle="Des produits agricoles sélectionnés en Côte d'Ivoire, traçables de la source à l'export et expédiés depuis le port de San Pedro."
        />

        <div className="products__grid" role="list">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="products__card reveal"
              role="listitem"
              style={{ '--delay': `${index * 120}ms` } as React.CSSProperties}
            >
              <div className="products__media">
                <img
                  src={product.image}
                  alt={`${product.name} de ${product.origin} en séchage`}
                  className="products__image"
                  loading="lazy"
                  width={900}
                  height={650}
                />
                <span className="products__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="products__body">
                <p className="products__latin">{product.botanicalName}</p>
                <h3 className="products__name">{product.name}</h3>
                <p className="products__description">{product.description}</p>
                <dl className="products__meta">
                  <div>
                    <dt>Origine</dt>
                    <dd>{product.origin}</dd>
                  </div>
                  <div>
                    <dt>Départ</dt>
                    <dd>Port de {product.region}</dd>
                  </div>
                  <div>
                    <dt>Engagement</dt>
                    <dd>{product.highlight}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
