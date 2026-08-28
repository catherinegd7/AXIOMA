import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useActiveSection } from '../hooks/useActiveSection'
import AxiomaMark from './AxiomaMark'

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

const SECTION_IDS = [...SCROLL_LINKS.map((link) => link.id), CONTACTO_LINK.id]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const activeId = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
 {/*border-b border-brand-200 */}
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50  bg-brand-[#FFB401]/90 backdrop-blur transition-[padding] duration-300 ${
        isScrolled ? 'py-0' : 'py-1.5'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
       <a
          href="#inicio"
          onClick={(event) => handleScrollClick(event, 'inicio')}
          className="flex items-center"
        >
          <img
            src="/AXIOMA LOGOS (3).png"
            alt="Axioma"
            className="h-12 w-auto"
          />
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {SCROLL_LINKS.map((link) => (
            <li key={link.id} className="relative">
              <a
                href={`#${link.id}`}
                onClick={(event) => handleScrollClick(event, link.id)}
                className={`relative text-sm font-medium transition-colors ${
                  activeId === link.id ? 'text-brand-900' : 'text-brand-600 hover:text-brand-900'
                }`}
              >
                {link.label}
                {activeId === link.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-brand-900"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
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
          <li className="relative">
            <a
              href={`#${CONTACTO_LINK.id}`}
              onClick={(event) => handleScrollClick(event, CONTACTO_LINK.id)}
              className={`relative text-sm font-medium transition-colors ${
                activeId === CONTACTO_LINK.id ? 'text-brand-900' : 'text-brand-600 hover:text-brand-900'
              }`}
            >
              {CONTACTO_LINK.label}
              {activeId === CONTACTO_LINK.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-brand-[#FFB401]/90"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-brand-700 md:hidden "
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

{/* border-t border-brand-200*/}
      {isOpen && (
        <ul className="flex flex-col gap-1  bg-brand-[#FFB401]/90 backdrop-blur px-4 pb-4 md:hidden">
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
