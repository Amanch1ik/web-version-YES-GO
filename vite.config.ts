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
        target: process.env.VITE_API_BASE_URL || 'http://5.59.232.211:8000',
        changeOrigin: true,
        secure: false, // Для работы с HTTP (если используется)
        rewrite: (path) => path, // Не переписываем путь, так как он уже содержит /api
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            // Подавляем ошибки прокси в DEV режиме, когда сервер недоступен
            // Это нормально для разработки без запущенного бэкенда
            // Не выводим ошибки в консоль - они обрабатываются на клиенте
            return
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Логируем только успешные запросы, ошибки подавляем
          })
        },
      },
    },
  },
})

