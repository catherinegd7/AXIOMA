import { useEffect, useMemo, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingSymbol from '../components/motion/FloatingSymbol'
import Counter from '../components/motion/Counter'
import { EASE, fadeUp, staggerContainer, popIn } from '../components/motion/variants'

// ---------------------------------------------------------------------------
// ESQUELETO GENERAL DE ESTE ARCHIVO (para orientarse antes de leer el código
// real más abajo):
//
//   1. Configuración: dirección de la API + helper apiFetch() para hablar
//      con el backend (fetch + manejo de errores en un solo lugar).
//   2. Constantes de filtros (AÑOS, TEMAS, TIPOS) + paleta Axioma + la
//      paleta "de material" nueva (madera/pergamino/bambú).
//   3. FilterGroup       -> la lista de opciones de un filtro, como "chips"
//                           de color en vez de checkboxes planos.
//   4. AuthInlineForm    -> formulario de login/registro, se muestra dentro
//                           del modal cuando nadie ha iniciado sesión.
//   5. ComentarioItem    -> un comentario ya publicado.
//   6. ProblemaModal     -> el modal de un problema: enunciado + comentarios,
//                           con animación de entrada/salida.
//   7. ScrollCard        -> el "cascarón" compartido de ProblemaCard y
//                           FolderCard: un botón con look de rollo de
//                           pergamino (barra de madera arriba y abajo).
//   8. ForestBackground   -> el fondo animado de bosque verde (fixed,
//                           detrás de todo): copas en capas, panda(s),
//                           rama, caminito de destellos, hojas cayendo.
//   9. BambooBar          -> la vara de bambú arriba/abajo del sidebar.
//  10. Problemas         -> el componente principal: pide los problemas a la
//                           API, aplica los filtros, dibuja la cuadrícula/
//                           carpetas y decide qué modal mostrar.
//
// Este archivo mantiene exactamente la misma lógica de datos que antes
// (fetch, filtros, autenticación, comentarios) — el rediseño solo cambia
// el JSX/CSS de cómo se ve cada pieza. La estructura (carpetas + hilo por
// problema) sigue inspirada en el foro de AoPS; la temática visual —
// bosque, letrero de madera, tarjetas como pergamino, panda rojo — sigue
// el estilo colorido/animado de Hack the North y un boceto que hizo Elias.
// ---------------------------------------------------------------------------

// Dirección del backend. En desarrollo, Vite expone las variables que
// empiezan con VITE_ dentro de import.meta.env — viene de tu archivo .env.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Aquí es donde guardamos la sesión en el navegador para que no se pierda
// al recargar la página (localStorage sobrevive a un refresh; el estado de
// React no).
const AUTH_STORAGE_KEY = 'axioma_auth'

// Misma paleta que ya usa Hero.jsx para el fondo animado — reutilizarla
// aquí hace que Problemas se sienta parte del mismo sitio, no una página
// aparte con sus propios colores inventados.
const AXIOMA_RED = '#B70B0D'
const AXIOMA_ORANGE = '#E57505'
const AXIOMA_GOLD = '#FFB401'
const AXIOMA_GRADIENT = `linear-gradient(135deg, ${AXIOMA_GOLD} 0%, ${AXIOMA_ORANGE} 45%, ${AXIOMA_RED} 100%)`

// Paleta "de material" para el rediseño tipo mapa del tesoro: madera para
// el letrero y el marco del sidebar, pergamino para las tarjetas (se ven
// como rollos de papel viejo), bambú para las barras del sidebar. Ninguno
// de estos reemplaza los AXIOMA_* de arriba — siguen siendo el color de
// acento (hojas, botones, estampas); estos son solo la "superficie" sobre
// la que se paran.
const WOOD_LIGHT = '#7a4f2e'
const WOOD_MID = '#5c3a22'
const WOOD_DARK = '#3d2817'
const PARCHMENT = '#f3e7c9'
const PARCHMENT_SHADOW = '#e3d0a3'
const BAMBOO = '#b89a5a'
const BAMBOO_DARK = '#8a7040'

// apiFetch centraliza las 3 cosas que se repetirían en cada llamada a la
// API: mandar el body como JSON, agregar el token de sesión si existe, y
// convertir una respuesta de error en un Error de JavaScript normal que se
// pueda atrapar con try/catch.
async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Intentamos leer JSON incluso en errores, porque el backend manda
  // { error: '...' } en sus respuestas de error (ver server/src/routes/*).
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(data?.error || 'Error de red inesperado.')
    error.status = res.status
    throw error
  }
  return data
}

// Un enunciado es texto normal que PUEDE traer fórmulas metidas entre signos
// de pesos, como en LaTeX de verdad: "Sea $a>0$, demuestra que...". Hay dos
// tipos de fórmula, igual que en LaTeX real:
//   $formula$    -> "en línea", metida dentro del párrafo de texto
//   $$formula$$  -> "en pantalla" (display), centrada en su propia línea,
//                   un poco más grande — para ecuaciones importantes
// Primero separamos los bloques $$...$$ (porque si buscáramos $...$ primero,
// cada "$$" se leería mal, como si fueran dos fórmulas vacías pegadas).
// Lo que queda entre bloques display se vuelve a separar por $...$ normal.
//
// katex.renderToString(...) regresa un pedazo de HTML (no JSX) — por eso
// hace falta dangerouslySetInnerHTML para insertarlo. Esto SOLO es seguro
// aquí porque el enunciado viene de datos que nosotros mismos sembramos en
// la base de datos (ver server/src/data/problemasReales.js), no de algo que
// un visitante haya escrito; los comentarios (que sí son texto de
// visitantes) nunca pasan por esta función.
function renderFormulasEnLinea(texto, prefijoKey) {
  const partes = texto.split(/(\$[^$]+\$)/g)
  return partes.map((parte, i) => {
    const esFormula = parte.startsWith('$') && parte.endsWith('$') && parte.length > 1
    if (!esFormula) return <span key={`${prefijoKey}-${i}`}>{parte}</span>

    const latex = parte.slice(1, -1)
    const html = katex.renderToString(latex, { throwOnError: false })
    return <span key={`${prefijoKey}-${i}`} dangerouslySetInnerHTML={{ __html: html }} />
  })
}

function renderEnunciado(texto) {
  const bloques = texto.split(/(\$\$[\s\S]+?\$\$)/g)
  return bloques.map((bloque, i) => {
    const esDisplay = bloque.startsWith('$$') && bloque.endsWith('$$') && bloque.length > 4
    if (!esDisplay) return renderFormulasEnLinea(bloque, i)

    const latex = bloque.slice(2, -2)
    const html = katex.renderToString(latex, { throwOnError: false, displayMode: true })
    return <div key={i} className="my-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
  })
}

const AÑOS = ['2021', '2022', '2023', '2024', '2025', '2026']
const TEMAS = [
  'Álgebra',
  'Álgebra Lineal',
  'Análisis',
  'Combinatoria',
  'Geometría',
  'Probabilidad',
  'Teoría de Números',
]
const TIPOS = ['Putnam', 'OMMU Primera Ronda', 'OMMU Nacional']

