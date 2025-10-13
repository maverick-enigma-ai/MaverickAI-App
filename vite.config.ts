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
resolve: {
  alias: {
    'motion/react': 'motion/dist/es/react/index.mjs',
    'motion': 'motion/dist/es/index.mjs',
  },
},
optimizeDeps: {
  include: ['motion/react'],  // Pre-bundle motion
},
