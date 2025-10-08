import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This option tells the server to redirect all requests to index.html
  // This is the official way to support client-side routing.
  appType: 'spa', 
  base: "/Sori/",
})