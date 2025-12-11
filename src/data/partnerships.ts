export interface Partnership {
  id: string
  title: string
  description: string
  icon: string
}

export const partnerships: Partnership[] = [
  {
    id: 'co-investissement',
    title: 'Co-investissement',
    description: 'Participez au développement de projets agricoles innovants en Côte d\'Ivoire. Nous offrons des opportunités d\'investissement dans la production, la transformation et la logistique.',
    icon: '💰'
  },
  {
    id: 'export',
    title: 'Accords Export',
    description: 'Établissez des partenariats commerciaux durables pour l\'approvisionnement en produits agricoles premium. Nous garantissons qualité, traçabilité et régularité des livraisons.',
    icon: '🌍'
  },
  {
    id: 'agro-ecologie',
    title: 'Projets Agro-écologiques',
    description: 'Collaborez avec nous sur des initiatives de développement durable : agriculture biologique, reforestation, et valorisation des déchets agricoles.',
    icon: '🌳'
  },
  {
    id: 'logistique',
    title: 'Logistique',
    description: 'Bénéficiez de notre position stratégique au hub portuaire de San Pedro pour optimiser vos chaînes d\'approvisionnement en Afrique de l\'Ouest.',
    icon: '📦'
  }
]

export const keyAdvantages = [
  'Hub portuaire San Pedro',
  'Traçabilité complète',
  'RCCM Conforme'
]
