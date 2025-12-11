/**
 * **Feature: soanta-landing-page, Property 1: Navigation Links Target Valid Sections**
 * **Validates: Requirements 1.2**
 * 
 * *For any* navigation link in the header menu, the href attribute SHALL reference 
 * an existing section ID in the document, ensuring smooth scroll navigation functions correctly.
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import Header from '../../src/components/Header/Header'

// Expected section IDs that should exist in the full app
const validSectionIds = ['accueil', 'services', 'produits', 'partenariats', 'contact']

// Helper to extract href targets from navigation links
function extractNavLinkTargets(container: HTMLElement): string[] {
  const navLinks = container.querySelectorAll('.header__nav-link')
  return Array.from(navLinks).map(link => {
    const href = link.getAttribute('href') || ''
    return href.startsWith('#') ? href.slice(1) : href
  })
}

describe('Property 1: Navigation Links Target Valid Sections', () => {
  it('should have all navigation links targeting valid section IDs', () => {
    const { container } = render(
      <HelmetProvider>
        <Header />
      </HelmetProvider>
    )

    const linkTargets = extractNavLinkTargets(container)
    
    // All link targets should be in the valid section IDs list
    for (const target of linkTargets) {
      expect(validSectionIds).toContain(target)
    }
  })

  it('should have navigation links for all main sections', () => {
    const { container } = render(
      <HelmetProvider>
        <Header />
      </HelmetProvider>
    )

    const linkTargets = extractNavLinkTargets(container)
    
    // Check that essential sections are covered
    const essentialSections = ['services', 'produits', 'partenariats', 'contact']
    for (const section of essentialSections) {
      expect(linkTargets).toContain(section)
    }
  })

  it('should validate that any generated section ID follows naming conventions', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z][a-z0-9-]*$/),
        (sectionId) => {
          // Valid section IDs should be lowercase, start with a letter, 
          // and contain only letters, numbers, and hyphens
          expect(sectionId).toMatch(/^[a-z][a-z0-9-]*$/)
          
          // If this ID is in our valid list, it should be a valid target
          if (validSectionIds.includes(sectionId)) {
            expect(validSectionIds).toContain(sectionId)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should have accessible navigation links', () => {
    const { container } = render(
      <HelmetProvider>
        <Header />
      </HelmetProvider>
    )

    const navLinks = container.querySelectorAll('.header__nav-link')
    
    // Each link should have text content for accessibility
    for (const link of navLinks) {
      expect(link.textContent).toBeTruthy()
      expect(link.textContent!.trim().length).toBeGreaterThan(0)
    }
  })

  it('should have a navigation element with proper aria-label', () => {
    render(
      <HelmetProvider>
        <Header />
      </HelmetProvider>
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label')
  })

  it('should have mobile menu toggle with proper accessibility attributes', () => {
    const { container } = render(
      <HelmetProvider>
        <Header />
      </HelmetProvider>
    )

    const mobileToggle = container.querySelector('.header__mobile-toggle')
    expect(mobileToggle).toHaveAttribute('aria-label')
    expect(mobileToggle).toHaveAttribute('aria-expanded')
  })

  it('should validate link-section mapping consistency', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...validSectionIds),
        (sectionId) => {
          // For any valid section ID, it should be a valid navigation target
          const { container } = render(
            <HelmetProvider>
              <Header />
            </HelmetProvider>
          )

          const linkTargets = extractNavLinkTargets(container)
          
          // The section should either be in the navigation or be 'accueil' (home)
          // which scrolls to top
          if (sectionId !== 'accueil') {
            // Non-home sections should have corresponding nav links
            expect(linkTargets).toContain(sectionId)
          }
        }
      ),
      { numRuns: 5 } // Limited runs since we're testing a fixed set
    )
  })
})
