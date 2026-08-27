import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/sections/Hero'
import QuienesSomos from '../components/sections/QuienesSomos'
import Equipo from '../components/sections/Equipo'
import Galeria from '../components/sections/Galeria'
import Contacto from '../components/sections/Contacto'

// El one-pager. Igual que App.jsx antes: solo importa y ordena las
// secciones. No agreguen lógica ni contenido aquí — cada sección vive
// en su propio archivo dentro de /src/components/sections.
function HomePage() {
  const location = useLocation()

  // Cuando el Navbar navega desde otra ruta (ej. /problemas) con un
  // scrollTo en el state, hacemos el scroll aquí una vez montada la página.
  useEffect(() => {
    const scrollTo = location.state?.scrollTo
    if (!scrollTo) return

    document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.state])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <QuienesSomos />
        <Equipo />
        <Galeria />
        <Contacto />
      </main>
    </>
  )
}

export default HomePage
