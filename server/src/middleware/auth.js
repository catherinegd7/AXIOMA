// ---------------------------------------------------------------------------
// requireAuth — an Express "middleware": a function that runs BEFORE a route
// handler, and can either let the request continue (by calling next()) or
// stop it short (by sending a response itself, like the 401s below).
//
// SKELETON of what any Express middleware looks like:
//
//   function algunMiddleware(req, res, next) {
//     if (condicionOk) {
//       next()              // <- sigue hacia la ruta real
//     } else {
//       res.status(400).json({ error: '...' })   // <- corta aquí, la ruta real nunca corre
//     }
//   }
//
// We attach this to any route that should be blocked for logged-out
// visitors — in this project, that's only "post a comment".
// ---------------------------------------------------------------------------

import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  // El navegador manda el token en un encabezado HTTP así:
  //   Authorization: Bearer eyJhbGciOiJI...
  // Lo separamos de la palabra "Bearer " para quedarnos solo con el token.
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Necesitas iniciar sesión para hacer esto.' })
  }

  try {
    // jwt.verify hace dos cosas a la vez: confirma que el token fue firmado
    // con nuestro JWT_SECRET (o sea, que lo emitimos nosotros y nadie lo
    // inventó) y que no ha expirado. Si algo falla, lanza un error.
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Guardamos el id del usuario en `req` para que la ruta que sigue
    // (ej. crear un comentario) sepa quién está haciendo la petición.
    req.userId = payload.sub
    next()
  } catch {
    return res.status(401).json({ error: 'Tu sesión no es válida o ya expiró.' })
  }
}
