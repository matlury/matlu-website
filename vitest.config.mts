import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    // Vitest runs test files in parallel by default.
    // For optimal performance with many tests, you can use the 'pool' and 'maxThreads' options.
    // pool: 'threads', // can be faster but less isolated than 'forks'
  },
})
