// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'


export default defineConfig({
  plugins: [
    react(),
legacy({targets: ['defaults', 'iOS >= 14', 'Safari >= 14.1']})],
  // (optional) tighten build warnings slightly
  build: {
    sourcemap: false,
    target: 'esnext',
  },
})
assetFileNames: 'assets/[name]-[hash][extname]'
cssCodeSplit: true
