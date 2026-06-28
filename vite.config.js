import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the Houseplant Care & Watering Log app.
// The React plugin enables fast refresh during development and JSX transforms.
export default defineConfig({
  plugins: [react()],
})
