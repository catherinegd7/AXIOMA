import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, [role="button"]'

// Cursor personalizado (punto + anillo con retraso) que crece sobre
// elementos interactivos. Solo se activa en dispositivos con mouse
// (pointer: fine); en touch no se monta nada.
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { stiffness: 300, damping: 30 })
  const ringY = useSpring(dotY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const canHover = window.matchMedia('(pointer: fine)').matches
    setEnabled(canHover)
    if (!canHover) return

    const handleMove = (event) => {
      dotX.set(event.clientX)
      dotY.set(event.clientY)
      setIsVisible(true)
    }
    const handleOver = (event) => {
      setIsHovering(Boolean(event.target.closest(INTERACTIVE_SELECTOR)))
    }
    const handleLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleOver)
    document.documentElement.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
    }
  }, [dotX, dotY])

  if (!enabled) return null

  return (
    <div className={`pointer-events-none fixed inset-0 z-[100] ${isVisible ? '' : 'opacity-0'}`}>
      <motion.div
        className="absolute rounded-full bg-brand-900"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: isHovering ? 6 : 6, height: isHovering ? 6 : 6 }}
      />
      <motion.div
        className="absolute rounded-full border border-brand-900/40"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: isHovering ? 52 : 32, height: isHovering ? 52 : 32, opacity: isHovering ? 0.6 : 0.35 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  )
}
