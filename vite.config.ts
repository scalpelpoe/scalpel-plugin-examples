import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
      fileName: () => 'plugin.js',
    },
    rollupOptions: {
      // Scalpel injects these at runtime via importmap.
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', '@filterscalpel/plugin-sdk'],
    },
    minify: 'esbuild',
    sourcemap: true,
  },
})
