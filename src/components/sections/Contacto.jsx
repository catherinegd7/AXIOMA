import { MeshGradient } from '@paper-design/shaders-react'

// Sección Contacto (id="contacto")
// Fondo animado con shaders (@paper-design/shaders-react), mismo tipo de
// mesh gradient que el Hero, en la paleta Axioma: rojo #B70B0D,
// naranja #E57505 y amarillo dorado #FFB401.

const REDES = [
  {
   
    href: 'https://www.instagram.com/axioma.mty?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==',
    icon: '/public/icons8-instagram-logo-48.png',
  },
 
  {
    
    href: 'https://www.linkedin.com/company/axioma-mty/posts/?feedView=allr',
    icon: '/public/icons8-linkedin-50.png',
  },
  {
    
    href: 'https://discord.gg/placeholder',
    icon: '/public/icons8-discord-50.png',
  },
]

export default function Contacto() {
  return (
    <section
      id="contacto"
      className="relative mx-auto w-full overflow-hidden bg-[#120303] px-6 py-12 sm:px-10"
    >
      {/* Fondo shader: mismo mesh gradient animado del Hero, paleta Axioma */}
      <div className="pointer-events-none absolute inset-0">
        <MeshGradient
          className="absolute inset-0 h-full w-full"
          colors={['#B70B0D', '#E57505', '#FFB401', '#120303']}
          speed={0.3}
          distortion={0.85}
          swirl={0.3}
          grainMixer={0.05}
          grainOverlay={0.05}
        />
        {/* Overlay oscuro para mantener contraste y legibilidad del contenido */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#120303]/75 via-[#120303]/35 to-[#120303]/85" />
      </div>

      {/* CONTÁCTANOS */}
      <div className="relative text-center">
        <h2 className="text-4xl font-bold uppercase text-white drop-shadow-[0_0_25px_rgba(229,117,5,0.45)] sm:text-5xl">
          Contáctanos
        </h2>

        <a
          href="mailto:axioma.mty@servicios.tec.mx"
          className="mt-6 inline-block text-2xl font-medium text-white drop-shadow-[0_0_18px_rgba(255,180,1,0.4)] hover:underline"
        >
          Correo
        </a>

        {/* Imagen logo*/}
      </div>
      <div className="relative" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <img
        src="/AXIOMA LOGOS (2).png"
        alt="Axioma"
        style={{ width: '250px', height: 'auto' }}
        className="w-auto drop-shadow-[0_0_45px_rgba(255,180,1,0.35)]"
      />
      </div>

      {/*<img
        src="/AXIOMA LOGOS (2).png"
        alt="Axioma"
        className="h-[300px] w-auto drop-shadow-[0_0_45px_rgba(255,180,1,0.35)] sm:h-[400px] lg:h-[500px]" /> */}




      {/* FOOTER */}
      <p className="relative text-center text-lg text-white">
        {/* REDES SOCIALES */}
      <div className="mt-6 flex justify-center gap-8">
        {REDES.map((red) => (
          <a
            key={red.label}
            href={red.href}
            target="_blank"
            rel="noreferrer"
            aria-label={red.label}
            className="rounded-full transition-transform hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(183,11,13,0.6)]"
          >
            <img
              src={red.icon}
              alt={red.label}
              className="h-12 w-12 object-contain drop-shadow-[0_0_10px_rgba(255,180,1,0.35)]"
            />
          </a>
        ))}
      </div>
      </p>
    </section>
  )
}