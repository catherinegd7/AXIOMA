// ---------------------------------------------------------------------------
// Pruebas de server/src/routes/comments.routes.js -- estas son las que
// realmente demuestran que "necesitas iniciar sesión para comentar" no es
// solo un botón escondido en el frontend, sino algo que el backend exige.
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Problem from '../models/Problem.js'

// Pequeño helper: crea un problema real en la base de prueba, para tener
// algo válido sobre lo cual comentar en cada prueba.
async function crearProblemaDePrueba() {
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
  })
}

// Otro helper: registra un usuario nuevo y regresa su token, listo para
// usarse en el encabezado Authorization de una prueba.
async function crearUsuarioYObtenerToken() {
  const res = await request(app).post('/api/auth/signup').send({
    username: 'comentarista',
    email: 'comentarista@test.com',
    password: 'clave12345',
  })
  return res.body.token
}

describe('GET /api/problems/:id/comments', () => {
  it('deja leer los comentarios sin haber iniciado sesión', async () => {
    const problema = await crearProblemaDePrueba()
    const res = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('POST /api/problems/:id/comments', () => {
  it('rechaza publicar un comentario sin sesión iniciada', async () => {
    const problema = await crearProblemaDePrueba()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .send({ body: 'Intento de comentario sin sesión.' })

    expect(res.status).toBe(401)
  })

  it('rechaza un token inventado (no firmado por nosotros)', async () => {
    const problema = await crearProblemaDePrueba()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', 'Bearer esto-no-es-un-token-real')
      .send({ body: 'Intento con token falso.' })

    expect(res.status).toBe(401)
  })

  it('permite comentar con sesión iniciada, y el comentario aparece después al leer', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const publicar = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Este problema tiene una solución elegante con AM-GM.' })

    expect(publicar.status).toBe(201)
    // El autor debe venir "poblado" (username visible), no solo un ID crudo.
    expect(publicar.body.author.username).toBe('comentarista')

    const leer = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(leer.status).toBe(200)
    expect(leer.body).toHaveLength(1)
    expect(leer.body[0].body).toBe('Este problema tiene una solución elegante con AM-GM.')
  })

  it('rechaza un comentario vacío, incluso con sesión iniciada', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: '   ' }) // solo espacios

    expect(res.status).toBe(400)
  })
})
