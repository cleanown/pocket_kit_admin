import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 1103
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
})
