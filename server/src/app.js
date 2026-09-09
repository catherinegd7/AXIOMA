// ---------------------------------------------------------------------------
// app.js — builds and configures the Express app, but does NOT start it
// listening on a port and does NOT connect to MongoDB. That split exists
// specifically so tests can import the app and send fake requests directly
// to it (via supertest) without needing a real running server or a real
// database connection managed here.
//
// server.js is the "real" entry point: it imports this app, connects to
// the real database, and actually starts listening.
// ---------------------------------------------------------------------------

import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import problemsRoutes from './routes/problems.routes.js'
import commentsRoutes from './routes/comments.routes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// Dos niveles de límite, ambos por IP, ambos apagados bajo pruebas
// automatizadas (NODE_ENV=test, que vitest pone solo) para que la suite de
// pruebas no se bloquee a sí misma llamando estas rutas muchas veces seguidas
// a propósito:
//
// 1. Uno GENERAL para toda la API (por si alguien intenta saturar cualquier
//    ruta, no solo login).
// 2. Uno más ESTRICTO solo para /api/auth, porque ahí es donde de verdad
//    importa: sin esto, nada le impide a alguien probar miles de
//    contraseñas por segundo (fuerza bruta).
if (process.env.NODE_ENV !== 'test') {
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Demasiadas peticiones. Espera unos minutos e intenta de nuevo.' },
    }),
  )

  app.use(
    '/api/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Demasiados intentos. Espera unos minutos e intenta de nuevo.' },
    }),
  )
}

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/problems', problemsRoutes)
app.use('/api/problems/:problemId/comments', commentsRoutes)

export default app
