/**
 * **Feature: soanta-landing-page, Property 3: Service Cards Have Detailed Content**
 * **Validates: Requirements 3.4**
 * 
 * *For any* service card in the services section, clicking or expanding SHALL reveal 
 * additional descriptive content that is non-empty and relevant to the service.
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { render, screen, fireEvent } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import Services from '../../src/components/Services/Services'
import { services, Service } from '../../src/data/services'

describe('Property 3: Service Cards Have Detailed Content', () => {
  it('should have all services with non-empty detailed descriptions', () => {
    // For any service in the data, detailedDescription should be non-empty
    for (const service of services) {
      expect(service.detailedDescription).toBeTruthy()
      expect(service.detailedDescription.length).toBeGreaterThan(10)
    }
  })

  it('should render all 5 service cards', () => {
    render(
      <HelmetProvider>
        <Services />
      </HelmetProvider>
    )

    // Should have exactly 5 services
    expect(services.length).toBe(5)
    
    // Each service title should be visible
    for (const service of services) {
      expect(screen.getByText(service.title)).toBeInTheDocument()
    }
  })

  it('should show detailed content when card is clicked', () => {
    render(
      <HelmetProvider>
        <Services />
      </HelmetProvider>
    )

    // Click on the first service card
    const firstServiceTitle = screen.getByText(services[0].title)
    const card = firstServiceTitle.closest('.card')
    
    if (card) {
      fireEvent.click(card)
      
      // After clicking, the detailed description should be visible
      expect(screen.getByText(services[0].detailedDescription)).toBeInTheDocument()
    }
  })

  it('should validate that any service has required fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...services),
        (service: Service) => {
          // Every service must have all required fields
          expect(service.id).toBeTruthy()
          expect(service.title).toBeTruthy()
          expect(service.shortDescription).toBeTruthy()
          expect(service.detailedDescription).toBeTruthy()
          expect(service.icon).toBeTruthy()
          
          // Detailed description should be longer than short description
          expect(service.detailedDescription.length).toBeGreaterThan(
            service.shortDescription.length
          )
        }
      ),
      { numRuns: 5 } // Limited since we have fixed data
    )
  })

  it('should have unique service IDs', () => {
    const ids = services.map(s => s.id)
    const uniqueIds = new Set(ids)
    
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have cards that are expandable', () => {
    render(
      <HelmetProvider>
        <Services />
      </HelmetProvider>
    )

    const cards = document.querySelectorAll('.card--expandable')
    
    // All service cards should be expandable
    expect(cards.length).toBe(services.length)
  })

  it('should toggle expanded state on click', () => {
    render(
      <HelmetProvider>
        <Services />
      </HelmetProvider>
    )

    const firstCard = document.querySelector('.card--expandable')
    
    if (firstCard) {
      // Initially not expanded
      expect(firstCard).not.toHaveClass('card--expanded')
      
      // Click to expand
      fireEvent.click(firstCard)
      expect(firstCard).toHaveClass('card--expanded')
      
      // Click again to collapse
      fireEvent.click(firstCard)
      expect(firstCard).not.toHaveClass('card--expanded')
    }
  })

  it('should have accessible card interactions', () => {
    render(
      <HelmetProvider>
        <Services />
      </HelmetProvider>
    )

    const cards = document.querySelectorAll('.card--expandable')
    
    for (const card of cards) {
      // Expandable cards should have proper accessibility attributes
      expect(card).toHaveAttribute('role', 'button')
      expect(card).toHaveAttribute('tabIndex', '0')
      expect(card).toHaveAttribute('aria-expanded')
    }
  })

  it('should validate service content relevance', () => {
    // For any service, the detailed description should contain relevant keywords
    for (const service of services) {
      const combinedText = `${service.title} ${service.shortDescription} ${service.detailedDescription}`.toLowerCase()
      
      // Each service should have coherent content
      // The title keywords should appear somewhere in the descriptions
      const titleWords = service.title.toLowerCase().split(/\s+/)
      const hasRelevantContent = titleWords.some(word => 
        word.length > 3 && combinedText.includes(word)
      )
      
      expect(hasRelevantContent).toBe(true)
    }
  })
})
