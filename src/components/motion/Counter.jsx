import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

// Número que cuenta desde 0 hasta `value` cuando entra en pantalla.
export default function Counter({ value, suffix = '', prefix = '', className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: 1.4, bounce: 0 })
  const displayRef = useRef(null)

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, value, motionValue])

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${Math.round(latest)}${suffix}`
      }
    })
  }, [spring, prefix, suffix])

  return (
    <motion.span ref={ref} className={className}>
      <span ref={displayRef}>{prefix}0{suffix}</span>
    </motion.span>
  )
}
