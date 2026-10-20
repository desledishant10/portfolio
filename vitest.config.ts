import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Test-only config (kept separate from vite.config.ts so the build plugins -
// Tailwind, the 404.html emitter - never run under tests). globals:true gives
// Testing Library its automatic DOM cleanup between tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'api/**/*.test.ts'],
  },
})
