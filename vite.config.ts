import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  },
  define: {
    'import.meta.env': JSON.stringify(process.env),
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    copyPublicDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-charts': ['recharts'],
          'vendor-core': ['react', 'react-dom', 'react-router-dom'],
          'vendor-utils': ['date-fns', 'jspdf', 'xlsx']
        }
      }
    }
  },
  publicDir: 'public',
  base: './'
}) 