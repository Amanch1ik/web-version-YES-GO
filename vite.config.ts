import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.mov'],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // Проксируем на продовый домен по HTTPS (api.yessgo.org). Для локалки выключаем проверку cert SAN.
        // Можно задать другой таргет через VITE_API_PROXY_TARGET (например, https://yessgo.org если у него валидный сертификат).
        target: process.env.VITE_API_PROXY_TARGET || process.env.VITE_API_BASE_URL || 'https://api.yessgo.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
})
