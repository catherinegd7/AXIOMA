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

import authRoutes from './routes/auth.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import problemsRoutes from './routes/problems.routes.js'
import commentsRoutes from './routes/comments.routes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/problems', problemsRoutes)
app.use('/api/problems/:problemId/comments', commentsRoutes)

export default app
