import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MeshGradient } from '@paper-design/shaders-react'
import FloatingSymbol from '../motion/FloatingSymbol'
import DrawnCurve from '../motion/DrawnCurve'
import { EASE, staggerContainer } from '../motion/variants'

// Sección Hero (id="inicio")
// Fondo animado con shaders (@paper-design/shaders-react) usando la
// paleta de marca Axioma: rojo profundo #B70B0D, naranja #E57505 y
// amarillo dorado #FFB401.
// Encima del fondo: símbolos matemáticos flotantes, curva paramétrica
// decorativa y entrada del texto en stagger (features de la v2).
// TODO equipo: ajustar copy si cambia el mensaje.

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

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
      className="relative flex min-h-screen pb-20 scroll-mt-16 flex-col items-center justify-center gap-10 overflow-hidden bg-[#120303] px-4 pt-16 text-center sm:px-6"
    >
      {/* Fondo shader: mesh gradient animado en la paleta Axioma */}
      <div className="pointer-events-none absolute inset-0">
        <MeshGradient
          className="absolute inset-0 h-full w-full"
          colors={['#B70B0D', '#E57505', '#FFB401', '#120303']}
          speed={0.3}
          distortion={0.85}
          swirl={0.3}
          grainMixer={0.05}
          grainOverlay={0.05}
        />
        {/* Overlay oscuro para mantener contraste y legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#120303]/75 via-[#120303]/35 to-[#120303]/85" />
      </div>

      {/* Símbolos matemáticos flotando sobre el shader, recoloreados en
          dorado/naranja translúcido para que se lean sobre el fondo oscuro */}
      <FloatingSymbol symbol="π" className="pointer-events-none absolute left-[10%] top-[22%] text-4xl text-[#FFB401]/40 sm:text-5xl" delay={0} duration={7} rotate={-8} />
      <FloatingSymbol symbol="∑" className="pointer-events-none absolute right-[12%] top-[18%] text-5xl text-[#E57505]/40 sm:text-6xl" delay={0.4} duration={6} rotate={6} />
      <FloatingSymbol symbol="∞" className="pointer-events-none absolute left-[16%] bottom-[24%] text-4xl text-[#FFB401]/40 sm:text-5xl" delay={0.8} duration={8} rotate={4} />
      <FloatingSymbol symbol="√" className="pointer-events-none absolute right-[18%] bottom-[20%] text-4xl text-[#E57505]/40 sm:text-5xl" delay={1.2} duration={6.5} rotate={-5} />
      <FloatingSymbol symbol="∫" className="pointer-events-none absolute left-[6%] top-[52%] text-3xl text-[#FFB401]/30 sm:text-4xl" delay={0.6} duration={9} rotate={10} />
      <FloatingSymbol symbol="θ" className="pointer-events-none absolute right-[7%] top-[55%] text-3xl text-[#E57505]/30 sm:text-4xl" delay={1} duration={7.5} rotate={-10} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative flex flex-col items-center gap-4"
      >
        <span
          className="bg-clip-text text-xs font-semibold uppercase tracking-[0.35em] text-transparent mt-6 sm:text-sm inline-block"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)',
          }}
        >
          AXIOMA | Asociación X Interés Olímpico Matemático del Tecnológico de Monterrey
        </span>

        <motion.div
          className="flex flex-col items-center gap-4"
          variants={staggerContainer(0.15)}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={word}>
            <img
              src="/AXIOMA LOGOS (2).png"
              alt="Axioma"
              className="h-[300px] w-auto drop-shadow-[0_0_45px_rgba(255,180,1,0.35)] sm:h-[400px] lg:h-[500px]"
            />
          </motion.div>

          <motion.p variants={word} className="max-w-xl text-lg text-white/85 sm:text-xl">
            Capítulo Estudiantil oficial de la Sociedad Matemática Mexicana (SMM). Un espacio dedicado al entrenamiento de alto rendimiento, la divulgación STEM y la resolución de problemas lógicos de nivel olímpico.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Curva paramétrica decorativa que se dibuja al cargar la sección,
          recoloreada a dorado para leerse sobre el fondo oscuro */}
      <DrawnCurve className="h-24 w-64 text-[#FFB401]/70 sm:h-28 sm:w-80" />

      <motion.button
        type="button"
        onClick={() => navigate('/problemas')}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="relative rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B70B0D]/50"
        style={{
          background:
            'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)',
        }}
      >
        Ver Problemas
      </motion.button>

      {/* Ícono de flecha animada indicando scroll hacia abajo (clickeable) */}
      <motion.button
        type="button"
        onClick={scrollToQuienesSomos}
        aria-label="Ir a la siguiente sección"
        className="absolute bottom-8 text-[#FFB401] hover:text-[#E57505]"
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