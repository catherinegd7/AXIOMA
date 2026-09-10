import { useEffect, useMemo, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// ---------------------------------------------------------------------------
// ESQUELETO GENERAL DE ESTE ARCHIVO (para orientarse antes de leer el código
// real más abajo):
//
//   1. Configuración: dirección de la API + helper apiFetch() para hablar
//      con el backend (fetch + manejo de errores en un solo lugar).
//   2. Constantes de filtros (AÑOS, TEMAS, TIPOS) — igual que antes.
//   3. FilterGroup       -> la lista de checkboxes de un filtro.
//   4. AuthInlineForm    -> formulario de login/registro, se muestra dentro
//                           del modal cuando nadie ha iniciado sesión.
//   5. ComentarioItem    -> un comentario ya publicado.
//   6. ProblemaModal     -> el modal de un problema: enunciado + comentarios.
//   7. Problemas         -> el componente principal: pide los problemas a la
//                           API, aplica los filtros, dibuja la tabla y decide
//                           qué modal mostrar. Antes leía todo de un array
//                           escrito a mano (PROBLEMAS); ahora ese array ya no
//                           existe — los datos vienen de la base de datos.
// ---------------------------------------------------------------------------

// Dirección del backend. En desarrollo, Vite expone las variables que
// empiezan con VITE_ dentro de import.meta.env — viene de tu archivo .env.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Aquí es donde guardamos la sesión en el navegador para que no se pierda
// al recargar la página (localStorage sobrevive a un refresh; el estado de
// React no).
const AUTH_STORAGE_KEY = 'axioma_auth'

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

// Una fila del árbol de carpetas: se dibuja a sí misma, y luego se dibuja a
// sí misma otra vez por cada hijo (con depth+1) — así es como un árbol se
// vuelve una lista de casillas con sangría creciente, sin importar cuántos
// niveles tenga en realidad.
function CategoryTreeNode({ nodo, depth, seleccionadas, onToggle }) {
  return (
    <div>
      <label
        className="flex items-center gap-2 text-sm text-brand-600"
        style={{ paddingLeft: `${depth * 14}px` }}
      >
        <input
          type="checkbox"
          checked={seleccionadas.includes(nodo._id)}
          onChange={() => onToggle(nodo._id)}
          className="h-4 w-4 rounded border-brand-300"
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-100 p-4">
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
          className="rounded-lg border border-brand-300 px-3 py-2 text-sm"
        />
      )}
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="rounded-lg border border-brand-300 px-3 py-2 text-sm"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className="rounded-lg border border-brand-300 px-3 py-2 text-sm"
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {enviando ? 'Un momento...' : modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}
        </button>
        <button
          type="button"
          onClick={() => setModo(modo === 'login' ? 'signup' : 'login')}
          className="text-sm text-brand-600 underline"
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
  return (
    <div className="rounded-lg border border-brand-200 bg-brand-50 p-3">
      <div className="mb-1 flex items-start justify-between gap-3">
        <p className="text-xs font-semibold text-brand-900">
          {comentario.author?.username || 'Usuario'}{' '}
          <span className="font-normal text-brand-400">· {fecha}</span>
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-problema"
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-brand-50 p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 id="titulo-modal-problema" className="text-xl font-semibold text-brand-900">
            {problema.titulo}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-400 hover:text-brand-900"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 text-sm text-brand-500">
          {problema.codigo} · {problema.tema} · {problema.tipo} · {problema.año}
        </p>
        {/* div, no <p>: una fórmula en "display mode" se renderiza como un
            <div>, y un <div> no puede vivir legalmente dentro de un <p> en
            HTML (el mismo tipo de error que se ve en Contacto.jsx). */}
        <div className="mb-6 whitespace-pre-line text-brand-700">
          {renderEnunciado(problema.enunciado)}
        </div>

        <div className="flex-1 overflow-y-auto">
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

        <div className="mt-4">
          {auth ? (
            <form onSubmit={handleEnviarComentario} className="flex flex-col gap-2">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe un comentario..."
                rows={3}
                maxLength={2000}
                className="rounded-lg border border-brand-300 px-3 py-2 text-sm"
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
                  className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
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

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 flex flex-col items-center gap-2 text-center">
        <h2 className="text-3xl font-bold text-brand-900 sm:text-4xl">
          Archivo de Problemas
        </h2>
        {auth && (
          <p className="text-sm text-brand-500">
            Conectado como <strong>{auth.user.username}</strong> ·{' '}
            <button onClick={handleLogout} className="underline">
              cerrar sesión
            </button>
          </p>
        )}
      </div>

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
          <CategoryFilter
            raices={arbolCategorias}
            seleccionadas={categoriasSeleccionadas}
            onToggle={toggle(setCategoriasSeleccionadas)}
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
              {cargando && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-brand-400">
                    Cargando problemas...
                  </td>
                </tr>
              )}

              {!cargando && errorCarga && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-rose-600">
                    No se pudo conectar con el servidor: {errorCarga}
                  </td>
                </tr>
              )}

              {!cargando &&
                !errorCarga &&
                problemasFiltrados.map((problema) => (
                  <tr
                    key={problema._id}
                    onClick={() => setProblemaSeleccionado(problema)}
                    className="cursor-pointer transition-colors hover:bg-brand-100"
                  >
                    <td className="px-4 py-3 font-mono text-brand-500">
                      {problema.codigo}
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

              {!cargando && !errorCarga && problemasFiltrados.length === 0 && (
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
    </section>
  )
}
