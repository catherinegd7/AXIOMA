import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProblemasPage from './pages/ProblemasPage'
import CustomCursor from './components/CustomCursor'

// Este archivo solo define las rutas (+ chrome global como el cursor).
// No agreguen contenido de página aquí: el one-pager vive en
// /src/pages/HomePage.jsx y cada página independiente vive en su
// propio archivo dentro de /src/pages.
function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problemas" element={<ProblemasPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
