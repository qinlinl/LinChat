import { fileURLToPath, URL } from 'node:url'
import WindiCSS from 'vite-plugin-windicss'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), WindiCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.44.130:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: 'ws://192.168.44.130:8000/v1/user/SendUserMsg',
        changeOrigin: true,
        ws: true, // 这里开启 WebSocket 支持
        rewrite: path => path.replace(/^\/ws/, ''),
      },
    },
  },
})
