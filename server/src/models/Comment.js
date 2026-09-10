// ---------------------------------------------------------------------------
// Comment model — one document per comment/reply on a Problem.
//
// This is deliberately FLAT: a comment belongs to a Problem and has an
// author, full stop — no "reply to a reply" nesting. That matches what the
// AoPS pattern actually is (a statement post, then a flat list of replies
// underneath it), and keeps this first version simpler to build and reason
// about. Nesting could be added later by adding a self-referencing `parent`
// field here, the same trick Category uses to nest folders.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    // Qué problema está comentando.
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },

    // Quién lo escribió. Es un ObjectId, no un nombre de texto — así, si
    // alguien cambia su username después, sus comentarios viejos siguen
    // apuntando a la cuenta correcta en vez de quedar con un nombre viejo.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'El comentario no puede pasar de 2000 caracteres.'],
    },
  },
  { timestamps: true }, // createdAt es lo que se usa para ordenar los comentarios
)

export default mongoose.model('Comment', commentSchema)
