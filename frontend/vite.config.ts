import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
