# Axioma — Club de Matemáticas del Tec de Monterrey

![CI](https://github.com/catherinegd7/AXIOMA/actions/workflows/ci.yml/badge.svg)

Sitio construido con **React + Vite**, **Tailwind CSS** y **React Router**.
Es un híbrido: un one-pager con navegación por anclas (scroll suave) para la
mayoría del contenido, más páginas independientes con rutas reales para
contenido que no tiene sentido como sección scrolleable (por ahora,
`/problemas`).

## Cómo correr el proyecto

### Solo el frontend (lo de siempre)

```bash
npm install
npm run dev
```

### Frontend + backend (necesario para `/problemas`)

`/problemas` ahora lee datos reales de una base de datos (Mongo) a través de
un backend en Express — ya no es un array escrito a mano. Para correr todo
localmente:

1. **Instala MongoDB una sola vez** (macOS, con [Homebrew](https://brew.sh)):
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community mongosh
   brew services start mongodb-community
   ```
2. **Crea tu `.env`** copiando `.env.example` y generando tu propia clave:
   ```bash
   cp .env.example .env
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   # pega el resultado como valor de JWT_SECRET en tu .env
   ```
3. **Instala dependencias y llena la base de datos** (93 problemas reales de Putnam y la OMMU, ver `server/src/data/problemasReales.js`):
   ```bash
   npm install
   npm run seed
   ```
4. **Corre ambos servidores** (en dos terminales separadas):
   ```bash
   npm run server   # backend, http://localhost:4000
   npm run dev      # frontend, http://localhost:5173
   ```

`npm run seed` es seguro de correr más de una vez: limpia categorías,
problemas y comentarios viejos antes de volver a crearlos (las cuentas de
usuario NO se borran).

### Pruebas del backend

```bash
npm run test
```

Corre contra el mismo Mongo local, pero en una base separada
(`axioma_test`) que se limpia sola entre cada prueba — nunca toca los datos
reales de `axioma`. Este mismo comando corre automáticamente en GitHub
Actions en cada push/PR (ver el badge arriba y `.github/workflows/ci.yml`),
junto con `npm run lint` y `npm run build`.

## Dos "modos" de contenido

- **Secciones del one-pager** — viven en `/src/components/sections/`. Se
  renderizan todas juntas dentro de `HomePage.jsx` (ruta `/`) y se navega a
  ellas con scroll suave, vía anclas (`id="..."`) y los links del Navbar.
- **Páginas independientes** — viven en `/src/pages/`. Cada una es una ruta
  real de React Router (ej. `/problemas`) con su propio contenido y su propio
  `<Navbar />`. No forman parte del scroll del one-pager.

`Problemas.jsx` sigue siendo el componente con todo el contenido (filtros,
tabla, modal), solo que ya no es una sección scrolleable: ahora vive en
`/src/pages/Problemas.jsx` y se renderiza dentro de `ProblemasPage.jsx`, que
es lo que la ruta `/problemas` realmente monta.

## Estructura de carpetas

```
/src
  /components
    Navbar.jsx              # Fijo arriba en todas las rutas. Combina links
                             # de scroll (one-pager) y un <Link> real a /problemas
    /sections
      Hero.jsx               # id="inicio"
      QuienesSomos.jsx       # id="quienes-somos"
      Equipo.jsx             # id="equipo"
      Galeria.jsx            # id="galeria"
      Contacto.jsx           # id="contacto"
  /pages
    HomePage.jsx             # Ruta "/" — Navbar + todas las secciones del one-pager
    ProblemasPage.jsx        # Ruta "/problemas" — Navbar + Problemas.jsx
    Problemas.jsx            # Contenido de la página de problemas
  /hooks
    useInView.js             # Hook de Intersection Observer para animaciones
  App.jsx                    # Solo define <BrowserRouter> y las <Route>
  index.css                  # Tailwind + paleta de colores + scroll-behavior
```

También existe `/server` — el backend en Express + MongoDB que sirve la
página de Problemas (categorías, problemas y comentarios). Ver "Cómo correr
el proyecto" arriba para levantarlo localmente.

```
/server/src
  app.js                  # Arma la app de Express (rutas, cors, rate limit) —
                           # sin conectar a Mongo ni escuchar en un puerto
  server.js               # El entry point real: conecta Mongo + app.listen()
  seed.js                 # Llena la base de datos con el contenido de /data
  test-setup.js           # Conecta a una base de datos aparte para las pruebas
  /data
    problemasReales.js    # 93 problemas reales (Putnam, OMMU) — agregar más
                           # problemas es editar este archivo, no seed.js
  /models                 # Blueprints de Mongoose: User, Category, Problem, Comment
  /routes                 # auth, categories, problems, comments
  /middleware
    auth.js               # Bloquea rutas que requieren sesión iniciada
  /__tests__              # Pruebas con vitest + supertest (npm run test)
```

## Cómo funciona la navegación del Navbar

El Navbar (`src/components/Navbar.jsx`) es compartido y **no deben
modificarlo sin avisar al equipo**, pero vale la pena entender su
comportamiento:

- Si ya estás en `/`, los links de sección (Inicio, Quiénes Somos, Equipo,
  Galería, Contacto) hacen `scrollIntoView` directo.
- Si estás en otra ruta (ej. `/problemas`), esos mismos links navegan a `/`
  pasando el id de la sección por `state` (`navigate('/', { state: { scrollTo: id } })`).
  `HomePage.jsx` lee ese `state` en un `useEffect` al montarse y hace el
  scroll una vez que el one-pager ya está renderizado.
- El link "Problemas" es un `<Link to="/problemas">` normal de React Router,
  no un scroll.

## Reglas de trabajo (para evitar conflictos de Git)

Cada persona del equipo trabaja **únicamente dentro de su archivo de sección
o página**: `/src/components/sections/*.jsx` o `/src/pages/*.jsx` (sin
contar `HomePage.jsx`). Esto permite que todos trabajen en paralelo sin
pisarse el código entre sí.

- ✅ Editen libremente el archivo de su sección o página.
- ✅ Si necesitan un componente reutilizable propio de su sección, créenlo
  dentro de la misma carpeta o en una subcarpeta (ej.
  `sections/equipo/MemberCard.jsx`) y expórtenlo desde ahí.
- 🚫 No modifiquen `App.jsx` — solo define las rutas, no debe llevar lógica
  ni contenido.
- 🚫 No modifiquen `HomePage.jsx` — solo importa y ordena las secciones del
  one-pager.
- 🚫 No modifiquen el archivo de sección/página de otra persona.
- 🚫 Si necesitan cambiar algo compartido (`Navbar.jsx`, `index.css`, la
  paleta de colores, componentes globales), avisen al equipo antes de tocarlo
  para evitar pisar el trabajo de alguien más.

## Notas por sección/página

- **Hero**: título, subtítulo, botón CTA que navega a `/problemas` (ruta,
  no scroll), placeholder para animación/logo 3D y flecha de scroll animada.
- **QuienesSomos**: misión/visión placeholder, imagen grupal placeholder y
  animación fade-in-up al hacer scroll (usa el hook `useInView`).
- **Equipo**: grid responsive de tarjetas a partir del array `MIEMBROS`
  (foto, nombre, rol, LinkedIn/GitHub).
- **Galería**: grid responsive de imágenes placeholder (array `IMAGENES`) que
  abren un lightbox/modal simple al hacer click, sin librería externa.
- **Problemas** (`/src/pages/Problemas.jsx`, montado en `/problemas`):
  sidebar de filtros (año, tema, tipo) y tabla, ahora alimentados por el
  backend (`GET /api/problems`) en vez de un array escrito a mano. El modal
  de cada problema muestra sus comentarios y permite escribir uno nuevo (o
  borrar los tuyos) — para comentar hace falta iniciar sesión, con un
  formulario de login/registro que aparece dentro del propio modal (no se
  agregó una ruta nueva a propósito, para no tocar `App.jsx`). Además hay
  una carpeta anidada
  ("Carpetas" en el sidebar) que refleja las categorías de la base de
  datos. El enunciado se renderiza con **KaTeX**: cualquier parte del texto
  entre signos de pesos (`$...$`) se trata como LaTeX real (ver
  `renderEnunciado` dentro del archivo).
- **Contacto**: formulario controlado (Nombre, Correo, Mensaje) sin lógica de
  envío todavía — ver el `TODO` en `handleSubmit`.

## Paleta de colores

La paleta neutra provisional vive en `src/index.css` bajo el bloque
`@theme` (`--color-brand-50` a `--color-brand-900`). Úsenla con las clases
`bg-brand-*`, `text-brand-*`, `border-brand-*`, etc. Cuando el club defina su
identidad visual, solo hay que actualizar esos valores para que se propague
a todo el sitio web.
