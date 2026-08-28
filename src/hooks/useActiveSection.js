import { useEffect, useState } from 'react'

// Devuelve el id de la sección actualmente visible, para resaltar
// el link activo del Navbar mientras se hace scroll.
export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [ids])

  return activeId
}
