import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Requests to /api will be proxied to your backend
      '/api': {
        target: 'http://localhost:8080', // <-- CHANGE THIS to your backend server address
        changeOrigin: true,
        secure: false,
      },
    },
  },
});