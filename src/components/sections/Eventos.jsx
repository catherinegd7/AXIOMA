import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, popIn, revealProps, staggerContainer } from '../motion/variants'

// Sección Eventos (id="eventos")
// TODO equipo: reemplazar EVENTOS con la info real (póster, fecha, lugar,
// link de registro) conforme se anuncien. "tipo: 'pasado'" los muestra
// en blanco y negro como archivo; "tipo: 'proximo'" les pone la
// etiqueta "Próximo".

const EVENTOS = [
  {
    id: 1,
    tipo: 'proximo',
    titulo: 'Entrenamiento',
    fecha: '29 de agosto',
    lugar: 'A3-109 · 11:00–15:00',
    alt: 'Póster de entrenamiento de matemáticas, 29 de agosto en A3-109',
    src: null,
    link: null,
  },
  {
    id: 2,
    tipo: 'proximo',
    titulo: 'Integration Bee 2026',
    fecha: '31 de agosto – 2 de septiembre',
    lugar: 'Organizado por SEIQ',
    alt: 'Póster de Integration Bee 2026, Tec de Monterrey',
    src: null,
    link: null,
  },
  {
    id: 3,
    tipo: 'proximo',
    titulo: 'Simposium Axioma',
    fecha: 'Fecha por confirmar',
    lugar: '',
    alt: 'Simposium de matemáticas de Axioma',
    src: null,
    link: null,
  },
  {
    id: 4,
    tipo: 'pasado',
    titulo: 'Concurso Putnam',
    fecha: 'Diciembre 2025',
    lugar: '',
    alt: 'Concurso Putnam, edición 2025',
    src: null,
    link: null,
  },
]

// Tarjeta de evento: póster + etiqueta de estado + info corta abajo.
// Los eventos pasados se ven en blanco y negro, como archivo.
function EventCard({ evento }) {
  const esProximo = evento.tipo === 'proximo'

  return (
    <motion.div
      variants={popIn(esProximo ? -2 : 0)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-64 shrink-0 snap-center flex-col gap-3 sm:w-72"
    >
      <div
        className={`relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-brand-300 bg-brand-100 text-xs text-brand-400 shadow-lg transition-all duration-300 ${
          esProximo ? '' : 'grayscale opacity-70'
        }`}
      >
        {evento.src ? (
          <img src={evento.src} alt={evento.alt} className="h-full w-full object-cover" />
        ) : (
          <span className="px-4 text-center">{evento.alt}</span>
        )}

        {esProximo ? (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-brand-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-white"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            Próximo
          </span>
        ) : (
          <span className="absolute left-3 top-3 rounded-full bg-brand-900/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Pasado
          </span>
        )}
      </div>

      <div className="flex flex-col gap-0.5 px-1">
        <h3 className="font-semibold text-brand-900">{evento.titulo}</h3>
        <p className="text-sm text-brand-900/60">
          {evento.fecha}
          {evento.lugar ? ` · ${evento.lugar}` : ''}
        </p>
        {evento.link && (
          <a
            href={evento.link}
            target="_blank"
            rel="noreferrer"
            className="mt-1 text-sm font-medium text-brand-900 underline decoration-brand-300 underline-offset-4 transition-colors hover:text-brand-600"
          >
            Más info →
          </a>
        )}
      </div>
    </motion.div>
  )
}

// Carrusel plano: las tarjetas no giran ni se inclinan, siempre de
// frente para que la fecha/lugar y el link se puedan leer y clickear.
// Scroll nativo con snap (touch/trackpad funcionan solos) + flechas.
function EventCarousel({ eventos }) {
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateArrows = () => {
    const track = trackRef.current
    if (!track) return
    setCanScrollLeft(track.scrollLeft > 8)
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 8)
  }

  useEffect(() => {
    updateArrows()
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      track.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [])

  const scrollByCard = (direction) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[0]
    const amount = (card?.clientWidth || 280) + 24
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 pl-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {eventos.map((evento) => (
          <EventCard key={evento.id} evento={evento} />
        ))}
      </div>

      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Eventos anteriores"
          className="absolute -left-4 top-[38%] hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110 sm:flex"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-brand-900">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Más eventos"
          className="absolute -right-4 top-[38%] hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110 sm:flex"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-brand-900">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default function Eventos() {
  return (
    <section
      id="eventos"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <motion.h2
        variants={fadeUp}
        {...revealProps}
        className="font-display mb-4 text-center text-3xl text-brand-900 sm:text-4xl"
      >
        Eventos
      </motion.h2>
      <motion.p
        variants={fadeUp}
        {...revealProps}
        className="mx-auto mb-12 max-w-xl text-center text-brand-900/70"
      >
        Entrenamientos, simposiums y concursos de matemáticas — lo que viene y lo que ya hicimos.
      </motion.p>

      {/* Destacado fijo: el programa recurrente, no es un evento con
          fecha única así que va aparte de la lista. */}
      <motion.div
        variants={fadeUp}
        {...revealProps}
        className="mb-12 flex flex-col items-center gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center shadow-sm sm:flex-row sm:text-left"
      >
        <motion.span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-2xl"
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          📐
        </motion.span>
        <div>
          <h3 className="font-semibold text-brand-900">Cursos de matemáticas — todos los sábados</h3>
          <p className="text-sm text-brand-900/60">
            Abiertos a cualquier nivel, no se requiere experiencia previa.
          </p>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer(0.1)} {...revealProps}>
        <EventCarousel eventos={EVENTOS} />
      </motion.div>
    </section>
  )
}
