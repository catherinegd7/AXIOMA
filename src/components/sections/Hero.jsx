import { useNavigate } from 'react-router-dom'

// Sección Hero (id="inicio")
// TODO equipo: reemplazar el placeholder del logo/animación 3D,
// ajustar copy del título/subtítulo y afinar la animación de la flecha.

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen scroll-mt-16 flex-col items-center justify-center gap-10 px-4 pt-16 text-center sm:px-6"
    >
      <div className="flex flex-col items-center gap-4">
        <img
            src="/AXIOMA LOGOS (2).png"
            alt="Axioma"
            className="h-50 w-auto"
          />
        <p className="max-w-xl text-lg text-brand-600 sm:text-xl">
          El club de matemáticas del Tec de Monterrey. Únete a una comunidad
          que resuelve problemas, comparte ideas y se prepara para
          competencias.
        </p>
      </div>

      {/* Placeholder para animación / logo 3D. Sustituir por Spline, Three.js, Lottie, etc. */}
      <div className="flex h-56 w-56 items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-brand-100 text-sm text-brand-400 sm:h-72 sm:w-72">
        Espacio para animación / logo 3D
      </div>

      <button
        type="button"
        onClick={() => navigate('/problemas')}
        className="rounded-full bg-brand-900 px-6 py-3 text-sm font-semibold text-brand-50 transition-colors hover:bg-brand-700"
      >
        Ver Problemas
      </button>

      {/* Ícono de flecha animada indicando scroll hacia abajo */}
      <div className="absolute bottom-8 animate-bounce text-brand-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
