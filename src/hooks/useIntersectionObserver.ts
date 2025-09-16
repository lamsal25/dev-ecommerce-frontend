import { useEffect, useState, RefObject } from 'react'

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.3,  // Minimum 30% visible before triggering
        ...options,      // Allow override via options if provided
      }
    )

    observer.observe(elementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [elementRef.current, options])

  return isIntersecting
}
