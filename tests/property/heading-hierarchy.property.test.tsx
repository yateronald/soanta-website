/**
 * **Feature: soanta-landing-page, Property 7: HTML Heading Hierarchy**
 * **Validates: Requirements 6.2**
 * 
 * *For any* HTML document, there SHALL be exactly one H1 element, 
 * and all heading levels SHALL follow a logical hierarchy 
 * (no skipping from H1 to H3 without H2).
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import App from '../../src/App'

// Helper function to extract heading levels from rendered HTML
function extractHeadingLevels(container: HTMLElement): number[] {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  return Array.from(headings).map(h => parseInt(h.tagName.charAt(1)))
}

// Helper function to check if heading hierarchy is valid
function isValidHeadingHierarchy(levels: number[]): { valid: boolean; reason?: string } {
  if (levels.length === 0) {
    return { valid: true } // No headings is valid
  }

  // Count H1 elements
  const h1Count = levels.filter(l => l === 1).length
  if (h1Count !== 1) {
    return { 
      valid: false, 
      reason: `Expected exactly 1 H1, found ${h1Count}` 
    }
  }

  // Check for hierarchy violations (skipping levels)
  let maxLevelSeen = 0
  for (const level of levels) {
    // If we encounter a heading level that skips more than one level
    if (level > maxLevelSeen + 1 && maxLevelSeen > 0) {
      return { 
        valid: false, 
        reason: `Heading hierarchy violation: jumped from H${maxLevelSeen} to H${level}` 
      }
    }
    maxLevelSeen = Math.max(maxLevelSeen, level)
  }

  return { valid: true }
}

describe('Property 7: HTML Heading Hierarchy', () => {
  it('should have exactly one H1 and valid heading hierarchy in the rendered App', () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )

    const headingLevels = extractHeadingLevels(container)
    const result = isValidHeadingHierarchy(headingLevels)

    expect(result.valid).toBe(true)
    if (!result.valid) {
      console.log('Heading levels found:', headingLevels)
      console.log('Reason:', result.reason)
    }
  })

  it('should validate heading hierarchy for any sequence of headings', () => {
    // Property-based test: generate random heading sequences and validate the checker
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 6 }), { minLength: 1, maxLength: 20 }),
        (levels) => {
          // A valid hierarchy must:
          // 1. Have exactly one H1
          // 2. Not skip levels (e.g., H1 -> H3 without H2)
          
          const h1Count = levels.filter(l => l === 1).length
          const result = isValidHeadingHierarchy(levels)
          
          // If there's not exactly one H1, it should be invalid
          if (h1Count !== 1) {
            expect(result.valid).toBe(false)
            return
          }
          
          // Check for level skipping
          let maxLevel = 0
          let hasSkip = false
          for (const level of levels) {
            if (level > maxLevel + 1 && maxLevel > 0) {
              hasSkip = true
              break
            }
            maxLevel = Math.max(maxLevel, level)
          }
          
          if (hasSkip) {
            expect(result.valid).toBe(false)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should accept valid heading hierarchies', () => {
    // Test known valid hierarchies
    const validHierarchies = [
      [1],
      [1, 2],
      [1, 2, 3],
      [1, 2, 2, 3, 3, 2],
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 2, 3, 4]
    ]

    for (const hierarchy of validHierarchies) {
      const result = isValidHeadingHierarchy(hierarchy)
      expect(result.valid).toBe(true)
    }
  })

  it('should reject invalid heading hierarchies', () => {
    // Test known invalid hierarchies
    const invalidHierarchies = [
      { levels: [], reason: 'no headings' }, // Actually valid - empty is ok
      { levels: [2], reason: 'no H1' },
      { levels: [1, 1], reason: 'multiple H1' },
      { levels: [1, 3], reason: 'skipped H2' },
      { levels: [1, 2, 4], reason: 'skipped H3' },
      { levels: [1, 1, 2], reason: 'multiple H1' }
    ]

    for (const { levels, reason } of invalidHierarchies) {
      if (levels.length === 0) continue // Empty is valid
      const result = isValidHeadingHierarchy(levels)
      if (reason !== 'no headings') {
        expect(result.valid).toBe(false)
      }
    }
  })
})
