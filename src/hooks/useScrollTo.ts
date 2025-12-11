import { useCallback } from 'react'

interface UseScrollToOptions {
  offset?: number
  behavior?: ScrollBehavior
  onScrollComplete?: () => void
}

export default function useScrollTo(options: UseScrollToOptions = {}) {
  const { offset = 80, behavior = 'smooth', onScrollComplete } = options

  const scrollTo = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior
      })

      // Call onScrollComplete after animation (approximate)
      if (onScrollComplete) {
        setTimeout(onScrollComplete, 500)
      }
    }
  }, [offset, behavior, onScrollComplete])

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior
    })

    if (onScrollComplete) {
      setTimeout(onScrollComplete, 500)
    }
  }, [behavior, onScrollComplete])

  return { scrollTo, scrollToTop }
}
