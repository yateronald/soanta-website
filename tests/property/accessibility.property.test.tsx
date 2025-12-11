/**
 * **Feature: soanta-landing-page, Property 8: Image Alt Attributes**
 * **Validates: Requirements 6.4**
 * 
 * *For any* img element in the document, the alt attribute SHALL be present 
 * and contain a non-empty descriptive text in French.
 */

/**
 * **Feature: soanta-landing-page, Property 10: Accessibility ARIA Labels**
 * **Validates: Requirements 7.2**
 * 
 * *For any* interactive element (button, link, form input), the element SHALL have 
 * either visible text content, an aria-label, or an aria-labelledby reference.
 */

/**
 * **Feature: soanta-landing-page, Property 11: Color Contrast Compliance**
 * **Validates: Requirements 7.4**
 * 
 * *For any* text-background color combination used in the design, 
 * the contrast ratio SHALL be at least 4.5:1 for normal text and 3:1 for large text.
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import App from '../../src/App'

// Helper to calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Helper to calculate contrast ratio
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Helper to parse hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// SOANTA brand colors for contrast testing
const brandColors = {
  orange: '#E8A33C',
  green: '#5B9A3D',
  brown: '#6B5E4F',
  brownDark: '#4D4339',
  white: '#FFFFFF'
}

describe('Property 8: Image Alt Attributes', () => {
  it('should have alt attributes on all images in the rendered App', () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )

    const images = container.querySelectorAll('img')
    
    for (const img of images) {
      const alt = img.getAttribute('alt')
      expect(alt).not.toBeNull()
      expect(alt).toBeTruthy()
      expect(alt!.length).toBeGreaterThan(0)
    }
  })

  it('should have descriptive alt text (not just filenames)', () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )

    const images = container.querySelectorAll('img')
    
    for (const img of images) {
      const alt = img.getAttribute('alt')!
      
      // Alt text should not be just a filename
      expect(alt).not.toMatch(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
      
      // Alt text should be descriptive (more than 5 characters)
      expect(alt.length).toBeGreaterThan(5)
    }
  })
})

describe('Property 10: Accessibility ARIA Labels', () => {
  it('should have accessible buttons with labels', () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )

    const buttons = container.querySelectorAll('button')
    
    for (const button of buttons) {
      const hasText = button.textContent && button.textContent.trim().length > 0
      const hasAriaLabel = button.hasAttribute('aria-label')
      const hasAriaLabelledBy = button.hasAttribute('aria-labelledby')
      
      expect(hasText || hasAriaLabel || hasAriaLabelledBy).toBe(true)
    }
  })

  it('should have accessible links with labels', () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )

    const links = container.querySelectorAll('a')
    
    for (const link of links) {
      const hasText = link.textContent && link.textContent.trim().length > 0
      const hasAriaLabel = link.hasAttribute('aria-label')
      const hasAriaLabelledBy = link.hasAttribute('aria-labelledby')
      const hasImage = link.querySelector('img[alt]')
      
      expect(hasText || hasAriaLabel || hasAriaLabelledBy || hasImage).toBe(true)
    }
  })

  it('should have accessible form inputs with labels', () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )

    const inputs = container.querySelectorAll('input, textarea, select')
    
    for (const input of inputs) {
      const id = input.getAttribute('id')
      const hasAriaLabel = input.hasAttribute('aria-label')
      const hasAriaLabelledBy = input.hasAttribute('aria-labelledby')
      const hasAssociatedLabel = id && container.querySelector(`label[for="${id}"]`)
      
      expect(hasAriaLabel || hasAriaLabelledBy || hasAssociatedLabel).toBe(true)
    }
  })

  it('should have navigation with aria-label', () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )

    const navs = container.querySelectorAll('nav')
    
    for (const nav of navs) {
      expect(nav.hasAttribute('aria-label')).toBe(true)
    }
  })
})

describe('Property 11: Color Contrast Compliance', () => {
  it('should have sufficient contrast for primary text colors', () => {
    // Test white text on brown background (common in footer)
    const whiteLum = getLuminance(255, 255, 255)
    const brownDarkRgb = hexToRgb(brandColors.brownDark)!
    const brownDarkLum = getLuminance(brownDarkRgb.r, brownDarkRgb.g, brownDarkRgb.b)
    
    const contrastWhiteOnBrown = getContrastRatio(whiteLum, brownDarkLum)
    expect(contrastWhiteOnBrown).toBeGreaterThanOrEqual(4.5)
  })

  it('should have sufficient contrast for green on white', () => {
    const whiteLum = getLuminance(255, 255, 255)
    const greenRgb = hexToRgb(brandColors.green)!
    const greenLum = getLuminance(greenRgb.r, greenRgb.g, greenRgb.b)
    
    const contrastGreenOnWhite = getContrastRatio(whiteLum, greenLum)
    // Green buttons should have at least 3:1 for large text
    expect(contrastGreenOnWhite).toBeGreaterThanOrEqual(3)
  })

  it('should have sufficient contrast for brown text on white', () => {
    const whiteLum = getLuminance(255, 255, 255)
    const brownDarkRgb = hexToRgb(brandColors.brownDark)!
    const brownDarkLum = getLuminance(brownDarkRgb.r, brownDarkRgb.g, brownDarkRgb.b)
    
    const contrastBrownOnWhite = getContrastRatio(whiteLum, brownDarkLum)
    expect(contrastBrownOnWhite).toBeGreaterThanOrEqual(4.5)
  })

  it('should validate contrast calculation is correct', () => {
    // Black on white should be 21:1
    const blackLum = getLuminance(0, 0, 0)
    const whiteLum = getLuminance(255, 255, 255)
    const contrast = getContrastRatio(whiteLum, blackLum)
    
    expect(contrast).toBeCloseTo(21, 0)
  })
})
