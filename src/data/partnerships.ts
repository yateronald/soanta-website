export interface Partnership {
  id: string
  title: string
  description: string
}

export interface Partner {
  id: string
  name: string
  logo: string
  url: string
}

export const partnerships: Partnership[] = [
  {
    id: 'co-investissement',
    title: 'Co-investissement',
    description: 'Participez au développement de projets agricoles innovants en Côte d\'Ivoire. Nous offrons des opportunités d\'investissement dans la production, la transformation et la logistique.'
  },
  {
    id: 'export',
    title: 'Accords Export',
    description: 'Établissez des partenariats commerciaux durables pour l\'approvisionnement en produits agricoles premium. Nous garantissons qualité, traçabilité et régularité des livraisons.'
  },
  {
    id: 'agro-ecologie',
    title: 'Projets Agro-écologiques',
    description: 'Collaborez avec nous sur des initiatives de développement durable : agriculture biologique, reforestation, et valorisation des déchets agricoles.'
  },
  {
    id: 'logistique',
    title: 'Logistique',
    description: 'Bénéficiez de notre position stratégique au hub portuaire de San Pedro pour optimiser vos chaînes d\'approvisionnement en Afrique de l\'Ouest.'
  }
]

// Partner logos shown in the Partnerships section; each logo links to the partner's website.
// Logos are displayed on a dark background, so use a light (white) version.
export const partners: Partner[] = [
  {
    id: 'kjoller',
    name: 'Kjøller',
    logo: '/images/partners/kjoller-light.png',
    url: 'https://kjoller.com/default.asp'
  }
]

export const keyAdvantages = [
  'Hub portuaire San Pedro',
  'Traçabilité complète',
  'RCCM Conforme'
]
