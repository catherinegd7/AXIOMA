import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'

describe('GET /api/categories', () => {
  it('regresa una lista vacía cuando no hay categorías', async () => {
    const res = await request(app).get('/api/categories')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('regresa carpetas de nivel superior y sus subcarpetas, con el enlace parent correcto', async () => {
    const papa = await Category.create({ name: 'Interno Axioma' })
    const hijo = await Category.create({ name: '2024', parent: papa._id })

    const res = await request(app).get('/api/categories')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)

    const hijoEnRespuesta = res.body.find((c) => c._id === hijo._id.toString())
    expect(hijoEnRespuesta.parent).toBe(papa._id.toString())

    const papaEnRespuesta = res.body.find((c) => c._id === papa._id.toString())
    expect(papaEnRespuesta.parent).toBeNull()
  })

  it('regresa las carpetas ordenadas alfabéticamente por nombre', async () => {
    await Category.create({ name: 'Zeta' })
    await Category.create({ name: 'Alfa' })

    const res = await request(app).get('/api/categories')
    expect(res.body.map((c) => c.name)).toEqual(['Alfa', 'Zeta'])
  })
})
