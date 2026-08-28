import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FloatingSymbol from '../motion/FloatingSymbol'
import DrawnCurve from '../motion/DrawnCurve'
import AxiomaMark from '../AxiomaMark'
import { EASE, staggerContainer } from '../motion/variants'

// Sección Hero (id="inicio")
// TODO equipo: ajustar copy del título/subtítulo si hace falta.

const word = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export default function Hero() {
  const navigate = useNavigate()

  const scrollToQuienesSomos = () => {
    document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen scroll-mt-16 flex-col items-center justify-center gap-10 overflow-hidden px-4 pt-16 text-center sm:px-6"
    >
      {/* Símbolos matemáticos flotando en el fondo, con distinta profundidad */}
      <FloatingSymbol symbol="π" className="absolute left-[10%] top-[22%] text-4xl text-brand-300 sm:text-5xl" delay={0} duration={7} rotate={-8} />
      <FloatingSymbol symbol="∑" className="absolute right-[12%] top-[18%] text-5xl text-brand-300 sm:text-6xl" delay={0.4} duration={6} rotate={6} />
      <FloatingSymbol symbol="∞" className="absolute left-[16%] bottom-[24%] text-4xl text-brand-300 sm:text-5xl" delay={0.8} duration={8} rotate={4} />
      <FloatingSymbol symbol="√" className="absolute right-[18%] bottom-[20%] text-4xl text-brand-300 sm:text-5xl" delay={1.2} duration={6.5} rotate={-5} />
      <FloatingSymbol symbol="∫" className="absolute left-[6%] top-[52%] text-3xl text-brand-200 sm:text-4xl" delay={0.6} duration={9} rotate={10} />
      <FloatingSymbol symbol="θ" className="absolute right-[7%] top-[55%] text-3xl text-brand-200 sm:text-4xl" delay={1} duration={7.5} rotate={-10} />

      {/* Isotipo de Axioma: entrada con escala + una respiración continua sutil */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AxiomaMark className="h-20 w-20 drop-shadow-lg sm:h-24 sm:w-24" />
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-4"
        variants={staggerContainer(0.15)}
        initial="hidden"
        animate="show"
      >
        <motion.h1 variants={word}>
          <img
            src="/axioma-wordmark.png"
            alt="Axioma"
            className="h-16 w-auto sm:h-24"
          />
        </motion.h1>
        <motion.p variants={word} className="max-w-xl text-lg text-brand-600 sm:text-xl">
          El club de matemáticas del Tec de Monterrey. Únete a una comunidad
          que resuelve problemas, comparte ideas y se prepara para
          competencias.
        </motion.p>
      </motion.div>

      {/* Curva paramétrica decorativa que se dibuja al cargar la sección */}
      <DrawnCurve className="h-24 w-64 text-brand-400 sm:h-28 sm:w-80" />

      <motion.button
        type="button"
        onClick={() => navigate('/problemas')}
        className="rounded-full bg-brand-900 px-6 py-3 text-sm font-semibold text-brand-50"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
      >
        Ver Problemas
      </motion.button>

      {/* Ícono de flecha animada indicando scroll hacia abajo */}
      <motion.button
        type="button"
        onClick={scrollToQuienesSomos}
        aria-label="Ir a la siguiente sección"
        className="absolute bottom-8 text-brand-400 hover:text-brand-600"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </motion.button>
    </section>
  )
}
