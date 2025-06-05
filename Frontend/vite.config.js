import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 10000,
  },
  resolve: {
    alias: {
      'leaflet': path.resolve(__dirname, 'node_modules/leaflet'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
