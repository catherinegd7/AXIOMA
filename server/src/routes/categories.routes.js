// GET /api/categories — list every folder that exists.
// Simple on purpose: no auth needed, anyone can browse the folder list.

import { Router } from 'express'
import Category from '../models/Category.js'

const router = Router()

router.get('/', async (req, res) => {
  const categories = await Category.find().sort({ name: 1 })
  res.json(categories)
})

export default router
