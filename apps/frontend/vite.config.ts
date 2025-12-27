import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { bundleVisualizer } from './build/bundleVisualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), bundleVisualizer()],
})
