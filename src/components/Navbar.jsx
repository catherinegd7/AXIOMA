import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// Links que hacen scroll a una sección del one-pager ("/").
// Si agregan una sección nueva al one-pager, agréguenla aquí también.
const SCROLL_LINKS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'quienes-somos', label: 'Quiénes Somos' },
  { id: 'equipo', label: 'Equipo' },
  { id: 'galeria', label: 'Galería' },
]

// Link de navegación real de React Router (página independiente).
const ROUTE_LINK = { path: '/problemas', label: 'Problemas' }

const CONTACTO_LINK = { id: 'contacto', label: 'Contacto' }

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Si ya estamos en "/", hace scroll directo. Si estamos en otra ruta
  // (ej. /problemas), navega a "/" y le pasa el id por state para que
  // HomePage haga el scroll una vez montada.
  const goToSection = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
    setIsOpen(false)
  }

  const handleScrollClick = (event, id) => {
    event.preventDefault()
    goToSection(id)
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-brand-200 bg-brand-50/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#inicio"
          onClick={(event) => handleScrollClick(event, 'inicio')}
          className="flex items-center"
        >
          <img
            src="/AXIOMA LOGOS (2).png"
            alt="Axioma"
            className="h-10 w-auto"
          />
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {SCROLL_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(event) => handleScrollClick(event, link.id)}
                className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-900"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to={ROUTE_LINK.path}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-900"
            >
              {ROUTE_LINK.label}
            </Link>
          </li>
          <li>
            <a
              href={`#${CONTACTO_LINK.id}`}
              onClick={(event) => handleScrollClick(event, CONTACTO_LINK.id)}
              className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-900"
            >
              {CONTACTO_LINK.label}
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-brand-700 md:hidden"
          aria-label="Abrir menú de navegación"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Menú</span>
          <div className="flex h-5 w-6 flex-col justify-between">
            <span className="h-0.5 w-full bg-current" />
            <span className="h-0.5 w-full bg-current" />
            <span className="h-0.5 w-full bg-current" />
          </div>
        </button>
      </nav>

      {isOpen && (
        <ul className="flex flex-col gap-1 border-t border-brand-200 bg-brand-50 px-4 pb-4 md:hidden">
          {SCROLL_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(event) => handleScrollClick(event, link.id)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to={ROUTE_LINK.path}
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
            >
              {ROUTE_LINK.label}
            </Link>
          </li>
          <li>
            <a
              href={`#${CONTACTO_LINK.id}`}
              onClick={(event) => handleScrollClick(event, CONTACTO_LINK.id)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
            >
              {CONTACTO_LINK.label}
            </a>
          </li>
        </ul>
      )}
    </header>
  )
}
