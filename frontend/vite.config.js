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
          // Split each page into its own chunk for better code-splitting
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
  }
});
