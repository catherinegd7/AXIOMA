import { useState } from 'react'

// Sección Galería (id="galeria")
// TODO equipo: reemplazar el array IMAGENES con fotos reales de eventos,
// sesiones de resolución de problemas, competencias, etc.

const IMAGENES = [
  {
    id: 1,
    src: null,
    alt: 'Sesión semanal de resolución de problemas de Axioma',
  },
  {
    id: 2,
    src: null,
    alt: 'Equipo de Axioma en una competencia interuniversitaria',
  },
  {
    id: 3,
    src: null,
    alt: 'Taller de introducción a la combinatoria',
  },
  {
    id: 4,
    src: null,
    alt: 'Integrantes del club en la premiación de una olimpiada',
  },
  {
    id: 5,
    src: null,
    alt: 'Pizarra con la solución de un problema de geometría',
  },
  {
    id: 6,
    src: null,
    alt: 'Reunión general del club Axioma',
  },
]

export default function Galeria() {
  const [imagenActiva, setImagenActiva] = useState(null)

  return (
    <section
      id="galeria"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <h2 className="mb-12 text-center text-3xl font-bold text-brand-900 sm:text-4xl">
        Galería
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {IMAGENES.map((imagen) => (
          <button
            key={imagen.id}
            type="button"
            onClick={() => setImagenActiva(imagen)}
            className="group flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-dashed border-brand-300 bg-brand-100 text-xs text-brand-400 transition-opacity hover:opacity-80"
          >
            {imagen.src ? (
              <img
                src={imagen.src}
                alt={imagen.alt}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="px-3 text-center">{imagen.alt}</span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox / modal simple, sin librería externa */}
      {imagenActiva && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/70 p-4"
          onClick={() => setImagenActiva(null)}
        >
          <div
            className="relative w-full max-w-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setImagenActiva(null)}
              className="absolute -top-10 right-0 text-brand-50 hover:text-brand-200"
              aria-label="Cerrar"
            >
              ✕ Cerrar
            </button>
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-dashed border-brand-300 bg-brand-100 text-sm text-brand-500">
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
          </div>
        </div>
      )}
    </section>
  )
}
