import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
}

interface UseIntersectionObserverReturn<T extends Element> {
  ref: RefObject<T | null>
  isVisible: boolean
  entry: IntersectionObserverEntry | null
}

export default function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true
  } = options

  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry)
        
        if (observerEntry.isIntersecting) {
          setIsVisible(true)
          
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, triggerOnce])

  return { ref, isVisible, entry }
}
