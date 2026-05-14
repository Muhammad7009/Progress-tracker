import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://muhammad-backend:5000', // Docker service name
        changeOrigin: true,
        secure: false,
      }
    }
  }
})