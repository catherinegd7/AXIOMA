import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeUp, revealProps, staggerContainer } from '../motion/variants'

// Sección Contacto (id="contacto")
// TODO equipo: conectar handleSubmit a un backend/servicio de correo real.

const REDES = [
  { label: 'Instagram', href: 'https://instagram.com/placeholder' },
  { label: 'Facebook', href: 'https://facebook.com/placeholder' },
  { label: 'GitHub', href: 'https://github.com/placeholder' },
  { label: 'Correo', href: 'mailto:axioma@placeholder.com' },
]

// Campo con línea inferior que se anima (crece desde el centro) al
// enfocar, en vez del recuadro estático de antes.
function FormField({ id, label, as: Component = 'input', ...props }) {
  const [focused, setFocused] = useState(false)

  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-brand-900/80">
        {label}
      </label>
      <div className="relative">
        <Component
          id={id}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full resize-none border-b-2 border-brand-200 bg-transparent px-1 py-2.5 text-brand-900 outline-none"
          {...props}
        />
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-center bg-brand-900"
          initial={false}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  )
}

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO equipo: implementar el envío real (API, EmailJS, etc.)
    console.log('Formulario de contacto (placeholder):', form)
    setSent(true)
    setTimeout(() => setSent(false), 2500)
  }

  return (
    <section
      id="contacto"
      className="mx-auto max-w-3xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <motion.h2
        variants={fadeUp}
        {...revealProps}
        className="font-display mb-4 text-center text-3xl text-brand-900 sm:text-4xl"
      >
        Únete o escríbenos
      </motion.h2>
      <motion.p variants={fadeUp} {...revealProps} className="mb-10 text-center text-brand-900/70">
        ¿Tienes dudas o quieres formar parte de Axioma? Mándanos un mensaje.
      </motion.p>

      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
        variants={staggerContainer(0.1)}
        {...revealProps}
      >
        <FormField
          id="nombre"
          label="Nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Tu nombre completo"
        />
        <FormField
          id="correo"
          label="Correo"
          name="correo"
          type="email"
          value={form.correo}
          onChange={handleChange}
          placeholder="tu@correo.com"
        />
        <FormField
          id="mensaje"
          label="Mensaje"
          as="textarea"
          rows={5}
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          placeholder="Cuéntanos qué te gustaría preguntar o compartir"
        />

        <motion.button
          variants={fadeUp}
          type="submit"
          disabled={sent}
          whileTap={{ scale: 0.96 }}
          className="relative self-start overflow-hidden rounded-full bg-brand-900 px-6 py-3 text-sm font-semibold text-brand-50 transition-colors hover:bg-brand-700 disabled:opacity-90"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={sent ? 'sent' : 'idle'}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              {sent ? '¡Mensaje enviado! ✓' : 'Enviar Mensaje'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.form>

      <div className="mt-12 flex flex-wrap justify-center gap-6 border-t border-brand-200 pt-8">
        {REDES.map((red) => (
          <a
            key={red.label}
            href={red.href}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-brand-900/70 transition-colors hover:text-brand-600"
          >
            {red.label}
          </a>
        ))}
      </div>
    </section>
  )
}
