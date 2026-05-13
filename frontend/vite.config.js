import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
             if (id.includes('dexie') || id.includes('zustand')) {
                return 'vendor';
             }
             return 'dependencies';
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