// ---------------------------------------------------------------------------
// Carpetas (Category): la API regresa una lista PLANA de carpetas, cada una
// con un campo `parent` (el _id de su carpeta padre, o null si es de nivel
// superior) — así vive guardado en Mongo (ver server/src/models/Category.js).
// Para dibujar un árbol en la pantalla, primero hay que reconstruirlo.
//
// buildCategoryTree convierte esa lista plana en un árbol de verdad: cada
// carpeta obtiene un array `children` con sus subcarpetas ya anidadas.
// También regresa `byId`, un mapa rápido de _id -> carpeta, útil para el
// siguiente paso.
function buildCategoryTree(categorias) {
  const byId = new Map(categorias.map((c) => [c._id, { ...c, children: [] }]))
  const raices = []
  byId.forEach((nodo) => {
    const papa = nodo.parent ? byId.get(nodo.parent) : null
    if (papa) papa.children.push(nodo)
    else raices.push(nodo)
  })
  return { raices, byId }
}

// Si seleccionas la carpeta "Interno Axioma", también quieres ver los
// problemas de "2024" y "2023" adentro — no solo problemas que apunten
// EXACTAMENTE a "Interno Axioma". Esta función regresa el _id de una
// carpeta MÁS los _id de todas sus subcarpetas (a cualquier profundidad).
function collectDescendantIds(nodo) {
  return nodo.children.reduce(
    (ids, hijo) => [...ids, ...collectDescendantIds(hijo)],
    [nodo._id],
  )
}

// Cuántos problemas viven dentro de una carpeta (contando sus subcarpetas
// también) — reutiliza collectDescendantIds de arriba, así que "Putnam"
// cuenta los problemas de TODOS sus años, no solo los que apuntan
// directamente a "Putnam". Se usa para el numerito debajo de cada
// FolderCard (ej. "6 problemas").
function contarProblemas(nodo, problemas) {
  const ids = new Set(collectDescendantIds(nodo))
  return problemas.filter((p) => ids.has(p.category)).length
}

// Colores "estampa" por dificultad — mismo significado de siempre (verde
// fácil, ámbar media, rojo difícil) pero usando el rojo/dorado de la marca
// Axioma en vez de un ámbar/rosa genérico.
const DIFICULTAD_STYLES = {
  Fácil: 'bg-emerald-500 text-white',
  Media: `text-brand-900`,
  Difícil: 'bg-[#B70B0D] text-white',
}
const DIFICULTAD_BG = {
  Media: AXIOMA_GOLD,
}

// Colores de acento por profundidad en el árbol de carpetas — ciclan entre
// los 3 tonos de la marca para que se note visualmente qué tan anidada
// está cada carpeta, sin depender solo de la indentación.
const CATEGORY_ACCENTS = [AXIOMA_RED, AXIOMA_ORANGE, AXIOMA_GOLD]

// Ángulos para que las tarjetas/carpetas NO queden perfectamente
// alineadas — como mapas y recortes de papel tirados sobre una mesa, no
// una cuadrícula prolija. Antes estaban todas en 0° ("paralelas"); ahora
// cada una usa uno de estos valores según su posición en la lista
// (`TILT_VALUES[i % TILT_VALUES.length]`), fijo por índice — mismo
// resultado cada vez que carga la página, no aleatorio de verdad.
const TILT_VALUES = [-2, 3, -1.5, 2.5, -3, 1.5]

// El título que se muestra en pantalla: competencia + año + número de
// problema (ej. "Putnam 2025 — Problema B6"), en vez de la frase
// descriptiva que trae la base de datos en `problema.titulo`. No hace
// falta ningún dato nuevo para esto — `codigo` YA termina en el número
// después del último guion, sin importar cuántos guiones tenga el prefijo
// ("OMMU-NAC-2026-3" o "PUTNAM-2025-B6" ambos funcionan igual).
function formatearTitulo(problema) {
  const numero = problema.codigo.split('-').pop()
  return `${problema.tipo} ${problema.año} — Problema ${numero}`
}

