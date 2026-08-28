import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PhotoCarousel from '../motion/PhotoCarousel'
import { fadeUp, revealProps, staggerContainer } from '../motion/variants'

// Sección Galería (id="galeria")
// TODO equipo: reemplazar el array IMAGENES con fotos reales de eventos,
// sesiones de resolución de problemas, competencias, etc.

const IMAGENES = [
  {
    id: 1,
    src: null,
    alt: 'Sesión semanal de resolución de problemas de Axioma',
    rotate: -4,
    tape: 'left',
  },
  {
    id: 2,
    src: null,
    alt: 'Equipo de Axioma en una competencia interuniversitaria',
    rotate: 3,
    tape: 'right',
  },
  {
    id: 3,
    src: null,
    alt: 'Taller de introducción a la combinatoria',
    rotate: -2,
    tape: 'center',
  },
  {
    id: 4,
    src: null,
    alt: 'Integrantes del club en la premiación de una olimpiada',
    rotate: 5,
    tape: 'left',
  },
  {
    id: 5,
    src: null,
    alt: 'Pizarra con la solución de un problema de geometría',
    rotate: -5,
    tape: 'right',
  },
  {
    id: 6,
    src: null,
    alt: 'Reunión general del club Axioma',
    rotate: 2,
    tape: 'center',
  },
]

const TAPE_POSITION = {
  left: '-left-3 -top-3 -rotate-45',
  right: '-right-3 -top-3 rotate-45',
  center: 'left-1/2 -top-3 -translate-x-1/2 rotate-1',
}

// Un pedazo de "cinta" de washi tape pegado sobre la esquina de la polaroid.
function Tape({ position }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-6 w-14 rounded-[2px] bg-amber-100/90 shadow ring-1 ring-black/5 ${TAPE_POSITION[position]}`}
    />
  )
}

// Tarjeta estilo polaroid: marco blanco, foto cuadrada, cinta pegada
// arriba y un "pie de foto" a mano, con una inclinación fija por tarjeta
// que se endereza al pasar el mouse.
function Polaroid({ imagen, offsetClass }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: imagen.rotate }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative bg-white p-3 pb-6 text-left shadow-md ${offsetClass}`}
    >
      <Tape position={imagen.tape} />
      <div className="flex aspect-square items-center justify-center overflow-hidden border border-dashed border-brand-300 bg-brand-100 text-xs text-brand-400">
        {imagen.src ? (
          <img
            src={imagen.src}
            alt={imagen.alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="px-3 text-center">{imagen.alt}</span>
        )}
      </div>
      <p className="mt-2 truncate font-hand text-base text-brand-900/70">{imagen.alt}</p>
    </motion.button>
  )
}

export default function Galeria() {
  const [imagenActiva, setImagenActiva] = useState(null)

  return (
    <section
      id="galeria"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <motion.h2
        variants={fadeUp}
        {...revealProps}
        className="font-display mb-16 text-center text-3xl text-brand-900 sm:text-4xl"
      >
        Galería
      </motion.h2>

      {/* Carrusel de fotos destacadas: se arrastra/desliza con touch,
          trackpad o las flechas. Complementa las polaroids de abajo,
          no las reemplaza. */}
      <motion.div variants={fadeUp} {...revealProps} className="mb-20">
        <PhotoCarousel items={IMAGENES} />
      </motion.div>

      {/* Polaroids "pegadas" con leve inclinación, como un corcho de fotos */}
      <motion.div
        className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-10"
        variants={staggerContainer(0.1)}
        {...revealProps}
      >
        {IMAGENES.map((imagen, index) => (
          <div key={imagen.id} onClick={() => setImagenActiva(imagen)}>
            <Polaroid imagen={imagen} offsetClass={index % 3 === 1 ? 'sm:mt-8' : ''} />
          </div>
        ))}
      </motion.div>

      {/* Lightbox / modal simple, sin librería externa */}
      <AnimatePresence>
        {imagenActiva && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/70 p-4"
            onClick={() => setImagenActiva(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setImagenActiva(null)}
                className="absolute -top-10 right-0 text-brand-50 transition-colors hover:text-brand-200"
                aria-label="Cerrar"
              >
                ✕ Cerrar
              </button>
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-dashed border-brand-300 bg-brand-100 text-sm text-brand-900/60">
                {imagenActiva.src ? (
                  <img
                    src={imagenActiva.src}
                    alt={imagenActiva.alt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="px-6 text-center">{imagenActiva.alt}</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
