import { motion } from 'framer-motion'

// Símbolo matemático flotante. Combina una animación de flotación
// constante (loop) con parallax: se desplaza según cuánto se ha
// hecho scroll, multiplicado por `depth` (entre 0 y 1).
//
// className controla tamaño/posición/color vía Tailwind (text-*, top-*, etc.).
export default function FloatingSymbol({
  symbol,
  className = '',
  delay = 0,
  duration = 6,
  rotate = 0,
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none select-none font-serif italic ${className}`}
      initial={{ opacity: 0, y: 12, rotate: rotate - 6 }}
      animate={{
        opacity: 1,
        y: [0, -14, 0],
        rotate: [rotate - 4, rotate + 4, rotate - 4],
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        y: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        rotate: { duration: duration * 1.4, repeat: Infinity, ease: 'easeInOut', delay },
      }}
    >
      {symbol}
    </motion.span>
  )
}
