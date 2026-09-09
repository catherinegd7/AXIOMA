// ---------------------------------------------------------------------------
// server.js — the real entry point (`npm run server` runs this file).
// Connects to MongoDB, then starts the app (from app.js) listening for
// requests. Kept deliberately thin: all the actual route/middleware setup
// lives in app.js, which tests import directly without going through this
// file at all.
// ---------------------------------------------------------------------------

import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

const PORT = process.env.PORT || 4000

// Falla rápido y con un mensaje claro si falta algo en .env, en vez de
// arrancar a medias y fallar más adelante con un error confuso (o peor,
// conectarse a "undefined" sin darse cuenta). Pensado para cuando un
// teammate nuevo clona el repo y se le olvida crear su .env.
const VARIABLES_REQUERIDAS = ['MONGO_URI', 'JWT_SECRET']
const faltantes = VARIABLES_REQUERIDAS.filter((clave) => !process.env[clave])
if (faltantes.length > 0) {
  console.error(
    `Faltan variables de entorno: ${faltantes.join(', ')}.\n` +
      '¿Copiaste .env.example a .env? (ver el README, sección "Cómo correr el proyecto")',
  )
  process.exit(1)
}

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
