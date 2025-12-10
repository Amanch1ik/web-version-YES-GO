import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import './styles/index.css'

dayjs.locale('ru')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Не повторяем запросы при ошибках 401 (unauthorized)
        if (error?.response?.status === 401) {
          return false
        }
        return failureCount < 2
      },
      staleTime: 5 * 60 * 1000, // 5 минут
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Не повторяем мутации при ошибках 401
        if (error?.response?.status === 401) {
          return false
        }
        return failureCount < 1
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={ruRU}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
