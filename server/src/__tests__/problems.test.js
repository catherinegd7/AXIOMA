import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Problem from '../models/Problem.js'

async function crearProblema(overrides = {}) {
  const categoria = await Category.create({ name: 'Categoría de prueba' })
  return Problem.create({
    codigo: 'TEST-1',
    titulo: 'Problema de prueba',
    enunciado: 'Enunciado de prueba.',
    category: categoria._id,
    año: '2024',
    tema: 'Álgebra',
    tipo: 'Interno Axioma',
    dificultad: 'Media',
    exito: 50,
    ...overrides,
  })
}

describe('GET /api/problems', () => {
  it('regresa una lista vacía cuando no hay problemas', async () => {
    const res = await request(app).get('/api/problems')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('regresa los problemas que existen', async () => {
    await crearProblema({ codigo: 'P-1' })
    await crearProblema({ codigo: 'P-2' })

    const res = await request(app).get('/api/problems')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})

describe('GET /api/problems/:id', () => {
  it('regresa el problema correcto por su id', async () => {
    const problema = await crearProblema({ titulo: 'Un problema muy específico' })

    const res = await request(app).get(`/api/problems/${problema._id}`)
    expect(res.status).toBe(200)
    expect(res.body.titulo).toBe('Un problema muy específico')
  })

  it('regresa 404 si el id no corresponde a ningún problema', async () => {
    const idQueNoExiste = '000000000000000000000000'
    const res = await request(app).get(`/api/problems/${idQueNoExiste}`)
    expect(res.status).toBe(404)
  })
})
