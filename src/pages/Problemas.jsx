import { useMemo, useState } from 'react'
// KaTeX ya está instalado como dependencia (ver package.json).
// TODO equipo: cuando los problemas incluyan LaTeX, usar katex.renderToString(...)
// (o el paquete react-katex) para renderizar el enunciado/opciones dentro del modal.
// Ejemplo: import katex from 'katex'; import 'katex/dist/katex.min.css'

const AÑOS = ['2024', '2023', '2022']
const TEMAS = ['Álgebra', 'Combinatoria', 'Geometría', 'Teoría de Números']
const TIPOS = ['AMC', 'Putnam', 'Interno Axioma', 'Olimpiada Estatal']

const PROBLEMAS = [
  {
    id: 'P-001',
    titulo: 'Suma de raíces de un polinomio cúbico',
    año: '2024',
    tema: 'Álgebra',
    tipo: 'Interno Axioma',
    dificultad: 'Media',
    exito: 62,
    enunciado:
      'Placeholder del enunciado del problema. Aquí eventualmente se renderizará LaTeX con KaTeX.',
  },
  {
    id: 'P-002',
    titulo: 'Conteo de caminos en una cuadrícula',
    año: '2023',
    tema: 'Combinatoria',
    tipo: 'AMC',
    dificultad: 'Fácil',
    exito: 81,
    enunciado: 'Placeholder del enunciado del problema.',
  },
  {
    id: 'P-003',
    titulo: 'Ángulos en un triángulo inscrito',
    año: '2024',
    tema: 'Geometría',
    tipo: 'Olimpiada Estatal',
    dificultad: 'Difícil',
    exito: 34,
    enunciado: 'Placeholder del enunciado del problema.',
  },
  {
    id: 'P-004',
    titulo: 'Divisibilidad y congruencias',
    año: '2022',
    tema: 'Teoría de Números',
    tipo: 'Putnam',
    dificultad: 'Difícil',
    exito: 28,
    enunciado: 'Placeholder del enunciado del problema.',
  },
  {
    id: 'P-005',
    titulo: 'Desigualdad AM-GM aplicada',
    año: '2023',
    tema: 'Álgebra',
    tipo: 'Interno Axioma',
    dificultad: 'Media',
    exito: 55,
    enunciado: 'Placeholder del enunciado del problema.',
  },
]

const DIFICULTAD_STYLES = {
  Fácil: 'bg-emerald-100 text-emerald-700',
  Media: 'bg-amber-100 text-amber-700',
  Difícil: 'bg-rose-100 text-rose-700',
}

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-brand-900">{title}</h3>
      <div className="flex flex-col gap-1">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 text-sm text-brand-600"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4 rounded border-brand-300"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  )
}

export default function Problemas() {
  const [años, setAños] = useState([])
  const [temas, setTemas] = useState([])
  const [tipos, setTipos] = useState([])
  const [problemaSeleccionado, setProblemaSeleccionado] = useState(null)

  const toggle = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )

  const problemasFiltrados = useMemo(() => {
    return PROBLEMAS.filter((p) => {
      if (años.length && !años.includes(p.año)) return false
      if (temas.length && !temas.includes(p.tema)) return false
      if (tipos.length && !tipos.includes(p.tipo)) return false
      return true
    })
  }, [años, temas, tipos])

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <h2 className="mb-12 text-center text-3xl font-bold text-brand-900 sm:text-4xl">
        Archivo de Problemas
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        {/* Sidebar de filtros */}
        <aside className="flex flex-col gap-6 rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <FilterGroup
            title="Año"
            options={AÑOS}
            selected={años}
            onToggle={toggle(setAños)}
          />
          <FilterGroup
            title="Tema"
            options={TEMAS}
            selected={temas}
            onToggle={toggle(setTemas)}
          />
          <FilterGroup
            title="Tipo de concurso"
            options={TIPOS}
            selected={tipos}
            onToggle={toggle(setTipos)}
          />
        </aside>

        {/* Tabla central */}
        <div className="overflow-x-auto rounded-2xl border border-brand-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-brand-100 text-brand-700">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Título</th>
                <th className="px-4 py-3 font-semibold">Dificultad</th>
                <th className="px-4 py-3 font-semibold">% de éxito</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200 bg-brand-50">
              {problemasFiltrados.map((problema) => (
                <tr
                  key={problema.id}
                  onClick={() => setProblemaSeleccionado(problema)}
                  className="cursor-pointer transition-colors hover:bg-brand-100"
                >
                  <td className="px-4 py-3 font-mono text-brand-500">
                    {problema.id}
                  </td>
                  <td className="px-4 py-3 text-brand-900">{problema.titulo}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${DIFICULTAD_STYLES[problema.dificultad]}`}
                    >
                      {problema.dificultad}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-600">{problema.exito}%</td>
                </tr>
              ))}
              {problemasFiltrados.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-brand-400">
                    No hay problemas que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal placeholder */}
      {problemaSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/50 p-4"
          onClick={() => setProblemaSeleccionado(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-brand-50 p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-brand-900">
                {problemaSeleccionado.titulo}
              </h3>
              <button
                type="button"
                onClick={() => setProblemaSeleccionado(null)}
                className="text-brand-400 hover:text-brand-900"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-sm text-brand-500">
              {problemaSeleccionado.id} · {problemaSeleccionado.tema} ·{' '}
              {problemaSeleccionado.tipo} · {problemaSeleccionado.año}
            </p>
            {/* TODO equipo: renderizar problemaSeleccionado.enunciado con KaTeX aquí */}
            <p className="text-brand-700">{problemaSeleccionado.enunciado}</p>
          </div>
        </div>
      )}
    </section>
  )
}
