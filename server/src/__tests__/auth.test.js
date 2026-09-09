// ---------------------------------------------------------------------------
// Pruebas de server/src/routes/auth.routes.js
//
// SKELETON de cómo se ve cualquier prueba con vitest + supertest:
//
//   describe('grupo de pruebas', () => {
//     it('hace algo específico', async () => {
//       const res = await request(app).post('/una/ruta').send({ ... })
//       expect(res.status).toBe(200)          // "espero que pase esto"
//     })
//   })
//
// request(app) le manda una petición HTTP falsa directo al app de Express
// (sin necesitar un puerto real ni un navegador) — así se puede probar la
// API exactamente como la usaría el frontend.
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

describe('POST /api/auth/signup', () => {
  it('crea una cuenta nueva y regresa un token', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    expect(res.status).toBe(201)
    expect(res.body.token).toBeTypeOf('string')
    expect(res.body.user.username).toBe('ana')
  })

  it('rechaza una contraseña demasiado corta', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'corta',
    })
    expect(res.status).toBe(400)
  })

  it('rechaza un correo que ya está registrado', async () => {
    await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    const res = await request(app).post('/api/auth/signup').send({
      username: 'otra_persona',
      email: 'ana@test.com', // mismo correo, username distinto
      password: 'clave12345',
    })

    expect(res.status).toBe(409)
  })
})

describe('POST /api/auth/login', () => {
  it('inicia sesión con la contraseña correcta', async () => {
    await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'ana@test.com',
      password: 'clave12345',
    })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeTypeOf('string')
  })

  it('rechaza una contraseña incorrecta', async () => {
    await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'ana@test.com',
      password: 'esta-no-es',
    })

    expect(res.status).toBe(401)
  })

  it('rechaza un correo que no existe, sin decir que "no existe"', async () => {
    // No revisamos el mensaje exacto, solo que se rechace igual que una
    // contraseña incorrecta (401) -- ver el comentario en auth.routes.js
    // sobre por qué ambos casos responden lo mismo.
    const res = await request(app).post('/api/auth/login').send({
      email: 'nadie@test.com',
      password: 'lo-que-sea',
    })
    expect(res.status).toBe(401)
  })
})
