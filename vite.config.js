import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/analyze": "http://localhost:8000",
      "/search": "http://localhost:8000",
      "/products": "http://localhost:8000",
      "/suggest": "http://localhost:8000",
      "/compatible-products": "http://localhost:8000",
      "/categories": "http://localhost:8000",
      "/brands": "http://localhost:8000",
      "/admin": "http://localhost:8000",
      "/api": "http://localhost:8000",
      "/health": "http://localhost:8000",
      "/shipping": "http://localhost:8000",
    },
  },
})