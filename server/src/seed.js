// ---------------------------------------------------------------------------
// seed.js — run once with `npm run seed` to fill an empty database with the
// same 5 example problems that used to be hardcoded directly in
// Problemas.jsx, now organized into folders (categories) instead of being a
// flat list. Safe to run again later: it clears the old categories/problems
// first, so it never duplicates data.
// ---------------------------------------------------------------------------

import 'dotenv/config'
import mongoose from 'mongoose'
import Category from './models/Category.js'
import Problem from './models/Problem.js'
import Comment from './models/Comment.js'

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)

  // Empezamos limpio cada vez que se corre este script. Comment también se
  // limpia aquí: como los problemas se borran y se vuelven a crear (con IDs
  // nuevos), cualquier comentario viejo quedaría apuntando a un problema que
  // ya no existe. Ojo: NO borramos User — las cuentas de la gente no
  // deberían desaparecer solo porque alguien volvió a correr este script.
  await Promise.all([Category.deleteMany({}), Problem.deleteMany({}), Comment.deleteMany({})])

  // Carpetas de nivel superior (una por tipo de concurso).
  const interno = await Category.create({ name: 'Interno Axioma' })
  const amc = await Category.create({ name: 'AMC' })
  const putnam = await Category.create({ name: 'Putnam' })
  const estatal = await Category.create({ name: 'Olimpiada Estatal' })

  // Subcarpetas por año, cada una con `parent` apuntando a su carpeta
  // de arriba — así es como se arma el anidado tipo AoPS (Tipo > Año).
  const interno2024 = await Category.create({ name: '2024', parent: interno._id })
  const interno2023 = await Category.create({ name: '2023', parent: interno._id })
  const amc2023 = await Category.create({ name: '2023', parent: amc._id })
  const putnam2022 = await Category.create({ name: '2022', parent: putnam._id })
  const estatal2024 = await Category.create({ name: '2024', parent: estatal._id })

  // Los mismos 5 problemas que antes vivían en el array PROBLEMAS dentro de
  // Problemas.jsx — solo que ahora cada uno apunta a su carpeta real.
  await Problem.insertMany([
    {
      codigo: 'P-001',
      titulo: 'Suma de raíces de un polinomio cúbico',
      category: interno2024._id,
      año: '2024',
      tema: 'Álgebra',
      tipo: 'Interno Axioma',
      dificultad: 'Media',
      exito: 62,
      enunciado:
        'Placeholder del enunciado del problema. Aquí eventualmente se renderizará LaTeX con KaTeX.',
    },
    {
      codigo: 'P-002',
      titulo: 'Conteo de caminos en una cuadrícula',
      category: amc2023._id,
      año: '2023',
      tema: 'Combinatoria',
      tipo: 'AMC',
      dificultad: 'Fácil',
      exito: 81,
      enunciado: 'Placeholder del enunciado del problema.',
    },
    {
      codigo: 'P-003',
      titulo: 'Ángulos en un triángulo inscrito',
      category: estatal2024._id,
      año: '2024',
      tema: 'Geometría',
      tipo: 'Olimpiada Estatal',
      dificultad: 'Difícil',
      exito: 34,
      enunciado: 'Placeholder del enunciado del problema.',
    },
    {
      codigo: 'P-004',
      titulo: 'Divisibilidad y congruencias',
      category: putnam2022._id,
      año: '2022',
      tema: 'Teoría de Números',
      tipo: 'Putnam',
      dificultad: 'Difícil',
      exito: 28,
      enunciado: 'Placeholder del enunciado del problema.',
    },
    {
      codigo: 'P-005',
      titulo: 'Desigualdad AM-GM aplicada',
      category: interno2023._id,
      año: '2023',
      tema: 'Álgebra',
      tipo: 'Interno Axioma',
      dificultad: 'Media',
      exito: 55,
      enunciado: 'Placeholder del enunciado del problema.',
    },
  ])

  console.log('Listo: categorías y problemas de ejemplo creados.')
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('Error al sembrar la base de datos:', err)
  process.exit(1)
})
