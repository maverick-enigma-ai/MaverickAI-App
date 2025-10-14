// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // (optional) tighten build warnings slightly
  build: {
    sourcemap: false,
    target: 'esnext',
  },
})

