import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Counter from '../motion/Counter'
import { fadeUp, popIn, revealProps, staggerContainer } from '../motion/variants'

// Sección Quiénes Somos (id="quienes-somos")
// TODO equipo: reemplazar el texto de misión/visión, la imagen grupal
// y las cifras de STATS por el contenido real del club.

const STATS = [
  { id: 1, value: 2019, prefix: '', suffix: '', label: 'Fundado en', rotate: -6 },
  { id: 2, value: 50, prefix: '+', suffix: '', label: 'Miembros activos', rotate: 4 },
  { id: 3, value: 12, prefix: '', suffix: '', label: 'Competencias/año', rotate: -3 },
]

// Tarjeta con un leve efecto "magnético" en 2D: se desplaza unos
// píxeles hacia el cursor. Evita transforms 3D (perspective/rotateX/Y),
// que son costosos de componer en equipos sin buena aceleración GPU.
function MagneticCard() {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const translateX = useTransform(x, [-0.5, 0.5], [-8, 8])
  const translateY = useTransform(y, [-0.5, 0.5], [-8, 8])

  const handleMouseMove = (event) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const resetOffset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div variants={popIn()} className="relative">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetOffset}
        style={{ x: translateX, y: translateY }}
        className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-brand-100 text-sm text-brand-400"
      >
        Espacio para imagen grupal
      </motion.div>

      {/* Cifras flotantes tipo "sticker" sobre la imagen */}
      {STATS.map((stat, index) => (
        <motion.div
          key={stat.id}
          variants={popIn(stat.rotate)}
          className={`absolute rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-center shadow-md ${
            index === 0
              ? '-left-4 -top-4 sm:-left-6 sm:-top-6'
              : index === 1
                ? '-right-4 top-1/3 sm:-right-6'
                : '-bottom-4 left-1/4 sm:-bottom-6'
          }`}
        >
          <p className="text-lg font-bold text-brand-900 sm:text-xl">
            <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          </p>
          <p className="whitespace-nowrap text-[11px] font-medium text-brand-900/60">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function QuienesSomos() {
  return (
    <section
      id="quienes-somos"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <motion.div
        className="grid items-center gap-16 md:grid-cols-2"
        variants={staggerContainer(0.15)}
        {...revealProps}
      >
        <motion.div variants={staggerContainer(0.12)} className="flex flex-col gap-4">
          <motion.h2 variants={fadeUp} className="font-display text-3xl text-brand-900 sm:text-4xl">
            ¿Qué es Axioma?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-brand-900/70">
            Axioma es el club de matemáticas del Tec de Monterrey. Reunimos a
            estudiantes apasionados por resolver problemas, prepararnos para
            competencias y compartir el gusto por las matemáticas fuera del
            salón de clases. (Texto placeholder — reemplazar con misión y
            visión reales.)
          </motion.p>
          <motion.p variants={fadeUp} className="text-brand-900/70">
            Nuestra visión es construir una comunidad donde cualquier persona,
            sin importar su nivel, encuentre un espacio para aprender,
            practicar y crecer junto a otros entusiastas de las matemáticas.
          </motion.p>
        </motion.div>

        <MagneticCard />
      </motion.div>
    </section>
  )
}
