/**
 * **Feature: soanta-landing-page, Property 2: Color Palette Consistency**
 * **Validates: Requirements 2.2**
 * 
 * *For any* CSS color variable used in the stylesheet, the value SHALL match 
 * one of the defined brand colors (Orange #E8A33C, Vert #5B9A3D, Brun #6B5E4F, 
 * Blanc #FFFFFF, or derived shades).
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readFileSync } from 'fs'
import { join } from 'path'

// SOANTA Brand Colors (primary)
const brandColors = {
  orange: '#E8A33C',
  green: '#5B9A3D',
  brown: '#6B5E4F',
  white: '#FFFFFF'
}

// Derived/allowed colors (shades and variations)
const allowedColors = [
  // Primary colors
  '#E8A33C', '#e8a33c', // Orange
  '#5B9A3D', '#5b9a3d', // Green
  '#6B5E4F', '#6b5e4f', // Brown
  '#FFFFFF', '#ffffff', '#FFF', '#fff', // White
  
  // Derived shades (from variables.css)
  '#F5C77A', '#f5c77a', // Orange light
  '#C98A2E', '#c98a2e', // Orange dark
  '#7AB85A', '#7ab85a', // Green light
  '#4A7D31', '#4a7d31', // Green dark
  '#8A7A6A', '#8a7a6a', // Brown light
  '#4D4339', '#4d4339', // Brown dark
  '#F5F3F0', '#f5f3f0', // Background secondary
  
  // Common neutral colors (acceptable)
  '#000000', '#000', // Black
  'transparent',
  'inherit',
  'currentColor'
]

// Helper to extract hex colors from CSS content
function extractHexColors(cssContent: string): string[] {
  const hexPattern = /#[0-9A-Fa-f]{3,6}\b/g
  const matches = cssContent.match(hexPattern) || []
  return [...new Set(matches)]
}

// Helper to normalize hex color
function normalizeHex(hex: string): string {
  const normalized = hex.toLowerCase()
  // Convert 3-digit hex to 6-digit
  if (normalized.length === 4) {
    return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`
  }
  return normalized
}

// Helper to check if a color is within the allowed palette
function isAllowedColor(color: string): boolean {
  const normalized = normalizeHex(color)
  return allowedColors.some(allowed => 
    normalizeHex(allowed) === normalized
  )
}

describe('Property 2: Color Palette Consistency', () => {
  it('should have brand colors defined in variables.css', () => {
    const variablesPath = join(__dirname, '../../src/styles/variables.css')
    const cssContent = readFileSync(variablesPath, 'utf-8')
    
    // Check that all primary brand colors are defined
    expect(cssContent.toLowerCase()).toContain(brandColors.orange.toLowerCase())
    expect(cssContent.toLowerCase()).toContain(brandColors.green.toLowerCase())
    expect(cssContent.toLowerCase()).toContain(brandColors.brown.toLowerCase())
    expect(cssContent.toLowerCase()).toContain(brandColors.white.toLowerCase())
  })

  it('should use only allowed colors in variables.css', () => {
    const variablesPath = join(__dirname, '../../src/styles/variables.css')
    const cssContent = readFileSync(variablesPath, 'utf-8')
    
    const hexColors = extractHexColors(cssContent)
    
    for (const color of hexColors) {
      const isAllowed = isAllowedColor(color)
      if (!isAllowed) {
        console.log(`Unexpected color found: ${color}`)
      }
      expect(isAllowed).toBe(true)
    }
  })

  it('should validate color normalization for any hex color', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[0-9A-Fa-f]{6}$/),
        (hexString) => {
          const color = `#${hexString}`
          const normalized = normalizeHex(color)
          
          // Normalized color should be lowercase and 7 characters
          expect(normalized).toMatch(/^#[0-9a-f]{6}$/)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should correctly identify brand colors', () => {
    // Test that all brand colors are recognized
    for (const [name, hex] of Object.entries(brandColors)) {
      expect(isAllowedColor(hex)).toBe(true)
    }
  })

  it('should reject colors outside the palette', () => {
    const invalidColors = [
      '#FF0000', // Pure red
      '#0000FF', // Pure blue
      '#00FF00', // Pure lime
      '#123456', // Random color
    ]

    for (const color of invalidColors) {
      expect(isAllowedColor(color)).toBe(false)
    }
  })

  it('should handle 3-digit hex colors correctly', () => {
    // #FFF should normalize to #ffffff
    expect(normalizeHex('#FFF')).toBe('#ffffff')
    expect(normalizeHex('#fff')).toBe('#ffffff')
    
    // Test with property-based approach
    fc.assert(
      fc.property(
        fc.stringMatching(/^[0-9A-Fa-f]{3}$/),
        (hexString) => {
          const shortHex = `#${hexString}`
          const normalized = normalizeHex(shortHex)
          
          // Should expand to 6 digits
          expect(normalized.length).toBe(7)
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should have CSS variables using brand color names', () => {
    const variablesPath = join(__dirname, '../../src/styles/variables.css')
    const cssContent = readFileSync(variablesPath, 'utf-8')
    
    // Check for semantic variable names
    expect(cssContent).toContain('--color-orange')
    expect(cssContent).toContain('--color-green')
    expect(cssContent).toContain('--color-brown')
    expect(cssContent).toContain('--color-white')
  })
})
