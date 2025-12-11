import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import * as fc from 'fast-check'

// Mock IntersectionObserver for jsdom
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  private callback: IntersectionObserverCallback
  
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }
  
  observe(target: Element) {
    // Simulate immediate intersection
    const entry: IntersectionObserverEntry = {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: 1,
      intersectionRect: target.getBoundingClientRect(),
      isIntersecting: true,
      rootBounds: null,
      target,
      time: Date.now()
    }
    this.callback([entry], this)
  }
  
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
}

window.IntersectionObserver = MockIntersectionObserver

// Cleanup après chaque test
afterEach(() => {
  cleanup()
})

// Configuration globale de fast-check
fc.configureGlobal({
  numRuns: 100, // Minimum 100 itérations par propriété
  verbose: true
})
