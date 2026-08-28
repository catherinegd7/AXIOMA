import { motion } from 'framer-motion'
import { fadeUp, revealProps, staggerContainer } from '../motion/variants'

// Sección Equipo (id="equipo")
// TODO equipo: reemplazar los datos de MIEMBROS con la información real
// (foto, nombre, rol, links) de cada integrante.

const MIEMBROS = [
  {
    id: 1,
    nombre: 'Nombre Apellido',
    rol: 'Presidencia',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 2,
    nombre: 'Nombre Apellido',
    rol: 'Vicepresidencia',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 3,
    nombre: 'Nombre Apellido',
    rol: 'Coordinación de Problemas',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 4,
    nombre: 'Nombre Apellido',
    rol: 'Coordinación de Eventos',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 5,
    nombre: 'Nombre Apellido',
    rol: 'Difusión',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 6,
    nombre: 'Nombre Apellido',
    rol: 'Tesorería',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
]

// Rotación sutil y determinística por id, para que la grid no se
// sienta perfectamente cuadriculada (efecto "recorte" tipo scrapbook).
const cardTilt = (id) => ((id % 3) - 1) * 1.5

function MemberCard({ miembro }) {
  return (
    <motion.div
      variants={fadeUp}
      initial={{ rotate: cardTilt(miembro.id) }}
      whileHover={{ y: -8, rotate: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center shadow-sm transition-shadow hover:shadow-xl hover:shadow-brand-600/10"
    >
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-dashed border-brand-300 bg-brand-100 text-xs text-brand-400">
        {miembro.foto ? (
          <img
            src={miembro.foto}
            alt={miembro.nombre}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          'Foto'
        )}
      </div>
      <div>
        <h3 className="font-semibold text-brand-900">{miembro.nombre}</h3>
        <p className="text-sm text-brand-900/60">{miembro.rol}</p>
      </div>
      <div className="flex gap-3 text-sm text-brand-900/60">
        <a
          href={miembro.linkedin}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-brand-600"
        >
          LinkedIn
        </a>
        <a
          href={miembro.github}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-brand-600"
        >
          GitHub
        </a>
      </div>
    </motion.div>
  )
}

export default function Equipo() {
  return (
    <section
      id="equipo"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <motion.h2
        variants={fadeUp}
        {...revealProps}
        className="font-display mb-12 text-center text-3xl text-brand-900 sm:text-4xl"
      >
        Conoce al Equipo
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer(0.08)}
        {...revealProps}
      >
        {MIEMBROS.map((miembro) => (
          <MemberCard key={miembro.id} miembro={miembro} />
        ))}
      </motion.div>
    </section>
  )
}
