// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/', // explicit base for correct chunk URLs
  plugins: [
    react(),
    VitePWA({
      selfDestroying: true,        // removes any old SW cleanly
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: { cleanupOutdatedCaches: true },
    }),
  ],
  build: {
    target: 'es2018',              // stable, modern browsers
    cssCodeSplit: true,
    sourcemap: true,               // keep for debugging; disable for prod if desired
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
