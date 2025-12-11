// Centralized asset paths for easy management
// Import images from src/assets for Vite bundling

import cacaoImg from '../assets/Cacao.png'
import cajouImg from '../assets/Cajou.png'
import cafeImg from '../assets/cafe.png'

// Product images
export const productImages = {
  cacao: cacaoImg,
  cajou: cajouImg,
  cafe: cafeImg,
} as const

// Logo
export const logo = '/images/logo.png'

// Hero background (placeholder - can be updated when available)
export const heroBackground = '/images/hero-bg.webp'

// Export all assets
export const assets = {
  logo,
  heroBackground,
  products: productImages,
} as const

export default assets
