import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { bundleVisualizer } from './build/bundleVisualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), bundleVisualizer()],
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries
          'vendor-ui': ['lucide-react'],
          // Charts and heavy libraries
          'vendor-charts': ['recharts'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification (esbuild is faster than terser)
    minify: 'esbuild',
    // Disable source maps in production for smaller bundle
    sourcemap: process.env.NODE_ENV !== 'production',
  },
})
