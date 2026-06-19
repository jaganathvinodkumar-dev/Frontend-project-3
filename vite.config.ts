import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    target: 'es2018',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true }
    },
    rollupOptions: {
      output: {
        manualChunks(id){
          if (id.includes('node_modules')) return 'vendor'
        }
      }
    },
    cssCodeSplit: true
  }
})
