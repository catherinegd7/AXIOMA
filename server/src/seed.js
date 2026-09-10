// ---------------------------------------------------------------------------
// seed.js — run once with `npm run seed` to fill the database with the real
// problem set from server/src/data/problemasReales.js (Putnam 2021-2025,
// OMMU Primera Ronda 2024-2026, OMMU Nacional 2024-2026 — 93 problems).
//
// This replaces the original 5 hand-typed placeholder problems entirely,
// now that real content exists. Safe to run again later: it clears the old
// categories/problems/comments first, so it never duplicates data.
//
// Categories reference each other by a short string `key` (see the data
// file) instead of a real database id, since real ids don't exist until
// after Category.create() runs. `idPorKey` below is what translates one
// into the other.
// ---------------------------------------------------------------------------

import 'dotenv/config'
import mongoose from 'mongoose'
import Category from './models/Category.js'
import Problem from './models/Problem.js'
import Comment from './models/Comment.js'
import { categorias, problemas } from './data/problemasReales.js'

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)

  // Empezamos limpio cada vez que se corre este script. Comment también se
  // limpia aquí: como los problemas se borran y se vuelven a crear (con IDs
  // nuevos), cualquier comentario viejo quedaría apuntando a un problema que
  // ya no existe. Ojo: NO borramos User — las cuentas de la gente no
  // deberían desaparecer solo porque alguien volvió a correr este script.
  await Promise.all([Category.deleteMany({}), Problem.deleteMany({}), Comment.deleteMany({})])

  // Las carpetas están en orden padre-antes-que-hijo dentro del archivo de
  // datos, así que creándolas en ese mismo orden garantiza que, cuando le
  // toca a una subcarpeta, su padre ya tiene un _id real que podemos usar.
  const idPorKey = new Map()
  for (const c of categorias) {
    const doc = await Category.create({
      name: c.name,
      parent: c.parent ? idPorKey.get(c.parent) : null,
    })
    idPorKey.set(c.key, doc._id)
  }

  await Problem.insertMany(
    problemas.map(({ categoriaKey, ...resto }) => ({
      ...resto,
      category: idPorKey.get(categoriaKey),
    })),
  )

  console.log(`Listo: ${categorias.length} categorías y ${problemas.length} problemas creados.`)
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('Error al sembrar la base de datos:', err)
  process.exit(1)
})
