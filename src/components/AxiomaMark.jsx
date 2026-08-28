// Isotipo real de Axioma (exportado del Manual de Identidad), no una
// recreación. Mantiene el mismo aspect ratio que el archivo original.
export default function AxiomaMark({ className = 'h-8 w-8' }) {
  return (
    <img
      src="/axioma-mark.png"
      alt="Axioma"
      className={`object-contain ${className}`}
    />
  )
}
