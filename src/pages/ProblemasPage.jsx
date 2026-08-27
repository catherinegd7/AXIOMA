import Navbar from '../components/Navbar'
import Problemas from './Problemas'

// Página independiente en /problemas. Reutiliza el Navbar (fijo arriba
// en todas las rutas) y usa Problemas.jsx como contenido principal.
function ProblemasPage() {
  return (
    <>
      <Navbar />
      <main>
        <Problemas />
      </main>
    </>
  )
}

export default ProblemasPage
