// ---------------------------------------------------------------------------
// User model — one document per person who has created an account.
//
// SKELETON (the shape every Mongoose model in this project follows):
//
//   import mongoose from 'mongoose'
//
//   const algoSchema = new mongoose.Schema({
//     campo1: { type: String, required: true },   // <- blueprint for one field
//     campo2: { type: Number, default: 0 },
//   }, { timestamps: true })                        // <- adds createdAt/updatedAt automatically
//
//   export default mongoose.model('NombreDelModelo', algoSchema)
//
// Every model file in this folder (User, Category, Problem, Comment) is just
// this same pattern with different fields.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    // El nombre que se muestra junto a sus comentarios (ej. "elias23").
    username: {
      type: String,
      required: true,
      unique: true, // Mongo rechaza crear un segundo usuario con el mismo username.
      trim: true,
    },

    // Se usa para iniciar sesión. También debe ser único: no puede haber dos
    // cuentas con el mismo correo.
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // normaliza "Ana@Correo.com" -> "ana@correo.com" antes de guardar
    },

    // IMPORTANTE: nunca guardamos la contraseña real, solo su "hash" — el
    // resultado de pasarla por bcrypt, que no se puede revertir para
    // recuperar la contraseña original. Ver server/src/routes/auth.routes.js
    // para dónde se genera este valor.
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }, // agrega automáticamente createdAt y updatedAt
)

export default mongoose.model('User', userSchema)
