// ---------------------------------------------------------------------------
// Problem model — one document per problem, replacing the hardcoded
// PROBLEMAS array that used to live directly inside Problemas.jsx.
//
// The fields below are deliberately the SAME fields that array already had
// (id, titulo, año, tema, tipo, dificultad, exito, enunciado) — nothing new
// was invented, this is just that same shape moved into the database, plus
// one new field (`category`) linking each problem to its folder.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

const problemSchema = new mongoose.Schema(
  {
    // Antes cada problema tenía un "id" como 'P-001' escrito a mano en el
    // array. Lo conservamos como código legible (Mongo también le da a cada
    // documento un _id propio automáticamente, pero ese es un identificador
    // técnico feo para mostrar en pantalla).
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    titulo: { type: String, required: true, trim: true },

    // El enunciado del problema. Puede incluir LaTeX (ej. "$x^2 + 1$") que
    // el frontend renderiza con KaTeX — el texto en sí se guarda tal cual,
    // como string normal.
    enunciado: { type: String, required: true },

    // A qué carpeta (Category) pertenece este problema.
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    // Estos tres siguen siendo campos sueltos (no carpetas) porque en la UI
    // actual son filtros independientes que se combinan entre sí (un
    // problema puede ser Año=2024 Y Tema=Álgebra Y Tipo=Interno al mismo
    // tiempo) — no son una jerarquía de carpetas como Category.
    año: { type: String, required: true },
    tema: { type: String, required: true },
    tipo: { type: String, required: true },

    dificultad: {
      type: String,
      enum: ['Fácil', 'Media', 'Difícil'], // solo permite estos 3 valores exactos
      required: true,
    },

    // Porcentaje de gente que lo resuelve correctamente.
    exito: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true },
)

export default mongoose.model('Problem', problemSchema)
