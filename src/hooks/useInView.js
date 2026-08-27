import { useEffect, useRef, useState } from 'react'

/**
 * Detecta cuando un elemento entra en el viewport para disparar
 * animaciones de entrada (fade-in-up, etc.) sin librerías externas.
 */
export function useInView({ threshold = 0.2, once = true } = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.unobserve(node)
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, once])

  return [ref, isInView]
}
