// Variantes de Framer Motion reutilizables en todo el sitio.
// Mantener la duración/easing consistente es lo que hace que el
// movimiento se sienta "de un solo sistema" y no improvisado.

export const EASE = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
}

export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})

export const popIn = (rotate = 0) => ({
  hidden: { opacity: 0, y: 24, scale: 0.9, rotate: 0 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate,
    transition: { duration: 0.6, ease: EASE },
  },
})

// Props listas para usar con <motion.div> en scroll-reveal:
// <motion.div {...revealProps} variants={fadeUp}>
export const revealProps = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, amount: 0.25 },
}
