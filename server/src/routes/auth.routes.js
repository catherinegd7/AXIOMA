// ---------------------------------------------------------------------------
// Auth routes: /api/auth/signup and /api/auth/login.
//
// SKELETON of what any Express route file in this project looks like:
//
//   import { Router } from 'express'
//   const router = Router()
//
//   router.post('/algo', async (req, res) => {
//     // req.body     -> lo que el frontend mandó (ya convertido de JSON)
//     // res.json(x)  -> responde con x, convertido de vuelta a JSON
//     // res.status(n).json(x) -> lo mismo, pero con un código HTTP distinto a 200
//   })
//
//   export default router
//
// server.js importa este router y lo "monta" en una dirección base
// (/api/auth), así que estas rutas terminan siendo:
//   POST /api/auth/signup
//   POST /api/auth/login
// ---------------------------------------------------------------------------

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

// Crea el token que el navegador va a guardar y reenviar en cada petición
// futura. `sub` (subject) es el nombre estándar de JWT para "de quién es
// este token". expiresIn: '7d' significa que después de una semana hay que
// iniciar sesión de nuevo.
function issueToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/signup — crear una cuenta nueva.
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos: username, email o password.' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })
  }

  try {
    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo o username.' })
    }

    // bcrypt.hash "revuelve" la contraseña de forma que no se puede
    // deshacer. El "10" es el costo del cálculo — más alto es más seguro
    // pero más lento; 10 es el estándar razonable hoy en día.
    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({ username, email, passwordHash })

    // 201 = "Created". Regresamos el token de una vez para que la persona
    // quede logueada inmediatamente después de registrarse, sin tener que
    // iniciar sesión por separado.
    res.status(201).json({
      token: issueToken(user),
      user: { id: user._id, username: user.username },
    })
  } catch (err) {
    // Por si dos peticiones llegan al mismo tiempo y ambas pasan el chequeo
    // de arriba antes de que la primera termine de guardarse — Mongo mismo
    // rechaza el segundo username/email duplicado con el código 11000.
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo o username.' })
    }
    res.status(500).json({ error: 'No se pudo crear la cuenta.' })
  }
})

// POST /api/auth/login — iniciar sesión con una cuenta existente.
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  // OJO: si el usuario no existe, igual llamamos bcrypt.compare contra un
  // string cualquiera (más abajo) en vez de responder de inmediato. Esto es
  // deliberado: si respondiéramos distinto para "no existe" vs "contraseña
  // incorrecta", alguien podría usar esa diferencia para adivinar qué
  // correos están registrados.
  const passwordOk = user ? await bcrypt.compare(password, user.passwordHash) : false

  if (!user || !passwordOk) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
  }

  res.json({
    token: issueToken(user),
    user: { id: user._id, username: user.username },
  })
})

export default router
