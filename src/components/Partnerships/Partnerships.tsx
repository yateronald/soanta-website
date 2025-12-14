import SectionTitle from '../shared/SectionTitle'
import Card from '../shared/Card'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { partnerships } from '../../data/partnerships'
import './Partnerships.css'

export default function Partnerships() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="partenariats" className="partnerships" ref={ref}>
      <div className="partnerships__container">
        <SectionTitle 
          title="Opportunités de Partenariat" 
          subtitle="Rejoignez-nous pour développer ensemble le potentiel agricole de l'Afrique de l'Ouest"
        />
        
        <div className={`partnerships__grid ${isVisible ? 'partnerships__grid--visible' : ''}`}>
          {partnerships.map((partnership, index) => (
            <div 
              key={partnership.id} 
              className="partnerships__card-wrapper"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card
                title={partnership.title}
                icon={partnership.icon}
              >
                {partnership.description}
              </Card>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}
