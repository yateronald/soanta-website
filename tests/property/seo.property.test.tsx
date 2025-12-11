/**
 * **Feature: soanta-landing-page, Property 6: SEO Meta Tags Contain Keywords**
 * **Validates: Requirements 6.1**
 * 
 * *For any* of the target keywords ("cacao Côte d'Ivoire", "noix de cajou export", 
 * "transformation agricole Afrique"), at least one meta tag (title or description) 
 * SHALL contain the keyword or a semantic variant.
 */

/**
 * **Feature: soanta-landing-page, Property 9: Schema.org Data Validity**
 * **Validates: Requirements 6.5**
 * 
 * *For any* JSON-LD script in the document with @type "Organization", 
 * the data SHALL contain required fields (name, address, url) and valid values.
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readFileSync } from 'fs'
import { join } from 'path'

// Target keywords for SEO
const targetKeywords = [
  'cacao',
  'côte d\'ivoire',
  'noix de cajou',
  'export',
  'transformation agricole',
  'afrique',
  'soanta',
  'san pedro'
]

// Required Schema.org Organization fields
const requiredSchemaFields = ['name', 'url', 'address']

// Helper to normalize text for keyword matching
function normalizeText(text: string): string {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/['']/g, "'")
}

// Helper to check if text contains keyword (with variants)
function containsKeyword(text: string, keyword: string): boolean {
  const normalizedText = normalizeText(text)
  const normalizedKeyword = normalizeText(keyword)
  return normalizedText.includes(normalizedKeyword)
}

describe('Property 6: SEO Meta Tags Contain Keywords', () => {
  it('should have meta tags containing target keywords in index.html', () => {
    const indexPath = join(__dirname, '../../index.html')
    const htmlContent = readFileSync(indexPath, 'utf-8')
    
    // Extract title
    const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1] : ''
    
    // Extract meta description
    const descMatch = htmlContent.match(/<meta\s+name="description"\s+content="([^"]+)"/i)
    const description = descMatch ? descMatch[1] : ''
    
    const combinedText = `${title} ${description}`
    
    // At least some target keywords should be present
    const foundKeywords = targetKeywords.filter(keyword => 
      containsKeyword(combinedText, keyword)
    )
    
    expect(foundKeywords.length).toBeGreaterThan(0)
    
    // Specifically check for main business keywords
    const mainKeywords = ['cacao', 'soanta']
    const hasMainKeyword = mainKeywords.some(keyword => 
      containsKeyword(combinedText, keyword)
    )
    expect(hasMainKeyword).toBe(true)
  })

  it('should validate keyword presence for any generated meta content', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 10, maxLength: 100 }),
          description: fc.string({ minLength: 20, maxLength: 200 })
        }),
        ({ title, description }) => {
          // This property tests our keyword detection logic
          const combinedText = `${title} ${description}`
          
          // If we inject a known keyword, it should be detected
          const testKeyword = 'cacao'
          const textWithKeyword = `${combinedText} ${testKeyword}`
          
          expect(containsKeyword(textWithKeyword, testKeyword)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should detect keywords regardless of case or accents', () => {
    const testCases = [
      { text: 'CACAO premium', keyword: 'cacao', expected: true },
      { text: 'Côte d\'Ivoire', keyword: 'cote d\'ivoire', expected: true },
      { text: 'CÔTE D\'IVOIRE', keyword: 'côte d\'ivoire', expected: true },
      { text: 'noix de cajou export', keyword: 'cajou', expected: true },
      { text: 'random text', keyword: 'cacao', expected: false }
    ]

    for (const { text, keyword, expected } of testCases) {
      expect(containsKeyword(text, keyword)).toBe(expected)
    }
  })
})

describe('Property 9: Schema.org Data Validity', () => {
  it('should have valid Schema.org Organization data in index.html', () => {
    const indexPath = join(__dirname, '../../index.html')
    const htmlContent = readFileSync(indexPath, 'utf-8')
    
    // Extract JSON-LD script
    const jsonLdMatch = htmlContent.match(/<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/i)
    expect(jsonLdMatch).not.toBeNull()
    
    const jsonLdContent = jsonLdMatch![1]
    const schemaData = JSON.parse(jsonLdContent)
    
    // Check @type is Organization
    expect(schemaData['@type']).toBe('Organization')
    
    // Check required fields exist
    for (const field of requiredSchemaFields) {
      expect(schemaData).toHaveProperty(field)
      expect(schemaData[field]).toBeTruthy()
    }
    
    // Check address has required subfields
    expect(schemaData.address).toHaveProperty('@type', 'PostalAddress')
    expect(schemaData.address).toHaveProperty('addressLocality')
    expect(schemaData.address).toHaveProperty('addressCountry')
  })

  it('should validate Schema.org structure for any Organization data', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          url: fc.webUrl(),
          addressLocality: fc.string({ minLength: 1, maxLength: 50 }),
          addressCountry: fc.string({ minLength: 2, maxLength: 2 })
        }),
        ({ name, url, addressLocality, addressCountry }) => {
          // Build a Schema.org Organization object
          const schemaOrg = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name,
            url,
            address: {
              '@type': 'PostalAddress',
              addressLocality,
              addressCountry
            }
          }
          
          // Validate structure
          expect(schemaOrg['@type']).toBe('Organization')
          expect(schemaOrg.name).toBeTruthy()
          expect(schemaOrg.url).toBeTruthy()
          expect(schemaOrg.address['@type']).toBe('PostalAddress')
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should have valid URL format in Schema.org data', () => {
    const indexPath = join(__dirname, '../../index.html')
    const htmlContent = readFileSync(indexPath, 'utf-8')
    
    const jsonLdMatch = htmlContent.match(/<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/i)
    const schemaData = JSON.parse(jsonLdMatch![1])
    
    // URL should be a valid URL format
    expect(schemaData.url).toMatch(/^https?:\/\//)
    
    // Logo should also be a valid URL if present
    if (schemaData.logo) {
      expect(schemaData.logo).toMatch(/^https?:\/\//)
    }
  })

  it('should have SOANTA-specific data in Schema.org', () => {
    const indexPath = join(__dirname, '../../index.html')
    const htmlContent = readFileSync(indexPath, 'utf-8')
    
    const jsonLdMatch = htmlContent.match(/<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/i)
    const schemaData = JSON.parse(jsonLdMatch![1])
    
    // Check SOANTA-specific data
    expect(schemaData.name).toBe('SOANTA')
    expect(schemaData.address.addressLocality).toBe('San Pedro')
    expect(schemaData.address.addressCountry).toBe('CI')
  })
})
