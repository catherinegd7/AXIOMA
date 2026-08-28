import { memo, useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'framer-motion'

// Carrusel 3D: un cilindro de fotos que se puede arrastrar para girar
// (con física de velocidad al soltar), y al hacer click en una carta se
// expande a pantalla completa con una transición de layout compartido.
// Adaptado de un componente de la comunidad (3d-carousel, MIT-style
// pattern común en la comunidad de shadcn/21st.dev) a JS plano + los
// datos/estilos de Axioma — sin TypeScript, sin Next.js, mismo prop
// `items` que ya usaba el carrusel anterior.

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const handleChange = () => setMatches(mediaQueryList.matches)
    handleChange()
    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

const cardTransition = { duration: 0.15, ease: [0.32, 0.72, 0, 1] }
const overlayTransition = { duration: 0.5, ease: [0.32, 0.72, 0, 1] }

const Cylinder = memo(function Cylinder({ items, controls, isActive, onCardClick }) {
  const isScreenSizeSm = useMediaQuery('(max-width: 640px)')
  const cylinderWidth = isScreenSizeSm ? 1100 : 1800
  const faceCount = items.length
  const faceWidth = cylinderWidth / faceCount
  const radius = cylinderWidth / (2 * Math.PI)
  const rotation = useMotionValue(0)
  const transform = useTransform(rotation, (value) => `rotate3d(0, 1, 0, ${value}deg)`)

  return (
    <div
      className="flex h-full items-center justify-center"
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      <motion.div
        drag={isActive ? 'x' : false}
        className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
        style={{
          transform,
          rotateY: rotation,
          width: cylinderWidth,
          transformStyle: 'preserve-3d',
        }}
        onDrag={(_, info) => isActive && rotation.set(rotation.get() + info.offset.x * 0.05)}
        onDragEnd={(_, info) =>
          isActive &&
          controls.start({
            rotateY: rotation.get() + info.velocity.x * 0.05,
            transition: { type: 'spring', stiffness: 100, damping: 30, mass: 0.1 },
          })
        }
        animate={controls}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="absolute flex h-full origin-center items-center justify-center p-2"
            style={{
              width: `${faceWidth}px`,
              transform: `rotateY(${index * (360 / faceCount)}deg) translateZ(${radius}px)`,
              backfaceVisibility: 'hidden',
            }}
            onClick={() => onCardClick(item)}
          >
            <motion.div
              layoutId={`carousel-card-${item.id}`}
              layout="position"
              initial={{ filter: 'blur(4px)' }}
              animate={{ filter: 'blur(0px)' }}
              transition={cardTransition}
              className="pointer-events-none flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-brand-300 bg-brand-100 text-xs text-brand-400"
            >
              {item.src ? (
                <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
              ) : (
                <span className="px-3 text-center">{item.alt}</span>
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
})

export default function PhotoCarousel({ items }) {
  const [activeItem, setActiveItem] = useState(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()

  const handleCardClick = (item) => {
    setActiveItem(item)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveItem(null)
    setIsCarouselActive(true)
  }

  return (
    <motion.div layout className="relative">
      <AnimatePresence mode="sync">
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            transition={overlayTransition}
            className="fixed inset-0 z-50 m-5 flex cursor-zoom-out items-center justify-center rounded-3xl bg-brand-900/60 md:m-24"
          >
            <motion.div
              layoutId={`carousel-card-${activeItem.id}`}
              layout="position"
              className="flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border border-dashed border-brand-300 bg-brand-100 text-sm text-brand-900/60 shadow-2xl"
            >
              {activeItem.src ? (
                <img src={activeItem.src} alt={activeItem.alt} className="h-full w-full object-cover" />
              ) : (
                <span className="px-6 text-center">{activeItem.alt}</span>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-72 w-full overflow-hidden sm:h-96">
        <Cylinder
          items={items}
          controls={controls}
          isActive={isCarouselActive}
          onCardClick={handleCardClick}
        />
      </div>

      <p className="mt-4 text-center text-sm text-brand-900/50">Arrastra para girar · click en una foto para verla</p>
    </motion.div>
  )
}
