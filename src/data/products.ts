import { productImages } from './assets'

export interface Product {
  id: string
  name: string
  description: string
  origin: string
  region: string
  image: string
  badges: string[]
  traceability: boolean
}

export const products: Product[] = [
  {
    id: 'cacao',
    name: 'Cacao',
    description: 'Fèves de cacao premium, fermentées et séchées selon les méthodes traditionnelles ivoiriennes. Notre cacao est reconnu pour ses arômes riches et sa qualité exceptionnelle.',
    origin: 'Côte d\'Ivoire',
    region: 'San Pedro',
    image: productImages.cacao,
    badges: ['Premium', 'Traçabilité garantie'],
    traceability: true
  },
  {
    id: 'cajou',
    name: 'Noix de Cajou',
    description: 'Noix de cajou de première qualité, récoltées et transformées avec soin. Nos noix sont appréciées pour leur goût délicat et leur texture croquante.',
    origin: 'Côte d\'Ivoire',
    region: 'San Pedro',
    image: productImages.cajou,
    badges: ['Premium', 'Origine certifiée'],
    traceability: true
  },
  {
    id: 'cafe',
    name: 'Café',
    description: 'Café robusta de haute qualité, cultivé dans les régions montagneuses de Côte d\'Ivoire. Un café aux notes intenses et au corps puissant.',
    origin: 'Côte d\'Ivoire',
    region: 'San Pedro',
    image: productImages.cafe,
    badges: ['Premium', 'Agriculture durable'],
    traceability: true
  }
]
