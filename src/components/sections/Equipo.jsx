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

function MemberCard({ miembro }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center shadow-sm">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-dashed border-brand-300 bg-brand-100 text-xs text-brand-400">
        {miembro.foto ? (
          <img
            src={miembro.foto}
            alt={miembro.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          'Foto'
        )}
      </div>
      <div>
        <h3 className="font-semibold text-brand-900">{miembro.nombre}</h3>
        <p className="text-sm text-brand-500">{miembro.rol}</p>
      </div>
      <div className="flex gap-3 text-sm text-brand-600">
        <a
          href={miembro.linkedin}
          target="_blank"
          rel="noreferrer"
          className="hover:text-brand-900"
        >
          LinkedIn
        </a>
        <a
          href={miembro.github}
          target="_blank"
          rel="noreferrer"
          className="hover:text-brand-900"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}

export default function Equipo() {
  return (
    <section
      id="equipo"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <h2 className="mb-12 text-center text-3xl font-bold text-brand-900 sm:text-4xl">
        Conoce al Equipo
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MIEMBROS.map((miembro) => (
          <MemberCard key={miembro.id} miembro={miembro} />
        ))}
      </div>
    </section>
  )
}
