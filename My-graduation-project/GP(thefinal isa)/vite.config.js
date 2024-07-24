import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'slick-carousel/slick/slick.css': 'slick-carousel/slick/slick.css',
      'slick-carousel/slick/slick-theme.css': 'slick-carousel/slick/slick-theme.css'
    }
  }
})
