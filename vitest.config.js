// Separate from vite.config.js on purpose: that one configures the React
// frontend build, this one configures testing the Node backend -- keeping
// them apart avoids the React/browser-specific plugin config leaking into
// backend tests, which don't need it.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['server/**/*.test.js'],
    setupFiles: ['./server/src/test-setup.js'],
    // IMPORTANTE: todos los archivos de prueba comparten la MISMA base de
    // datos real (axioma_test, ver test-setup.js) -- no una copia aislada
    // por archivo. Si vitest corriera los archivos en paralelo (su
    // comportamiento normal), dos archivos podrían chocar entre sí: uno
    // podría borrar todas las colecciones (afterEach) justo cuando otro
    // apenas terminó de crear datos, o dos podrían intentar crear el mismo
    // documento único al mismo tiempo. fileParallelism:false los corre uno
    // a la vez -- con esta cantidad de pruebas, la diferencia en velocidad
    // es de milisegundos, no vale la pena el riesgo de pruebas al azar.
    fileParallelism: false,
  },
})
