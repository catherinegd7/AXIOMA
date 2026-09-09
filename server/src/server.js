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
