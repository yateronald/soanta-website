import { productImages } from './assets'

export interface Product {
  id: string
  name: string
  botanicalName: string
  description: string
  origin: string
  region: string
  image: string
  highlight: string
}

export const products: Product[] = [
  {
    id: 'cacao',
    name: 'Cacao',
    botanicalName: 'Theobroma cacao',
    description: 'Fèves de cacao fermentées et séchées selon les méthodes traditionnelles ivoiriennes, reconnues pour leurs arômes riches et leur qualité constante.',
    origin: 'Côte d\'Ivoire',
    region: 'San Pedro',
    image: productImages.cacao,
    highlight: 'Traçabilité garantie'
  },
  {
    id: 'cajou',
    name: 'Noix de cajou',
    botanicalName: 'Anacardium occidentale',
    description: 'Noix de cajou de première qualité, récoltées et transformées avec soin. Appréciées pour leur goût délicat et leur texture croquante.',
    origin: 'Côte d\'Ivoire',
    region: 'San Pedro',
    image: productImages.cajou,
    highlight: 'Origine certifiée'
  },
  {
    id: 'cafe',
    name: 'Café Robusta',
    botanicalName: 'Coffea canephora',
    description: 'Robusta de haute qualité cultivé dans les régions montagneuses de Côte d\'Ivoire. Un café aux notes intenses et au corps puissant.',
    origin: 'Côte d\'Ivoire',
    region: 'San Pedro',
    image: productImages.cafe,
    highlight: 'Agriculture durable'
  }
]
