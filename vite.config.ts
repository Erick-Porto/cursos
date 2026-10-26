import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { materiais } from './scripts/vite-materiais.mjs'

// VITE_BASE é definido pelo GitHub Actions como "/<nome-do-repo>/".
// Localmente fica "/".
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  // materiais/ de cada curso, servidos em <base>materiais/<curso>/
  plugins: [vue(), materiais()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
  },
})
