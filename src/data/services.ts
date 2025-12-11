export interface Service {
  id: string
  title: string
  shortDescription: string
  detailedDescription: string
  icon: string
}

export const services: Service[] = [
  {
    id: 'import-export',
    title: 'Import-Export',
    shortDescription: 'Commerce international de produits agricoles',
    detailedDescription: 'Nous facilitons les échanges commerciaux entre l\'Afrique de l\'Ouest et les marchés internationaux, avec une expertise particulière dans l\'exportation de cacao, noix de cajou et café vers l\'Europe, l\'Asie et le Moyen-Orient.',
    icon: '🚢'
  },
  {
    id: 'distribution',
    title: 'Distribution',
    shortDescription: 'Réseau de distribution régional',
    detailedDescription: 'Notre réseau de distribution couvre l\'ensemble de la Côte d\'Ivoire et s\'étend aux pays voisins, garantissant une livraison rapide et fiable des produits agricoles aux transformateurs et distributeurs locaux.',
    icon: '🚚'
  },
  {
    id: 'production',
    title: 'Production Agricole',
    shortDescription: 'Accompagnement des producteurs locaux',
    detailedDescription: 'Nous travaillons en partenariat avec les coopératives agricoles locales pour améliorer les pratiques culturales, augmenter les rendements et garantir une production durable et de qualité.',
    icon: '🌱'
  },
  {
    id: 'transformation',
    title: 'Transformation Cacao/Café',
    shortDescription: 'Valorisation des matières premières',
    detailedDescription: 'Nos installations de transformation permettent de valoriser le cacao et le café ivoiriens, en produisant des fèves fermentées et séchées de qualité premium, prêtes pour l\'exportation.',
    icon: '☕'
  },
  {
    id: 'engrais',
    title: 'Engrais Organiques',
    shortDescription: 'Solutions agro-écologiques',
    detailedDescription: 'Nous développons et distribuons des engrais organiques issus de la valorisation des sous-produits agricoles, contribuant à une agriculture durable et respectueuse de l\'environnement.',
    icon: '🌿'
  }
]
