import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MeshGradient, PulsingBorder } from '@paper-design/shaders-react'

// Sección Hero (id="inicio")
// Fondo animado con shaders (@paper-design/shaders-react) usando la
// paleta de marca Axioma: rojo profundo #B70B0D, naranja #E57505 y
// amarillo dorado #FFB401. TODO equipo: ajustar copy si cambia el mensaje.

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function Hero() {
  const navigate = useNavigate()

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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative flex flex-col items-center gap-4"
      >
        <span
          className="bg-clip-text text-xs font-semibold uppercase tracking-[0.35em] text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)',
          }}
        >
          Matemáticas · Tecnología · Comunidad
        </span>

       <img
        src="/AXIOMA LOGOS (2).png"
        alt="Axioma"
        className="h-[300px] w-auto drop-shadow-[0_0_45px_rgba(255,180,1,0.35)] sm:h-[400px] lg:h-[500px]"
      />

        <p className="max-w-xl text-lg text-white/85 sm:text-xl">
          El club de matemáticas del Tec de Monterrey. Únete a una comunidad
          que resuelve problemas, comparte ideas y se prepara para
          competencias.
        </p>
      </motion.div>

      {/* Halo shader decorativo: reemplaza el placeholder de animación/logo 3D */}
      {/* 
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64"
      >
        <PulsingBorder
          className="h-full w-full"
          colors={['#FFB401', '#E57505', '#B70B0D']}
          colorBack="#00000000"
          aspectRatio="square"
          roundness={1}
          thickness={0.05}
          softness={0.8}
          intensity={0.35}
          bloom={0.55}
          spots={3}
          spotSize={0.35}
          pulse={0.3}
          smoke={0.4}
          smokeSize={0.5}
          scale={0.8}
          speed={0.9}
        />
      </motion.div>
      */}

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

      {/* Ícono de flecha animada indicando scroll hacia abajo */}
      <div className="absolute bottom-8 animate-bounce text-[#FFB401]">
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
      </div>
    </section>
  )
}
