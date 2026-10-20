import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Emit dist/404.html as a copy of the built index.html. Vercel serves 404.html
// (with a real HTTP 404 status) for any path that matches no route or file, so
// the SPA shell boots, react-router sees the unknown path, and renders the
// custom NotFoundPage - instead of Vercel's plain-text NOT_FOUND response.
function spa404(): Plugin {
  return {
    name: 'spa-404-html',
    apply: 'build',
    closeBundle() {
      const dist = resolve(import.meta.dirname, 'dist')
      const index = resolve(dist, 'index.html')
      if (existsSync(index)) copyFileSync(index, resolve(dist, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), spa404()],
})
