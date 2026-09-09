// ---------------------------------------------------------------------------
// server.js — the entry point of the backend. Running this file (via
// `npm run server`) starts the whole API.
//
// SKELETON of what this file does, in order:
//
//   1. Load .env (so process.env.MONGO_URI etc. exist)
//   2. Create the Express app
//   3. Turn on middleware that EVERY request goes through (cors, json body
//      parsing)
//   4. Mount each route file at its base URL
//   5. Connect to MongoDB
//   6. Start listening for requests
//
// Everything below is just that, filled in.
// ---------------------------------------------------------------------------

import 'dotenv/config' // lee el archivo .env y lo mete en process.env
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import problemsRoutes from './routes/problems.routes.js'
import commentsRoutes from './routes/comments.routes.js'

const app = express()
const PORT = process.env.PORT || 4000

// cors() sin configurar aceptaría peticiones de CUALQUIER sitio web. Como
// nuestro frontend corre en un puerto distinto (Vite en :5173) al backend
// (:4000), el navegador los trata como "orígenes" distintos y bloquea la
// petición a menos que el servidor diga explícitamente que ese origen está
// permitido — eso es lo que hace la línea de abajo.
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))

// Sin esto, req.body llegaría vacío: express.json() es lo que convierte el
// JSON que manda el frontend en un objeto de JavaScript normal.
app.use(express.json())

// Cada "app.use" de aquí abajo dice: "toda petición que empiece con esta
// URL, mándala a este archivo de rutas". Por eso auth.routes.js no necesita
// saber que en realidad vive en /api/auth — solo define /signup y /login.
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/problems', problemsRoutes)

// Este va montado en una URL más larga (con :problemId incluido) para que
// comments.routes.js pueda leer req.params.problemId. No choca con
// "/api/problems/:id" de arriba porque Express distingue las rutas por
// cuántos "pedazos" tiene la URL, no por el orden en que se escribieron.
app.use('/api/problems/:problemId/comments', commentsRoutes)

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    app.listen(PORT, () => {
      console.log(`API escuchando en http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('No se pudo conectar a MongoDB:', err.message)
    process.exit(1)
  }
}

start()
