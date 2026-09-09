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
  },
})
