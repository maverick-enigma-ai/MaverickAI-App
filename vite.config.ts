// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/', // be explicit for correct chunk URLs
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'iOS >= 14', 'Safari >= 14.1'],
      // additionalLegacyPolyfills is optional; omit unless needed
    }),
    VitePWA({
      selfDestroying: true,        // removes any old SW cleanly
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: { cleanupOutdatedCaches: true },
    }),
  ],
  build: {
    target: 'es2018',              // stable modern target; legacy plugin covers the rest
    cssCodeSplit: true,            // correct location
    sourcemap: true,               // turn on while debugging this issue
    rollupOptions: {
      output: {
        // ensure predictable asset paths
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  // Remove assetsInclude — it was harmful here
});
