// GET  /api/problems/:problemId/comments — list the comments on one problem.
// POST /api/problems/:problemId/comments — add a new comment (needs login).
//
// This file doesn't know its own full URL — `:problemId` is filled in by
// wherever server.js decides to mount this router (see server.js). Router({
// mergeParams: true }) is what lets this file read req.params.problemId even
// though the ":problemId" part of the URL is defined one level up.

import { Router } from 'express'
import Comment from '../models/Comment.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router({ mergeParams: true })

// Público: cualquiera puede LEER los comentarios, con o sin sesión iniciada.
router.get('/', async (req, res) => {
  const comments = await Comment.find({ problem: req.params.problemId })
    .populate('author', 'username') // reemplaza el ObjectId del autor por { _id, username }
    .sort({ createdAt: 1 }) // los más viejos primero, como en un hilo de foro

  res.json(comments)
})

// Protegido: requireAuth corre ANTES que esta función. Si no hay sesión
// válida, requireAuth ya respondió 401 y esta línea nunca se ejecuta.
router.post('/', requireAuth, async (req, res) => {
  const body = (req.body.body || '').trim()
  if (!body) {
    return res.status(400).json({ error: 'El comentario no puede estar vacío.' })
  }

  const comment = await Comment.create({
    problem: req.params.problemId,
    author: req.userId, // puesto por requireAuth después de verificar el token
    body,
  })

  // Antes de responder, llenamos el campo author con { _id, username } en
  // vez de dejarlo como un ObjectId — así el frontend puede mostrar el
  // nombre del autor de inmediato, sin pedirlo aparte.
  await comment.populate('author', 'username')

  res.status(201).json(comment)
})

export default router