// Un "chip" de filtro: se ve como una pastilla de color. Por dentro sigue
// siendo un <input type="checkbox"> real (oculto con sr-only) para que el
// teclado y los lectores de pantalla lo sigan tratando como una casilla de
// verificación normal — react-facing className solo decide CÓMO se ve.
function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-brand-900">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const activo = selected.includes(option)
          return (
            <label key={option} className="cursor-pointer">
              <input
                type="checkbox"
                checked={activo}
                onChange={() => onToggle(option)}
                className="peer sr-only"
              />
              {/* Tonos térreos (café/amarillo cálido/verde suave) en vez
                  del gradiente rojo-naranja-dorado de marca — pedido
                  explícito para estas pastillas específicamente, para que
                  el sidebar se sienta parchment/bosque de verdad.
                  Los hex están escritos literales (no interpolados desde
                  WOOD_LIGHT/etc.) a propósito: Tailwind arma su CSS
                  ESCANEANDO el código fuente en busca del patrón exacto
                  `border-[#...]`, no ejecutando JavaScript — una clase con
                  un ${'${...}'} adentro de los corchetes no genera nada. */}
              <span
                className={`inline-block select-none rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 active:scale-95 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-900 peer-focus-visible:ring-offset-1 ${
                  activo
                    ? 'border-transparent text-white shadow-md'
                    : 'border-[#7a4f2e]/40 bg-white/70 text-brand-700 hover:border-[#5c3a22] hover:text-[#5c3a22]'
                }`}
                style={
                  activo
                    ? { backgroundImage: `linear-gradient(135deg, ${BAMBOO} 0%, ${WOOD_MID} 55%, ${FOREST_MID} 100%)` }
                    : undefined
                }
              >
                {option}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

// Una fila del árbol de carpetas: se dibuja a sí misma, y luego se dibuja a
// sí misma otra vez por cada hijo (con depth+1) — así es como un árbol se
// vuelve una lista de casillas con sangría creciente, sin importar cuántos
// niveles tenga en realidad. El color de acento y el "punto" relleno vienen
// de `activo`/`depth`, calculados aquí mismo — no hace falta CSS especial.
function CategoryTreeNode({ nodo, depth, seleccionadas, onToggle }) {
  const accent = CATEGORY_ACCENTS[depth % CATEGORY_ACCENTS.length]
  const activo = seleccionadas.includes(nodo._id)
  return (
    <div>
      <label
        className="group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 pr-2 text-sm text-brand-600 transition-all duration-150 hover:translate-x-1 hover:bg-brand-100"
        style={{
          paddingLeft: `${depth * 14 + 8}px`,
          borderLeft: depth > 0 ? `2px solid ${accent}55` : '2px solid transparent',
        }}
      >
        <input
          type="checkbox"
          checked={activo}
          onChange={() => onToggle(nodo._id)}
          className="peer sr-only"
        />
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-transform duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-900 peer-focus-visible:ring-offset-1"
          style={{
            borderColor: accent,
            backgroundColor: activo ? accent : 'transparent',
            transform: activo ? 'scale(1.15)' : 'scale(1)',
          }}
        />
        {nodo.name}
      </label>
      {nodo.children.map((hijo) => (
        <CategoryTreeNode
          key={hijo._id}
          nodo={hijo}
          depth={depth + 1}
          seleccionadas={seleccionadas}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

function CategoryFilter({ raices, seleccionadas, onToggle }) {
  if (raices.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-brand-900">Carpetas</h3>
      <div className="flex flex-col gap-1">
        {raices.map((nodo) => (
          <CategoryTreeNode
            key={nodo._id}
            nodo={nodo}
            depth={0}
            seleccionadas={seleccionadas}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

// Formulario de inicio de sesión / registro. Vive DENTRO del modal en vez de
// en su propia página: agregar una página nueva significaría tocar App.jsx
// (que define las rutas), y ese archivo es compartido con el resto del
// equipo — así que este formulario se muestra en el mismo lugar donde hace
// falta (justo antes de comentar) sin necesitar una ruta nueva.
function AuthInlineForm({ onAuthSuccess }) {
  const [modo, setModo] = useState('login') // 'login' | 'signup'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const path = modo === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const body =
        modo === 'login' ? { email, password } : { username, email, password }
      const data = await apiFetch(path, { method: 'POST', body })
      onAuthSuccess(data) // { token, user } — el componente padre lo guarda
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const inputClass =
    'rounded-lg border border-brand-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#E57505] focus:ring-2 focus:ring-[#E57505]/30'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-brand-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-brand-700">
        {modo === 'login'
          ? 'Inicia sesión para comentar.'
          : 'Crea una cuenta para comentar.'}
      </p>

      {modo === 'signup' && (
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={inputClass}
        />
      )}
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className={inputClass}
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
          style={{ backgroundImage: AXIOMA_GRADIENT }}
        >
          {enviando ? 'Un momento...' : modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}
        </button>
        <button
          type="button"
          onClick={() => setModo(modo === 'login' ? 'signup' : 'login')}
          className="text-sm text-brand-600 underline hover:text-[#E57505]"
        >
          {modo === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}
        </button>
      </div>
    </form>
  )
}

function ComentarioItem({ comentario, esPropio, onEliminar }) {
  const fecha = new Date(comentario.createdAt).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
  const username = comentario.author?.username || 'Usuario'
  return (
    <div className="flex gap-3 rounded-xl border border-brand-200 bg-white p-3 shadow-sm">
      {/* Avatar de iniciales — solo decorativo, no viene de ningún dato
          nuevo, es la primera letra del username que ya teníamos. */}
      <div
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundImage: `linear-gradient(135deg, ${AXIOMA_ORANGE}, ${AXIOMA_GOLD})` }}
      >
        {username.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-3">
          <p className="text-xs font-semibold text-brand-900">
            {username} <span className="font-normal text-brand-400">· {fecha}</span>
          </p>
          {/* Solo el autor ve este botón — el backend también lo exige por su
              cuenta (ver comments.routes.js), esto es solo para no mostrar un
              botón que de todos modos fallaría. */}
          {esPropio && (
            <button
              type="button"
              onClick={onEliminar}
              className="shrink-0 text-xs text-rose-500 hover:underline"
            >
              Eliminar
            </button>
          )}
        </div>
        <p className="text-sm text-brand-700">{comentario.body}</p>
      </div>
    </div>
  )
}

function ProblemaModal({ problema, onClose, auth, onAuthSuccess, onAuthExpired }) {
  // Arranca en `true` a propósito: este componente se desmonta y se vuelve
  // a montar cada vez que se cierra el modal y se abre con OTRO problema
  // (ver más abajo, donde se le pone key={problema._id}), así que "recién
  // montado" siempre significa "todavía no llegaron los comentarios de
  // este problema en particular" — no hace falta resetearlo a mano.
  const [comentarios, setComentarios] = useState([])
  const [cargandoComentarios, setCargandoComentarios] = useState(true)
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [enviandoComentario, setEnviandoComentario] = useState(false)
  const [errorComentario, setErrorComentario] = useState(null)

  useEffect(() => {
    let cancelado = false
    apiFetch(`/api/problems/${problema._id}/comments`)
      .then((data) => {
        if (!cancelado) setComentarios(data)
      })
      .finally(() => {
        if (!cancelado) setCargandoComentarios(false)
      })
    return () => {
      cancelado = true
    }
  }, [problema._id])

  // Cierra el modal con la tecla Escape, además del click afuera que ya
  // existía. Estándar de accesibilidad para cualquier modal: alguien
  // navegando con teclado (o sin mouse) necesita una forma de salir.
  useEffect(() => {
    function alPresionarTecla(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', alPresionarTecla)
    return () => window.removeEventListener('keydown', alPresionarTecla)
  }, [onClose])

  const handleEliminarComentario = async (commentId) => {
    try {
      await apiFetch(`/api/problems/${problema._id}/comments/${commentId}`, {
        method: 'DELETE',
        token: auth.token,
      })
      setComentarios((prev) => prev.filter((c) => c._id !== commentId))
    } catch (err) {
      if (err.status === 401) onAuthExpired()
      // Un 403/404 aquí sería raro (alguien más lo borró en otra pestaña,
      // por ejemplo) — no vale la pena una UI especial para ese caso.
    }
  }

  const handleEnviarComentario = async (event) => {
    event.preventDefault()
    const body = nuevoComentario.trim()
    if (!body) return

    setEnviandoComentario(true)
    setErrorComentario(null)
    try {
      const comentario = await apiFetch(`/api/problems/${problema._id}/comments`, {
        method: 'POST',
        token: auth.token,
        body: { body },
      })
      setComentarios((prev) => [...prev, comentario])
      setNuevoComentario('')
    } catch (err) {
      if (err.status === 401) {
        // El token guardado ya no sirve (expiró o es inválido): cerramos la
        // sesión localmente para que vuelva a aparecer el formulario de
        // login en vez de un botón de comentar que siempre falla.
        onAuthExpired()
      } else {
        setErrorComentario(err.message)
      }
    } finally {
      setEnviandoComentario(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.25, ease: EASE }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-problema"
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#FFFBF5] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Franja de color: mismo gradiente de marca que el resto de la
            página, para que el modal se sienta parte del mismo sistema. */}
        <div className="h-1.5 w-full shrink-0" style={{ backgroundImage: AXIOMA_GRADIENT }} />

        <div className="flex min-h-0 flex-1 flex-col p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h3 id="titulo-modal-problema" className="text-xl font-semibold text-brand-900">
              {formatearTitulo(problema)}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-brand-400 transition-transform hover:scale-110 hover:text-brand-900"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          {/* codigo/tipo/año ya no se repiten aquí: formatearTitulo() de
              arriba ya los dice todos — lo único que faltaba es el tema. */}
          <p className="mb-4">
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-500">{problema.tema}</span>
          </p>
          {/* div, no <p>: una fórmula en "display mode" se renderiza como un
              <div>, y un <div> no puede vivir legalmente dentro de un <p> en
              HTML (el mismo tipo de error que se ve en Contacto.jsx). */}
          <div className="mb-6 whitespace-pre-line text-brand-700">
            {renderEnunciado(problema.enunciado)}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <h4 className="mb-2 text-sm font-semibold text-brand-900">Comentarios</h4>

            {cargandoComentarios && (
              <p className="text-sm text-brand-400">Cargando comentarios...</p>
            )}

            {!cargandoComentarios && comentarios.length === 0 && (
              <p className="text-sm text-brand-400">Sé el primero en comentar.</p>
            )}

            <div className="flex flex-col gap-2">
              {comentarios.map((c) => (
                <ComentarioItem
                  key={c._id}
                  comentario={c}
                  esPropio={Boolean(auth && c.author?._id === auth.user.id)}
                  onEliminar={() => handleEliminarComentario(c._id)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 shrink-0">
            {auth ? (
              <form onSubmit={handleEnviarComentario} className="flex flex-col gap-2">
                <textarea
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  placeholder="Escribe un comentario..."
                  rows={3}
                  maxLength={2000}
                  className="rounded-lg border border-brand-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#E57505] focus:ring-2 focus:ring-[#E57505]/30"
                />
                {errorComentario && (
                  <p className="text-sm text-rose-600">{errorComentario}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-400">
                    {nuevoComentario.length}/2000
                  </span>
                  <button
                    type="submit"
                    disabled={enviandoComentario}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
                    style={{ backgroundImage: AXIOMA_GRADIENT }}
                  >
                    {enviandoComentario ? 'Enviando...' : 'Comentar'}
                  </button>
                </div>
              </form>
            ) : (
              <AuthInlineForm onAuthSuccess={onAuthSuccess} />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Una tarjeta de la cuadrícula de problemas — reemplaza la fila de tabla
// que había antes. `tilt` es un ángulo (en grados) para la animación de
// entrada (popIn) — hoy siempre se llama con 0 (tarjetas paralelas entre
// sí, alineadas prolijamente), pero queda como parámetro por si algún día
// se quiere volver a ladear alguna. Al pasar el mouse se levanta un poco
// (whileHover), inspirado en las tarjetas de hackthenorth.com.
function ProblemaCard({ problema, tilt, onOpen }) {
  const dificultadClass = DIFICULTAD_STYLES[problema.dificultad]
  const dificultadBg = DIFICULTAD_BG[problema.dificultad]

  return (
    <ScrollCard tilt={tilt} onClick={() => onOpen(problema)} className="flex flex-col gap-3 px-5 pb-8 pt-9">
      {/* codigo/tipo/año ya no van aquí como etiquetas sueltas: el título
          de abajo (formatearTitulo) ya dice competencia + año + número.
          Lo único que sigue haciendo falta a simple vista es el tema. */}
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-brand-700">
          {problema.tema}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm ${dificultadClass}`}
          style={dificultadBg ? { backgroundColor: dificultadBg } : undefined}
        >
          {problema.dificultad}
        </span>
      </div>

      <h3 className="font-display text-base font-semibold text-brand-900 transition-colors group-hover:text-[#B70B0D]">
        {formatearTitulo(problema)}
      </h3>
    </ScrollCard>
  )
}

// ---------------------------------------------------------------------------
// Vista de carpetas, estilo AoPS (artofproblemsolving.com/community/c13_
// contests): en vez de mostrar los 93 problemas de golpe al entrar a la
// página, se navega por carpetas — Putnam / OMMU Primera Ronda / OMMU
// Nacional primero, luego el año adentro de cada una, y solo AL FINAL los
// problemas de verdad. Es la MISMA jerarquía que ya arma buildCategoryTree
// para el árbol del sidebar (ver arriba) — esto solo la dibuja distinto:
// como carpetas para navegar en vez de casillas para filtrar.
// ---------------------------------------------------------------------------

// El "cascarón" compartido entre FolderCard y ProblemaCard: los dos son
// botones con el mismo look de "rollo de pergamino" (una barra de madera
// enrollada arriba y otra abajo, cuerpo de pergamino en medio) — solo
// cambia lo que llevan adentro. Sacar esto a su propio componente evita
// repetir las mismas líneas de estilo dos veces.
function ScrollCard({ tilt, onClick, className = '', children }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={popIn(tilt)}
      whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative overflow-hidden rounded-md text-left shadow-md shadow-black/10 transition-shadow duration-200 hover:shadow-xl hover:shadow-black/20 ${className}`}
      style={{
        // Viñeta sutil: más oscuro en las esquinas que en el centro, como
        // un papel viejo de verdad en vez de un color plano.
        backgroundImage: `radial-gradient(ellipse at 50% 45%, ${PARCHMENT} 45%, ${PARCHMENT_SHADOW} 100%)`,
      }}
    >
      {/* Las "barras enrolladas": solo un degradado de madera arriba y
          abajo. El padding del contenido (pt-9/pb-8, ver los usos) deja
          espacio de sobra para que nunca se encimen con el texto. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-4"
        style={{ backgroundImage: `linear-gradient(180deg, ${WOOD_LIGHT}, ${WOOD_DARK})` }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-4"
        style={{ backgroundImage: `linear-gradient(180deg, ${WOOD_DARK}, ${WOOD_LIGHT})` }}
      />
      {children}
    </motion.button>
  )
}

// Una carpeta clickeable: nombre + cuántos problemas tiene adentro (contando
// subcarpetas). Visualmente es a propósito MUY distinta de ProblemaCard
// (ícono grande y centrado en vez de título+dificultad) para que se sienta
// de inmediato como "esto te lleva más adentro", no "esto abre un problema".
function FolderCard({ nodo, count, color, tilt, onOpen }) {
  return (
    <ScrollCard
      tilt={tilt}
      onClick={() => onOpen(nodo._id)}
      className="flex flex-col items-center gap-2 px-5 pb-8 pt-9 text-center"
    >
      {/* Ícono de carpeta rústico — antes era un SVG genérico de
          "carpeta de oficina"; esto ahora es un placeholder para el
          dibujo hecho a mano de la referencia. `tint` colorea el fondo
          circular con el mismo acento (rojo/naranja/dorado) que ya usaba
          el ícono plano, así que las 3 carpetas se siguen distinguiendo
          por color aunque el PNG real todavía no exista. */}
      <PlaceholderImg
        src="/assets/problemas/folder-icon.png"
        alt=""
        tint={color}
        className="h-14 w-14 rounded-full transition-transform group-hover:scale-110"
      />
      <h3 className="font-display text-lg font-semibold text-brand-900 transition-colors group-hover:text-[#B70B0D]">
        {nodo.name}
      </h3>
      <span className="text-xs text-brand-600">
        {count} {count === 1 ? 'problema' : 'problemas'}
      </span>
    </ScrollCard>
  )
}

// Migas de pan ("Inicio / Putnam / 2021") para volver a una carpeta de
// arriba sin tener que salir por completo. El último tramo (dónde estás
// parado ahora) no es un botón, los anteriores sí.
function Breadcrumb({ ruta, onNavigate }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5 text-sm">
      {ruta.map((item, i) => {
        const esUltimo = i === ruta.length - 1
        return (
          <span key={item._id ?? 'inicio'} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-brand-300">/</span>}
            {esUltimo ? (
              <span className="font-semibold text-brand-900">{item.name}</span>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate(item._id)}
                className="text-brand-500 transition-colors hover:text-[#E57505] hover:underline"
              >
                {item.name}
              </button>
            )}
          </span>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Fondo: textura de bosque + hojas cayendo, separadas en DOS piezas.
//
// La versión anterior tenía un solo `fixed` con árboles pintados a mano
// en SVG/CSS. Dos problemas que Elias marcó: (1) "el fondo se desvanece"
// — como era `fixed` (ligado a la VENTANA), en una lista larga (93
// problemas es mucho scroll) solo se veía bosque rico cerca de arriba; el
// resto del scroll mostraba siempre el mismo degradado apagándose hacia
// crema, una y otra vez. (2) los pandas dibujados con círculos/óvalos no
// se parecían al boceto pintado que compartió.
//
// Esta versión resuelve ambas cosas distinto:
//   - ForestBackground (fondo, `absolute` no `fixed`): ahora mide el alto
//     de TODA la sección en vez de solo la ventana — crece con el
//     contenido, así que hay bosque en cualquier punto del scroll, no
//     solo al principio. La textura de árboles es un `background-image`
//     en mosaico (se repite), no formas dibujadas a mano: un mosaico no
//     necesita saber qué tan alta es la página.
//   - FallingLeaves (hojas, sigue en `fixed`): a las hojas SÍ les
//     conviene seguir ligadas a la ventana — es un efecto ambiente barato
//     que se ve "fresco" sin importar cuánto hayas bajado.
//   - Las ilustraciones (panda, rama, props) ya NO son SVG a mano — son
//     <img> con rutas a /assets/problemas/..., listas para que Elias
//     ponga el arte real ahí (ver PlaceholderImg más abajo y
//     SceneDecorations, junto a Problemas()).
// ---------------------------------------------------------------------------
const FOREST_MID = '#2f6b3a'
const FOREST_DEEP = '#1c4227'
const FOREST_DEEPEST = '#0d2114'

// Café/rojizo oscuro que sigue haciendo falta para una de las tonalidades
// de las hojas que caen.
const RUSTY_BROWN = '#7a2e12'

const LEAF_COLORS = [AXIOMA_RED, AXIOMA_ORANGE, AXIOMA_GOLD, RUSTY_BROWN]
const LEAVES = [
  { left: '4%', delay: 0, duration: 13, size: 18, drift: 40 },
  { left: '14%', delay: 3, duration: 16, size: 14, drift: 30 },
  { left: '24%', delay: 6, duration: 12, size: 20, drift: 50 },
  { left: '36%', delay: 1.5, duration: 15, size: 16, drift: 35 },
  { left: '48%', delay: 5, duration: 14, size: 18, drift: 45 },
  { left: '60%', delay: 2, duration: 17, size: 15, drift: 30 },
  { left: '72%', delay: 7, duration: 13, size: 19, drift: 40 },
  { left: '82%', delay: 4, duration: 16, size: 14, drift: 35 },
  { left: '90%', delay: 0.5, duration: 12, size: 17, drift: 42 },
  { left: '55%', delay: 9, duration: 18, size: 13, drift: 28 },
].map((hoja, i) => ({ ...hoja, color: LEAF_COLORS[i % LEAF_COLORS.length] }))

// Una hoja cayendo: el mismo truco que FloatingSymbol.jsx (loop infinito
// con una transición separada por propiedad), pero cayendo de arriba a
// abajo de la ventana en vez de flotar en un solo punto. Usamos `vh` para
// `y`: como el contenedor padre es `fixed` (mide exactamente la ventana),
// esto siempre va de "justo arriba de lo visible" a "justo abajo de lo
// visible" sin importar en qué parte de la página esté la ventana.
function FallingLeaf({ left, delay, duration, size, color, drift }) {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="absolute top-0"
      style={{ left }}
      initial={{ y: '-10vh', opacity: 0 }}
      animate={{
        y: '115vh',
        x: [0, drift, -drift * 0.6, 0],
        rotate: [0, 30, -25, 10, 0],
        opacity: [0, 1, 1, 0.9, 0],
      }}
      transition={{
        y: { duration, repeat: Infinity, ease: 'linear', delay },
        x: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        rotate: { duration: duration * 0.85, repeat: Infinity, ease: 'easeInOut', delay },
        opacity: { duration, repeat: Infinity, ease: 'linear', delay, times: [0, 0.08, 0.85, 1] },
      }}
    >
      <path d="M12 2C7 6 4 11 4 15a8 8 0 0 0 16 0c0-4-3-9-8-13z" fill={color} />
      <path d="M12 3v18" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
    </motion.svg>
  )
}

// Hojas cayendo, en su propia capa `fixed` — ver la nota grande de arriba
// de por qué esto vive separado de ForestBackground.
function FallingLeaves() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {LEAVES.map((hoja, i) => (
        <FallingLeaf key={i} {...hoja} />
      ))}
    </div>
  )
}

// Una <img> con un relleno de color de respaldo: mientras no exista el
// archivo real en /assets/problemas/, el navegador mostraría el ícono feo
// de "imagen rota" — con onError lo escondemos y queda solo un bloque
// suave del color indicado (`tint`), que se siente a propósito en vez de
// roto. Cuando el PNG de verdad exista (la mayoría van a tener fondo
// transparente), se dibuja encima y el color de respaldo queda como una
// especie de resplandor detrás del personaje/objeto.
function PlaceholderImg({ src, alt = '', tint = AXIOMA_ORANGE, className = '', imgClassName = '' }) {
  const [rota, setRota] = useState(false)
  return (
    <div className={`overflow-hidden rounded-2xl ${className}`} style={{ backgroundColor: `${tint}26` }}>
      {!rota && (
        <img
          src={src}
          alt={alt}
          onError={() => setRota(true)}
          className={`h-full w-full object-contain ${imgClassName}`}
        />
      )}
    </div>
  )
}

// La mascota: un panda rojo. Antes era círculos y óvalos de SVG dibujados
// a mano — Elias marcó que "se ven raros" comparados con el boceto
// pintado que compartió, y calcar una ilustración de verdad con formas
// geométricas simples tiene un techo bajo. Esto ahora es un <img>
// placeholder: hay que generar el arte real (mismo estilo que el boceto)
// y guardarlo en la ruta que indica `src` — ver SceneDecorations más
// abajo para qué rutas/poses hacen falta. `delay` desfasa el balanceo
// suave para que, si hay más de un panda en pantalla, no se muevan en
// sincronía perfecta.
function RedPandaMascot({ src, alt = 'Panda rojo', tint, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -5, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <PlaceholderImg src={src} alt={alt} tint={tint} className="h-full w-full" />
    </motion.div>
  )
}

function ForestBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 isolate overflow-hidden" aria-hidden="true">
      {/* Lavado de color: verde pálido arriba -> verde bosque profundo
          abajo. Al ser `absolute` (no `fixed`), este degradado se estira
          sobre TODO el alto de la sección — en una lista corta (la vista
          de carpetas) solo se alcanza a ver la parte pálida de arriba; en
          una lista larga (93 problemas filtrados) se recorre más lento,
          pero SIEMPRE es bosque, nunca se "apaga" hacia crema plana. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, #eef5e6 0%, ${FOREST_MID} 55%, ${FOREST_DEEP} 85%, ${FOREST_DEEPEST} 100%)`,
        }}
      />

      {/* Textura de árboles/hojas/enredaderas en mosaico — reemplacen
          esta ruta por una textura sin costura que se repita bien. Un
          mosaico (background-repeat) en vez de <img>: no tiene "un
          tamaño", cubre cualquier alto de página sin necesitar una
          imagen gigante ni saber de antemano qué tan larga es. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/assets/problemas/forest-pattern.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '440px auto',
        }}
      />

      {/* Sol filtrándose entre las hojas, cerca de arriba nada más — un
          brillo dorado que respira despacio. */}
      <motion.div
        className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${AXIOMA_GOLD}55 0%, transparent 70%)` }}
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.07, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// Una "vara" de bambú — se usa arriba y abajo del sidebar, como si el
// panel de filtros fuera un pergamino enrollado en dos varas (mismo
// espíritu que ScrollCard, con bambú en vez de madera lisa). Las rayitas
// oscuras son las uniones entre segmentos de una caña de bambú de verdad.
function BambooBar({ redondeo }) {
  return (
    <div
      className={`relative h-5 w-full shrink-0 shadow-sm ${redondeo}`}
      style={{ backgroundImage: `linear-gradient(180deg, ${BAMBOO}, ${BAMBOO_DARK})` }}
    >
      {[12, 34, 56, 78].map((left) => (
        <div
          key={left}
          className="absolute top-1/2 h-3.5 w-[3px] -translate-y-1/2 rounded-full bg-black/20"
          style={{ left: `${left}%` }}
        />
      ))}
    </div>
  )
}

// Destellos de un caminito de puntos — el guiño "mapa del tesoro". Cada
// uno parpadea solo (opacity en loop), barato de animar: nada de blur,
// nada de layout, solo opacidad.
const SPARKLES = [
  { left: '4%', top: '58%', size: 14, delay: 0 },
  { left: '30%', top: '20%', size: 10, delay: 1.2 },
  { left: '68%', top: '48%', size: 16, delay: 2.4 },
  { left: '90%', top: '12%', size: 11, delay: 0.6 },
]

function Sparkle({ left, top, size, delay }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="absolute text-white"
      style={{ left, top, width: size, height: size }}
      animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.8, 1, 0.8] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay }}
      aria-hidden="true"
    >
      <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="currentColor" />
    </motion.svg>
  )
}

// La "escena" decorativa: rama + 3 pandas + caminito de destellos + los
// props de la referencia (tocadiscos, cámara, lirios, bandera). A
// diferencia de ForestBackground (que cubre TODA la sección), esto vive
// en flujo normal DENTRO de la vista de carpetas (ver su montaje en
// Problemas() — solo con vista === 'carpetas', absolute contra ESE div),
// así que aparece una sola vez, superpuesto sobre la fila de carpetas,
// sin tener que adivinar qué tan larga es la página completa.
//
// z-20 + pointer-events-none en el contenedor: por encima de las
// tarjetas (que son position:relative pero sin z-index propio, o sea
// "z-auto" — un z-20 explícito siempre les gana en el orden de pintado)
// para que los props/pandas puedan superponerse a sus bordes como pediste,
// pero sin bloquearles el click (los eventos de mouse pasan de largo).
// Oculto por debajo de `lg`: en pantallas chicas cada pixel importa más,
// mejor no competir con las tarjetas.
function SceneDecorations() {
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-10 z-20 hidden h-80 overflow-visible lg:block" aria-hidden="true">
      <img
        src="/assets/problemas/branch.png"
        alt=""
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        className="absolute left-[18%] top-10 h-10 w-[48%] object-contain opacity-90"
      />

      <RedPandaMascot
        src="/assets/problemas/red-panda-branch.png"
        alt="Panda rojo sobre la rama"
        tint={AXIOMA_ORANGE}
        className="absolute left-1/2 top-2 h-32 w-32 -translate-x-1/2 drop-shadow-lg"
      />
      <RedPandaMascot
        src="/assets/problemas/red-panda-2.png"
        alt="Panda rojo asomado entre las hojas"
        tint={AXIOMA_GOLD}
        delay={2.3}
        className="absolute left-[1%] top-44 h-20 w-20 drop-shadow-md"
      />
      <RedPandaMascot
        src="/assets/problemas/red-panda-3.png"
        alt="Panda rojo curioso"
        tint={AXIOMA_RED}
        delay={4.1}
        className="absolute right-[3%] top-52 h-16 w-16 drop-shadow-md"
      />

      <svg className="absolute inset-x-0 bottom-6 h-32 w-full opacity-80" viewBox="0 0 400 100" preserveAspectRatio="none">
        <path
          d="M15 85 Q90 45 160 62 T300 32 T385 58"
          fill="none"
          stroke={PARCHMENT}
          strokeWidth="3"
          strokeDasharray="2 11"
          strokeLinecap="round"
        />
      </svg>
      {SPARKLES.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}

      {/* Props de la referencia — tocadiscos, cámara, lirios de agua,
          bandera de meta al final del caminito. */}
      <PlaceholderImg
        src="/assets/problemas/record-player.png"
        alt=""
        tint={WOOD_MID}
        className="absolute left-[6%] bottom-0 h-16 w-16 rounded-xl"
      />
      <PlaceholderImg
        src="/assets/problemas/camera.png"
        alt=""
        tint={FOREST_DEEP}
        className="absolute left-[40%] bottom-2 h-14 w-14 rounded-xl"
      />
      <PlaceholderImg
        src="/assets/problemas/water-lily.png"
        alt=""
        tint={FOREST_MID}
        className="absolute left-[23%] bottom-[-0.5rem] h-10 w-14 rounded-full"
      />
      <PlaceholderImg
        src="/assets/problemas/water-lily.png"
        alt=""
        tint={FOREST_MID}
        className="absolute right-[18%] bottom-0 h-8 w-12 rounded-full"
      />
      <PlaceholderImg
        src="/assets/problemas/flag.png"
        alt=""
        tint={AXIOMA_RED}
        className="absolute right-[5%] bottom-0 h-16 w-10 rounded-md"
      />
    </div>
  )
}

export default function Problemas() {
  const [problemas, setProblemas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)

  const [años, setAños] = useState([])
  const [temas, setTemas] = useState([])
  const [tipos, setTipos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([])
  const [problemaSeleccionado, setProblemaSeleccionado] = useState(null)

  // Qué carpeta se está navegando ahora mismo en la vista tipo AoPS (null
  // = en la raíz, viendo Putnam / OMMU Primera Ronda / OMMU Nacional).
  // Esto es INDEPENDIENTE de categoriasSeleccionadas de arriba: ese es el
  // filtro de casillas del sidebar (puede marcar varias carpetas a la
  // vez); esto es "en qué carpeta estoy parado ahora" (una sola, como
  // carpetas de verdad en una computadora).
  const [carpetaActual, setCarpetaActual] = useState(null)

  // auth arranca leyendo lo que haya guardado en localStorage, para que si
  // ya habías iniciado sesión antes, sigas logueado después de recargar la
  // página. Si no hay nada guardado (o está corrupto), arranca en null.
  const [auth, setAuth] = useState(() => {
    try {
      const guardado = localStorage.getItem(AUTH_STORAGE_KEY)
      return guardado ? JSON.parse(guardado) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    apiFetch('/api/problems')
      .then(setProblemas)
      .catch((err) => setErrorCarga(err.message))
      .finally(() => setCargando(false))

    // Las carpetas se piden aparte: si esta llamada falla, preferimos que
    // la tabla de problemas siga funcionando (solo sin filtro de carpetas)
    // en vez de tumbar toda la página.
    apiFetch('/api/categories')
      .then(setCategorias)
      .catch(() => setCategorias([]))
  }, [])

  // Reconstruye el árbol de carpetas cada vez que cambia la lista de
  // categorías (normalmente solo una vez, al cargar la página).
  const { raices: arbolCategorias, byId: categoriasPorId } = useMemo(
    () => buildCategoryTree(categorias),
    [categorias],
  )

  // "Efectivas" = las carpetas que el usuario marcó, YA expandidas para
  // incluir todas sus subcarpetas. Esto es lo que realmente se compara
  // contra problema.category al filtrar.
  const categoriasEfectivas = useMemo(() => {
    const ids = new Set()
    categoriasSeleccionadas.forEach((id) => {
      const nodo = categoriasPorId.get(id)
      if (nodo) collectDescendantIds(nodo).forEach((d) => ids.add(d))
    })
    return ids
  }, [categoriasSeleccionadas, categoriasPorId])

  const handleAuthSuccess = (data) => {
    setAuth(data)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
  }

  const handleLogout = () => {
    setAuth(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const toggle = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )

  const problemasFiltrados = useMemo(() => {
    return problemas.filter((p) => {
      if (años.length && !años.includes(p.año)) return false
      if (temas.length && !temas.includes(p.tema)) return false
      if (tipos.length && !tipos.includes(p.tipo)) return false
      // Igual que los demás filtros: si no se seleccionó ninguna carpeta,
      // no filtra nada. Si se seleccionó alguna, el problema debe caer
      // dentro de esa carpeta o de alguna de sus subcarpetas.
      if (categoriasSeleccionadas.length && !categoriasEfectivas.has(p.category)) {
        return false
      }
      return true
    })
  }, [problemas, años, temas, tipos, categoriasSeleccionadas, categoriasEfectivas])

  // Estadística para el contador animado del encabezado — se calcula sola
  // a partir de los problemas ya cargados, no es un dato nuevo. (Antes
  // también había un "éxito promedio" aquí; se quitó por ambiguo — no
  // queda claro promedio de qué exactamente sin abrir cada problema.)
  const temasCubiertos = useMemo(() => new Set(problemas.map((p) => p.tema)).size, [problemas])

  // Llave que cambia cada vez que cambia algún filtro. Se la damos como
  // `key` a la cuadrícula de tarjetas: cuando React ve una key distinta,
  // desmonta la cuadrícula vieja y monta una nueva, lo que hace que la
  // animación de entrada (staggerContainer) se repita en cada filtrado en
  // vez de jugarse una sola vez al cargar la página.
  const filtrosKey = useMemo(
    () => JSON.stringify({ años, temas, tipos, categoriasSeleccionadas }),
    [años, temas, tipos, categoriasSeleccionadas],
  )

  // -------------------------------------------------------------------
  // Navegación por carpetas (vista tipo AoPS)
  // -------------------------------------------------------------------

  // Si hay CUALQUIER filtro del sidebar marcado, ese filtro manda: se ve
  // la cuadrícula plana de siempre (problemasFiltrados), sin importar en
  // qué carpeta estén — es lo que uno espera al pedir "todos los de
  // Álgebra". Las carpetas son solo la pantalla de bienvenida para cuando
  // TODAVÍA no se pidió ningún filtro.
  const hayFiltrosActivos =
    años.length > 0 || temas.length > 0 || tipos.length > 0 || categoriasSeleccionadas.length > 0

  // El nodo de la carpeta que se está viendo ahora mismo (null si estamos
  // en la raíz). Es solo una búsqueda en un Map, no hace falta useMemo.
  const carpetaAbierta = carpetaActual ? categoriasPorId.get(carpetaActual) : null

  // Si la carpeta abierta tiene hijos, esas son las subcarpetas a
  // mostrar (un nivel más adentro). Si NO tiene hijos (una hoja, ej.
  // "2021"), ya no hay más carpetas — ahí es donde viven los problemas.
  const subcarpetas = carpetaAbierta ? carpetaAbierta.children : arbolCategorias
  const esCarpetaHoja = Boolean(carpetaAbierta) && carpetaAbierta.children.length === 0

  const problemasDeCarpeta = useMemo(() => {
    if (!esCarpetaHoja) return []
    return problemas.filter((p) => p.category === carpetaActual)
  }, [problemas, carpetaActual, esCarpetaHoja])

  // Migas de pan: sube por los `.parent` de la carpeta actual hasta la
  // raíz, para poder dibujar "Inicio / Putnam / 2021".
  const rutaCarpeta = useMemo(() => {
    const cadena = []
    let nodo = carpetaAbierta
    while (nodo) {
      cadena.unshift(nodo)
      nodo = nodo.parent ? categoriasPorId.get(nodo.parent) : null
    }
    return [{ _id: null, name: 'Inicio' }, ...cadena]
  }, [carpetaAbierta, categoriasPorId])

  // Qué se dibuja en el área principal, en una sola variable en vez de
  // repetir las mismas condiciones varias veces en el JSX de abajo:
  //  - 'filtros'   -> hay un filtro activo (o no hay categorías todavía,
  //                   ej. si ese endpoint falló): cuadrícula plana.
  //  - 'carpetas'  -> sin filtros, viendo una lista de carpetas.
  //  - 'problemas' -> sin filtros, adentro de una carpeta hoja.
  const vista =
    hayFiltrosActivos || arbolCategorias.length === 0
      ? 'filtros'
      : esCarpetaHoja
        ? 'problemas'
        : 'carpetas'

  // relative: ForestBackground es `absolute inset-0` y necesita esta
  // sección como su "regla" de alto — así crece automáticamente con el
  // contenido (93 problemas filtrados es una sección MUY alta) en vez de
  // quedarse del tamaño de una sola pantalla.
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <ForestBackground />
      <FallingLeaves />

      {/* Encabezado: letrero de madera, como si colgara de la rama de la
          escena decorativa de abajo (SceneDecorations). El degradado CSS
          queda de respaldo EN el propio div (se ve aunque falte el PNG);
          la <img> de textura se dibuja encima y, si 404, se esconde sola
          (onError) para no dejar el ícono de "imagen rota" sobre el
          letrero. */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative mb-12 overflow-hidden rounded-2xl px-6 py-10 text-center shadow-2xl shadow-black/40 sm:px-10"
        style={{
          backgroundImage: `radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,255,255,0.12), transparent 70%), repeating-linear-gradient(90deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 2px, transparent 2px, transparent 64px), linear-gradient(180deg, ${WOOD_LIGHT} 0%, ${WOOD_MID} 55%, ${WOOD_DARK} 100%)`,
        }}
      >
        <img
          src="/assets/problemas/wood-sign.png"
          alt=""
          aria-hidden="true"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        {/* Panda asomado en la esquina del letrero, tal como lo pediste —
            placeholder <img> absoluto arriba a la izquierda. */}
        <PlaceholderImg
          src="/assets/problemas/red-panda-sign.png"
          alt="Panda rojo asomado en el letrero"
          tint={AXIOMA_GOLD}
          className="absolute left-3 top-3 z-10 h-16 w-16 rounded-full sm:left-5 sm:top-5 sm:h-20 sm:w-20"
        />

        {/* Cuerdas: dos lazos simples arriba, como si el letrero colgara
            de algo por encima. */}
        <svg className="pointer-events-none absolute -top-4 left-10 h-9 w-7" viewBox="0 0 24 32" aria-hidden="true">
          <path d="M6 32V12c0-5.5 4.5-10 10-10" fill="none" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
        </svg>
        <svg className="pointer-events-none absolute -top-4 right-10 h-9 w-7 scale-x-[-1]" viewBox="0 0 24 32" aria-hidden="true">
          <path d="M6 32V12c0-5.5 4.5-10 10-10" fill="none" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
        </svg>

        <FloatingSymbol symbol="∑" className="pointer-events-none absolute left-[8%] top-[18%] text-3xl text-[#FFB401]/40 sm:text-4xl" delay={0} duration={7} rotate={-6} />
        <FloatingSymbol symbol="π" className="pointer-events-none absolute right-[10%] top-[22%] text-3xl text-[#E57505]/40 sm:text-4xl" delay={0.5} duration={6} rotate={6} />
        <FloatingSymbol symbol="∞" className="pointer-events-none absolute left-[14%] bottom-[16%] text-2xl text-[#FFB401]/30 sm:text-3xl" delay={0.9} duration={8} rotate={4} />
        <FloatingSymbol symbol="√" className="pointer-events-none absolute right-[16%] bottom-[18%] text-2xl text-[#E57505]/30 sm:text-3xl" delay={1.2} duration={6.5} rotate={-5} />

        <div className="relative flex flex-col items-center gap-3">
          <span
            className="bg-clip-text text-xs font-semibold uppercase tracking-[0.35em] text-transparent"
            style={{ backgroundImage: AXIOMA_GRADIENT }}
          >
            Colección de problemas
          </span>
          {/* font-display: reusa 'Yeseva One', la misma fuente que ya
              carga index.html para el resto del sitio (Hero, etc.) — un
              toque más "letrero tallado" sin tener que agregar una fuente
              nueva ni tocar index.html/index.css (archivos compartidos). */}
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Archivo de Problemas</h2>
          <p className="max-w-xl text-sm text-white/70">
            Explora, filtra y comenta problemas de competencias — cada uno es un hilo abierto para discutir.
          </p>

          {auth && (
            <p className="mt-1 rounded-full bg-white/10 px-4 py-1 text-xs text-white/80 backdrop-blur">
              Conectado como <strong className="text-white">{auth.user.username}</strong> ·{' '}
              <button onClick={handleLogout} className="underline underline-offset-2 hover:text-white">
                cerrar sesión
              </button>
            </p>
          )}

          {!cargando && !errorCarga && problemas.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <div className="flex flex-col items-center">
                <Counter value={problemas.length} className="text-2xl font-bold text-white sm:text-3xl" />
                <span className="text-[11px] uppercase tracking-wide text-white/60">Problemas</span>
              </div>
              <div className="flex flex-col items-center">
                <Counter value={temasCubiertos} className="text-2xl font-bold text-white sm:text-3xl" />
                <span className="text-[11px] uppercase tracking-wide text-white/60">Temas</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar de filtros — misma estructura y lógica de siempre
            (Año / Tema / Tipo / Carpetas), ahora como un pergamino
            enrollado entre dos varas de bambú. Se queda fija (sticky) al
            hacer scroll por la cuadrícula de problemas.

            Por qué son 3 piezas (bambú / contenido / bambú) en vez de un
            solo panel: el marco de bambú necesita quedarse QUIETO como
            marco, mientras que el contenido (que puede medir más que la
            pantalla — Año + Tema + Tipo + Carpetas juntos) necesita su
            propio scroll interno. Metiendo el md:overflow-y-auto en el
            <aside> completo, el bambú de abajo se hubiera ido con el
            scroll y solo se vería al llegar al final de la lista — el
            mismo problema que ya resolvimos una vez, ver el commit
            anterior. Separando el bambú del contenido, el marco se queda
            fijo y solo lo de adentro se desplaza. */}
        <motion.aside
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="self-start shadow-lg shadow-black/20 md:sticky md:top-28"
        >
          <BambooBar redondeo="rounded-t-lg" />
          <div
            className="flex flex-col gap-6 px-5 py-4 md:max-h-[calc(100vh-10.5rem)] md:overflow-y-auto"
            style={{ backgroundColor: PARCHMENT }}
          >
            <div className="flex items-center gap-2 border-b border-black/10 pb-3">
              <span className="font-serif text-lg italic text-[#B70B0D]">∫</span>
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-brand-900">Explorar</h2>
            </div>
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
            <CategoryFilter
              raices={arbolCategorias}
              seleccionadas={categoriasSeleccionadas}
              onToggle={toggle(setCategoriasSeleccionadas)}
            />
          </div>
          <BambooBar redondeo="rounded-b-lg" />
        </motion.aside>

        {/* Área principal: cuadrícula de tarjetas si hay un filtro activo,
            o si no, la vista de carpetas estilo AoPS (ver `vista` arriba).
            relative: SceneDecorations (rama, pandas, props) se posiciona
            absolute contra ESTE div, no contra toda la sección — así solo
            hace falta reservar espacio para "la fila de carpetas", no
            adivinar el alto de toda la página. */}
        <div className="relative min-w-0">
          {vista === 'carpetas' && <SceneDecorations />}

          {cargando && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-[#FFFBF5]/95 py-16 text-brand-400">
              Cargando problemas...
            </div>
          )}

          {!cargando && errorCarga && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-rose-300 bg-rose-50 px-6 py-16 text-center text-rose-600">
              No se pudo conectar con el servidor: {errorCarga}
            </div>
          )}

          {/* Migas de pan: solo tienen sentido navegando carpetas, y solo
              una vez que ya se entró a alguna (rutaCarpeta.length > 1 —
              en la raíz, rutaCarpeta es nada más [{name:'Inicio'}]). */}
          {!cargando && !errorCarga && vista !== 'filtros' && rutaCarpeta.length > 1 && (
            <Breadcrumb ruta={rutaCarpeta} onNavigate={setCarpetaActual} />
          )}

          {!cargando && !errorCarga && vista === 'filtros' && problemasFiltrados.length === 0 && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-[#FFFBF5]/95 py-16 text-brand-400">
              No hay problemas que coincidan con los filtros.
            </div>
          )}

          {!cargando && !errorCarga && vista === 'filtros' && problemasFiltrados.length > 0 && (
            <motion.div
              key={filtrosKey}
              variants={staggerContainer(0.04)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {problemasFiltrados.map((problema, i) => (
                <ProblemaCard
                  key={problema._id}
                  problema={problema}
                  tilt={TILT_VALUES[i % TILT_VALUES.length]}
                  onOpen={setProblemaSeleccionado}
                />
              ))}
            </motion.div>
          )}

          {/* Vista de carpetas: Putnam / OMMU Primera Ronda / OMMU Nacional
              en la raíz, o las subcarpetas (años) de la que se abrió. */}
          {!cargando && !errorCarga && vista === 'carpetas' && (
            <motion.div
              key={carpetaActual ?? 'raiz'}
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {subcarpetas.map((nodo, i) => (
                <FolderCard
                  key={nodo._id}
                  nodo={nodo}
                  count={contarProblemas(nodo, problemas)}
                  color={CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length]}
                  tilt={TILT_VALUES[i % TILT_VALUES.length]}
                  onOpen={setCarpetaActual}
                />
              ))}
            </motion.div>
          )}

          {/* Adentro de una carpeta hoja (ej. "2021"): ya no hay más
              carpetas, aquí es donde por fin se ven los problemas. */}
          {!cargando && !errorCarga && vista === 'problemas' && problemasDeCarpeta.length === 0 && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-[#FFFBF5]/95 py-16 text-brand-400">
              Esta carpeta todavía no tiene problemas.
            </div>
          )}

          {!cargando && !errorCarga && vista === 'problemas' && problemasDeCarpeta.length > 0 && (
            <motion.div
              key={carpetaActual}
              variants={staggerContainer(0.04)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {problemasDeCarpeta.map((problema, i) => (
                <ProblemaCard
                  key={problema._id}
                  problema={problema}
                  tilt={TILT_VALUES[i % TILT_VALUES.length]}
                  onOpen={setProblemaSeleccionado}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {problemaSeleccionado && (
          <ProblemaModal
            key={problemaSeleccionado._id}
            problema={problemaSeleccionado}
            onClose={() => setProblemaSeleccionado(null)}
            auth={auth}
            onAuthSuccess={handleAuthSuccess}
            onAuthExpired={handleLogout}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
