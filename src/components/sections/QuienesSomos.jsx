import { useInView } from '../../hooks/useInView'

// Sección Quiénes Somos (id="quienes-somos")
// TODO equipo: reemplazar el texto de misión/visión y la imagen grupal
// por el contenido real del club.

export default function QuienesSomos() {
  const [ref, isInView] = useInView({ threshold: 0.2 })

  return (
    <section
      id="quienes-somos"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <div
        ref={ref}
        className={`grid items-center gap-12 transition-all duration-700 ease-out md:grid-cols-2 ${
          isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-brand-900 sm:text-4xl">
            ¿Qué es Axioma?
          </h2>
          <p className="text-brand-600">
            Axioma es el club de matemáticas del Tec de Monterrey. Reunimos a
            estudiantes apasionados por resolver problemas, prepararnos para
            competencias y compartir el gusto por las matemáticas fuera del
            salón de clases. (Texto placeholder — reemplazar con misión y
            visión reales.)
          </p>
          <p className="text-brand-600">
            Nuestra visión es construir una comunidad donde cualquier persona,
            sin importar su nivel, encuentre un espacio para aprender,
            practicar y crecer junto a otros entusiastas de las matemáticas.
          </p>
        </div>

        {/* Espacio para imagen grupal */}
        <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-brand-100 text-sm text-brand-400">
          Espacio para imagen grupal
        </div>
      </div>
    </section>
  )
}
