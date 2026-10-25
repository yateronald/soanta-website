// Centralized asset paths for easy management
// Import images from src/assets for Vite bundling

import cacaoImg from '../assets/cacao-card.webp'
import cajouImg from '../assets/cajou-card.webp'
import cafeImg from '../assets/cafe-card.webp'
import cajouWideImg from '../assets/cajou-wide.webp'

// Product images
export const productImages = {
  cacao: cacaoImg,
  cajou: cajouImg,
  cafe: cafeImg,
} as const

// Editorial image used in the About section
export const aboutImage = cajouWideImg

// Logo (original banner, and the light version used on dark backgrounds)
export const logo = '/images/logo.png'
export const logoLight = '/images/logo-light.png'

// Hero background
export const heroBackground = '/images/hero-cacao.webp'

// Export all assets
export const assets = {
  logo,
  heroBackground,
  products: productImages,
} as const

export default assets
