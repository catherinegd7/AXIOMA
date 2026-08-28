import { motion } from 'framer-motion'

// Curva paramétrica decorativa que se "dibuja" sola al entrar en
// pantalla (animación del stroke, como si alguien la trazara).
export default function DrawnCurve({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 160"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d="M4 120 C 80 10, 140 150, 200 80 S 320 10, 396 90"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.circle
        cx="396"
        cy="90"
        r="4.5"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4, delay: 1.6 }}
      />
    </svg>
  )
}
