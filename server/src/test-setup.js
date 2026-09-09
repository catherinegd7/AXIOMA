// ---------------------------------------------------------------------------
// test-setup.js — runs once before the whole test suite, and once after.
// Vitest is told about this file via vitest.config.js's `setupFiles`.
//
// Two things happen here:
//   1. Connect to a SEPARATE database ("axioma_test", not "axioma") on the
//      same local MongoDB you already have running for development. Tests
//      never touch your real data, and nothing extra needs installing.
//   2. Set a fake JWT_SECRET, so tests don't depend on whatever real secret
//      happens to be in your local .env.
//
// Between EACH individual test, every collection gets wiped — so no test
// can ever see leftover data from a previous one.
// ---------------------------------------------------------------------------

import { beforeAll, afterAll, afterEach } from 'vitest'
import mongoose from 'mongoose'

process.env.JWT_SECRET = 'clave-de-prueba-no-usar-en-produccion'

// En tu máquina, esto apunta al Mongo local de siempre, en una base
// separada. En CI (ver .github/workflows/ci.yml), MONGO_TEST_URI se define
// ahí para apuntar al contenedor de Mongo que levanta el workflow --
// mismo código, distinta dirección según dónde se corra.
const TEST_DB_URI = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/axioma_test'

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI)
})

afterEach(async () => {
  const colecciones = mongoose.connection.collections
  await Promise.all(Object.values(colecciones).map((c) => c.deleteMany({})))
})

afterAll(async () => {
  // Deja la base de prueba vacía (no solo desconectada) para que la
  // siguiente corrida empiece siempre limpia.
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
})
