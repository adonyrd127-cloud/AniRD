import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssMinify: true,
    chunkSizeWarningLimit: 600,
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
          if (id.includes('/pages/')) {
            const match = id.match(/pages\/(\w+)/);
            if (match) return `page-${match[1].toLowerCase()}`;
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  test: {
    environment: 'jsdom',
    globals: true,
  }
});
