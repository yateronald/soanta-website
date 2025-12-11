/**
 * **Feature: soanta-landing-page, Property 4: Product Traceability Information**
 * **Validates: Requirements 4.2**
 * 
 * *For any* product displayed in the products section, the product card SHALL contain 
 * origin information (Côte d'Ivoire/San Pedro) and a traceability indicator.
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import Products from '../../src/components/Products/Products'
import { products, Product } from '../../src/data/products'

describe('Property 4: Product Traceability Information', () => {
  it('should have all products with origin information', () => {
    // For any product in the data, origin should be defined
    for (const product of products) {
      expect(product.origin).toBeTruthy()
      expect(product.region).toBeTruthy()
    }
  })

  it('should have all products with traceability indicator', () => {
    // For any product, traceability should be defined
    for (const product of products) {
      expect(typeof product.traceability).toBe('boolean')
    }
  })

  it('should render products with origin information visible', () => {
    render(
      <HelmetProvider>
        <Products />
      </HelmetProvider>
    )

    // Each product should display origin information
    for (const product of products) {
      const originText = `Origine: ${product.origin} / ${product.region}`
      expect(screen.getAllByText(new RegExp(product.origin))).toBeTruthy()
    }
  })

  it('should render traceability badge for traceable products', () => {
    render(
      <HelmetProvider>
        <Products />
      </HelmetProvider>
    )

    // Products with traceability should show the badge
    const traceableBadges = screen.getAllByText(/Traçabilité garantie/)
    expect(traceableBadges.length).toBeGreaterThan(0)
  })

  it('should validate that any product has required traceability fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...products),
        (product: Product) => {
          // Every product must have traceability-related fields
          expect(product.origin).toBeTruthy()
          expect(product.region).toBeTruthy()
          expect(typeof product.traceability).toBe('boolean')
          
          // Origin should be Côte d'Ivoire
          expect(product.origin).toBe("Côte d'Ivoire")
          
          // Region should be San Pedro
          expect(product.region).toBe('San Pedro')
        }
      ),
      { numRuns: 3 } // Limited since we have fixed data
    )
  })

  it('should have all products from Côte d\'Ivoire', () => {
    for (const product of products) {
      expect(product.origin).toBe("Côte d'Ivoire")
    }
  })

  it('should have all products from San Pedro region', () => {
    for (const product of products) {
      expect(product.region).toBe('San Pedro')
    }
  })

  it('should have exactly 3 products (cacao, cajou, café)', () => {
    expect(products.length).toBe(3)
    
    const productIds = products.map(p => p.id)
    expect(productIds).toContain('cacao')
    expect(productIds).toContain('cajou')
    expect(productIds).toContain('cafe')
  })

  it('should have unique product IDs', () => {
    const ids = products.map(p => p.id)
    const uniqueIds = new Set(ids)
    
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have products with premium badges', () => {
    for (const product of products) {
      expect(product.badges.length).toBeGreaterThan(0)
      
      // At least one badge should indicate premium quality
      const hasPremiumBadge = product.badges.some(badge => 
        badge.toLowerCase().includes('premium') || 
        badge.toLowerCase().includes('traçabilité') ||
        badge.toLowerCase().includes('origine')
      )
      expect(hasPremiumBadge).toBe(true)
    }
  })

  it('should have products with valid image paths', () => {
    for (const product of products) {
      expect(product.image).toBeTruthy()
      expect(product.image).toMatch(/^\/images\/products\//)
    }
  })

  it('should render product images with proper alt text', () => {
    render(
      <HelmetProvider>
        <Products />
      </HelmetProvider>
    )

    const images = document.querySelectorAll('.products__image')
    
    for (const img of images) {
      const alt = img.getAttribute('alt')
      expect(alt).toBeTruthy()
      expect(alt!.length).toBeGreaterThan(10)
    }
  })
})
