import { useEffect, useMemo, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { motion, AnimatePresence } from 'framer-motion'
import { MeshGradient } from '@paper-design/shaders-react'
import FloatingSymbol from '../components/motion/FloatingSymbol'
import Counter from '../components/motion/Counter'
import { EASE, fadeUp, staggerContainer, popIn } from '../components/motion/variants'

// ---------------------------------------------------------------------------
// ESQUELETO GENERAL DE ESTE ARCHIVO (para orientarse antes de leer el código
// real más abajo):
//
//   1. Configuración: dirección de la API + helper apiFetch() para hablar
//      con el backend (fetch + manejo de errores en un solo lugar).
//   2. Constantes de filtros (AÑOS, TEMAS, TIPOS) + paleta Axioma reutilizada
//      del Hero (rojo/naranja/dorado) para el rediseño visual.
//   3. FilterGroup       -> la lista de opciones de un filtro, ahora como
//                           "chips" de color en vez de checkboxes planos.
//   4. AuthInlineForm    -> formulario de login/registro, se muestra dentro
//                           del modal cuando nadie ha iniciado sesión.
//   5. ComentarioItem    -> un comentario ya publicado.
//   6. ProblemaModal     -> el modal de un problema: enunciado + comentarios,
//                           ahora con animación de entrada/salida.
//   7. ProblemaCard      -> una tarjeta de la cuadrícula de problemas (antes
//                           era una fila de tabla).
//   8. Problemas         -> el componente principal: pide los problemas a la
//                           API, aplica los filtros, dibuja la cuadrícula y
//                           decide qué modal mostrar.
//
// Este archivo mantiene exactamente la misma lógica de datos que antes
// (fetch, filtros, autenticación, comentarios) — el rediseño solo cambia
// el JSX/CSS de cómo se ve cada pieza, inspirado en el foro de AoPS
// (estructura de carpetas + hilo por problema, que ya teníamos) y en el
// estilo visual de Hack the North (color, movimiento, tarjetas "ladeadas").
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
const AXIOMA_DARK = '#120303'
const AXIOMA_GRADIENT = `linear-gradient(135deg, ${AXIOMA_GOLD} 0%, ${AXIOMA_ORANGE} 45%, ${AXIOMA_RED} 100%)`

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
              <span
                className={`inline-block select-none rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 active:scale-95 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-900 peer-focus-visible:ring-offset-1 ${
                  activo
                    ? 'border-transparent text-white shadow-md'
                    : 'border-brand-300 bg-white text-brand-600 hover:border-[#E57505] hover:text-[#E57505]'
                }`}
                style={activo ? { backgroundImage: AXIOMA_GRADIENT } : undefined}
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
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-brand-50 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Franja de color: mismo gradiente de marca que el resto de la
            página, para que el modal se sienta parte del mismo sistema. */}
        <div className="h-1.5 w-full shrink-0" style={{ backgroundImage: AXIOMA_GRADIENT }} />

        <div className="flex min-h-0 flex-1 flex-col p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h3 id="titulo-modal-problema" className="text-xl font-semibold text-brand-900">
              {problema.titulo}
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
          <p className="mb-4 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-brand-100 px-2 py-0.5 font-mono text-xs text-brand-500">
              {problema.codigo}
            </span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-500">{problema.tema}</span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-500">{problema.tipo}</span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-500">{problema.año}</span>
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
// que había antes. `tilt` es un pequeño ángulo (en grados) que la deja
// "ladeada" como una nota pegada en un pizarrón; al pasar el mouse se
// endereza y se levanta un poco (whileHover), inspirado en las tarjetas de
// hackthenorth.com.
function ProblemaCard({ problema, tilt, onOpen }) {
  const dificultadClass = DIFICULTAD_STYLES[problema.dificultad]
  const dificultadBg = DIFICULTAD_BG[problema.dificultad]

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(problema)}
      variants={popIn(tilt)}
      whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="group flex flex-col gap-3 rounded-2xl border border-brand-200 bg-white p-5 text-left shadow-sm transition-shadow duration-200 hover:shadow-xl hover:shadow-brand-900/10"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md bg-brand-100 px-2 py-0.5 font-mono text-xs text-brand-500">
          {problema.codigo}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm ${dificultadClass}`}
          style={dificultadBg ? { backgroundColor: dificultadBg } : undefined}
        >
          {problema.dificultad}
        </span>
      </div>

      <h3 className="text-base font-semibold text-brand-900 transition-colors group-hover:text-[#B70B0D]">
        {problema.titulo}
      </h3>

      <div className="flex flex-wrap gap-1.5 text-[11px] text-brand-500">
        <span className="rounded-full bg-brand-100 px-2 py-0.5">{problema.tema}</span>
        <span className="rounded-full bg-brand-100 px-2 py-0.5">{problema.tipo}</span>
        <span className="rounded-full bg-brand-100 px-2 py-0.5">{problema.año}</span>
      </div>

      {/* Barra de % de éxito: crece de 0 al valor real cuando la tarjeta
          aparece — el mismo tipo de animación "cuenta hacia arriba" que ya
          usa <Counter> en el Hero, pero como barra en vez de número. */}
      <div className="mt-1 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-100">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundImage: AXIOMA_GRADIENT }}
            initial={{ width: 0 }}
            animate={{ width: `${problema.exito}%` }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </div>
        <span className="text-xs font-medium text-brand-500">{problema.exito}%</span>
      </div>
    </motion.button>
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

  // Estadísticas para los contadores animados del encabezado — se calculan
  // solas a partir de los problemas ya cargados, no son datos nuevos.
  const temasCubiertos = useMemo(() => new Set(problemas.map((p) => p.tema)).size, [problemas])
  const exitoPromedio = useMemo(() => {
    if (problemas.length === 0) return 0
    return Math.round(problemas.reduce((suma, p) => suma + p.exito, 0) / problemas.length)
  }, [problemas])

  // Llave que cambia cada vez que cambia algún filtro. Se la damos como
  // `key` a la cuadrícula de tarjetas: cuando React ve una key distinta,
  // desmonta la cuadrícula vieja y monta una nueva, lo que hace que la
  // animación de entrada (staggerContainer) se repita en cada filtrado en
  // vez de jugarse una sola vez al cargar la página.
  const filtrosKey = useMemo(
    () => JSON.stringify({ años, temas, tipos, categoriasSeleccionadas }),
    [años, temas, tipos, categoriasSeleccionadas],
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      {/* Encabezado: mismo fondo shader animado que el Hero (MeshGradient +
          símbolos flotantes), a menor escala — así la página de Problemas
          se siente parte del mismo sitio en vez de una página aparte. */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative mb-12 overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-10"
        style={{ backgroundColor: AXIOMA_DARK }}
      >
        <div className="pointer-events-none absolute inset-0">
          <MeshGradient
            className="absolute inset-0 h-full w-full"
            colors={[AXIOMA_RED, AXIOMA_ORANGE, AXIOMA_GOLD, AXIOMA_DARK]}
            speed={0.25}
            distortion={0.7}
            swirl={0.25}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#120303]/70 via-[#120303]/40 to-[#120303]/85" />
        </div>

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
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Archivo de Problemas</h2>
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
              <div className="flex flex-col items-center">
                <Counter value={exitoPromedio} suffix="%" className="text-2xl font-bold text-white sm:text-3xl" />
                <span className="text-[11px] uppercase tracking-wide text-white/60">Éxito promedio</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar de filtros — misma estructura y lógica de siempre
            (Año / Tema / Tipo / Carpetas), solo con look nuevo. Se queda
            fija (sticky) al hacer scroll por la cuadrícula de problemas. */}
        <motion.aside
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex flex-col gap-6 self-start rounded-2xl border border-brand-200 bg-brand-50 p-5 md:sticky md:top-28"
        >
          <div className="flex items-center gap-2 border-b border-brand-200 pb-3">
            <span className="font-serif text-lg italic text-[#E57505]">∫</span>
            <h2 className="text-sm font-bold uppercase tracking-wide text-brand-900">Explorar</h2>
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
        </motion.aside>

        {/* Cuadrícula de tarjetas (antes era una tabla) */}
        <div className="min-w-0">
          {cargando && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-brand-50 py-16 text-brand-400">
              Cargando problemas...
            </div>
          )}

          {!cargando && errorCarga && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-rose-300 bg-rose-50 px-6 py-16 text-center text-rose-600">
              No se pudo conectar con el servidor: {errorCarga}
            </div>
          )}

          {!cargando && !errorCarga && problemasFiltrados.length === 0 && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-brand-50 py-16 text-brand-400">
              No hay problemas que coincidan con los filtros.
            </div>
          )}

          {!cargando && !errorCarga && problemasFiltrados.length > 0 && (
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
                  tilt={i % 2 === 0 ? -1.2 : 1.2}
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
