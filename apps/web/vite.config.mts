import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@lib': resolve(__dirname, '../../packages/lib'),
      '@ui/components': resolve(__dirname, '../../packages/ui/components')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    open: false
  }
})
