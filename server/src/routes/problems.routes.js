// GET /api/problems       — list every problem (what the table on
//                            Problemas.jsx used to read from the hardcoded
//                            PROBLEMAS array).
// GET /api/problems/:id   — one problem by its Mongo _id (what the modal
//                            needs when someone clicks a row).
// Neither needs auth — browsing problems is public, only commenting isn't.

import { Router } from 'express'
import Problem from '../models/Problem.js'

const router = Router()

router.get('/', async (req, res) => {
  const problems = await Problem.find().sort({ createdAt: -1 })
  res.json(problems)
})

router.get('/:id', async (req, res) => {
  const problem = await Problem.findById(req.params.id)
  if (!problem) {
    return res.status(404).json({ error: 'Ese problema no existe.' })
  }
  res.json(problem)
})

export default router
