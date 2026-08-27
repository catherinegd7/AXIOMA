import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProblemasPage from './pages/ProblemasPage'

// Este archivo solo define las rutas. No agreguen lógica ni contenido
// aquí: el one-pager vive en /src/pages/HomePage.jsx y cada página
// independiente vive en su propio archivo dentro de /src/pages.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problemas" element={<ProblemasPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
