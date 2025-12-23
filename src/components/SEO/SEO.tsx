import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
}

const SITE_URL = 'https://soanta-website.vercel.app'

const defaultKeywords = [
  'cacao Côte d\'Ivoire',
  'noix de cajou export',
  'transformation agricole Afrique',
  'SOANTA',
  'San Pedro',
  'agriculture durable',
  'export cacao',
  'café ivoirien'
]

export default function SEO({
  title = 'SOANTA - Racines d\'Afrique, saveurs du monde',
  description = 'SOANTA - Société Ouest Africaine de Négoce et de Transformation Agricole. Valorisation des ressources agricoles ouest-africaines : cacao, noix de cajou, café. Export depuis San Pedro, Côte d\'Ivoire.',
  keywords = defaultKeywords,
  ogImage = `${SITE_URL}/images/Cacao.png`,
  canonicalUrl = SITE_URL
}: SEOProps) {
  return (
    <Helmet>
      {/* Meta tags de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="SOANTA" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Meta tags supplémentaires */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="SOANTA" />
      <meta name="geo.region" content="CI" />
      <meta name="geo.placename" content="San Pedro, Côte d\'Ivoire" />
      
      {/* Langue */}
      <html lang="fr" />
    </Helmet>
  )
}
