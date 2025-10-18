// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({ targets: ['defaults', 'iOS >= 14', 'Safari >= 14.1'] }),
    VitePWA({
      selfDestroying: true,      // <- nukes the old SW on clients
      injectRegister: 'auto',
      registerType: 'autoUpdate',
    }),
  ],
  build: { sourcemap: false, target: 'esnext' },
  assetsInclude: ['assets/[name]-[hash][extname]'],
  cssCodeSplit: true,
})
