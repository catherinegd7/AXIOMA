import { useState } from 'react'

// Sección Contacto (id="contacto")
// TODO equipo: conectar handleSubmit a un backend/servicio de correo real.

const REDES = [
  { label: 'Instagram', href: 'https://instagram.com/placeholder' },
  { label: 'Facebook', href: 'https://facebook.com/placeholder' },
  { label: 'GitHub', href: 'https://github.com/placeholder' },
  { label: 'Correo', href: 'mailto:axioma@placeholder.com' },
]

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO equipo: implementar el envío real (API, EmailJS, etc.)
    console.log('Formulario de contacto (placeholder):', form)
  }

  return (
    <section
      id="contacto"
      className="mx-auto max-w-3xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <h2 className="mb-4 text-center text-3xl font-bold text-brand-900 sm:text-4xl">
        Únete o escríbenos
      </h2>
      <p className="mb-10 text-center text-brand-600">
        ¿Tienes dudas o quieres formar parte de Axioma? Mándanos un mensaje.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nombre" className="text-sm font-medium text-brand-700">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            className="rounded-lg border border-brand-300 bg-brand-50 px-4 py-2.5 text-brand-900 outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="correo" className="text-sm font-medium text-brand-700">
            Correo
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            placeholder="tu@correo.com"
            className="rounded-lg border border-brand-300 bg-brand-50 px-4 py-2.5 text-brand-900 outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="mensaje" className="text-sm font-medium text-brand-700">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={5}
            value={form.mensaje}
            onChange={handleChange}
            placeholder="Cuéntanos qué te gustaría preguntar o compartir"
            className="resize-none rounded-lg border border-brand-300 bg-brand-50 px-4 py-2.5 text-brand-900 outline-none focus:border-brand-500"
          />
        </div>

        <button
          type="submit"
          className="self-start rounded-full bg-brand-900 px-6 py-3 text-sm font-semibold text-brand-50 transition-colors hover:bg-brand-700"
        >
          Enviar Mensaje
        </button>
      </form>

      <div className="mt-12 flex flex-wrap justify-center gap-6 border-t border-brand-200 pt-8">
        {REDES.map((red) => (
          <a
            key={red.label}
            href={red.href}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-brand-600 hover:text-brand-900"
          >
            {red.label}
          </a>
        ))}
      </div>
    </section>
  )
}
