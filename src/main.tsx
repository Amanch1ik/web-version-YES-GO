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

// Подавляем ошибки 500 в консоли браузера
if (typeof window !== 'undefined') {
  // Перехватываем XMLHttpRequest ошибки до того, как они попадут в консоль
  const originalXHROpen = XMLHttpRequest.prototype.open
  const originalXHRSend = XMLHttpRequest.prototype.send
  
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
    return originalXHROpen.apply(this, [method, url, ...args] as any)
  }
  
  XMLHttpRequest.prototype.send = function(...args: any[]) {
    const xhr = this
    
    // Перехватываем события до того, как они попадут в консоль
    const originalOnError = xhr.onerror
    const originalOnLoad = xhr.onload
    
    xhr.onerror = function(event: any) {
      // Подавляем ошибки 500
      if (xhr.status >= 500 || xhr.status === 0) {
        return false
      }
      if (originalOnError) {
        return originalOnError.call(this, event)
      }
    }
    
    xhr.onload = function(event: any) {
      // Подавляем ошибки 500 в onload
      if (xhr.status >= 500) {
        return false
      }
      if (originalOnLoad) {
        return originalOnLoad.call(this, event)
      }
    }
    
    // Перехватываем через addEventListener
    xhr.addEventListener('error', function(event: any) {
      if (xhr.status >= 500 || xhr.status === 0) {
        event.stopPropagation()
        event.preventDefault()
        return false
      }
    }, true)
    
    xhr.addEventListener('load', function(event: any) {
      if (xhr.status >= 500) {
        event.stopPropagation()
        event.preventDefault()
        return false
      }
    }, true)
    
    return originalXHRSend.apply(this, args as any)
  }
  
  const originalError = console.error
  const originalWarn = console.warn
  
  console.error = (...args: any[]) => {
    const message = args.map(arg => 
      typeof arg === 'string' ? arg : 
      arg?.message || arg?.toString() || ''
    ).join(' ').toLowerCase()
    
    // Пропускаем ошибки 500 и Internal Server Error
    if (message.includes('500') || 
        message.includes('internal server error') ||
        message.includes('wallet.service.ts') ||
        message.includes('partner.service.ts') ||
        message.includes('order.service.ts') ||
        message.includes('user.service.ts') ||
        message.includes('finik.service.ts') ||
        (message.includes('get ') && (message.includes('/api/v1/') || message.includes('service.ts'))) ||
        (message.includes('post ') && (message.includes('/api/v1/') || message.includes('service.ts')))) {
      return
    }
    originalError.apply(console, args)
  }
  
  console.warn = (...args: any[]) => {
    const message = args.map(arg => 
      typeof arg === 'string' ? arg : 
      arg?.message || arg?.toString() || ''
    ).join(' ').toLowerCase()
    
    // Пропускаем предупреждения об ошибках 500
    if (message.includes('500') || 
        message.includes('internal server error') ||
        message.includes('wallet.service.ts') ||
        message.includes('partner.service.ts') ||
        message.includes('finik.service.ts') ||
        message.includes('order.service.ts') ||
        message.includes('user.service.ts')) {
      return
    }
    
    // Пропускаем предупреждения о маршрутах
    if (message.includes('no routes matched') || 
        message.includes('no routes matched location')) {
      return
    }
    
    originalWarn.apply(console, args)
  }
  
  // Перехватываем необработанные ошибки
  const errorHandler = (event: ErrorEvent) => {
    const message = (event.message || '').toLowerCase()
    if (message.includes('500') || 
        message.includes('internal server error') ||
        message.includes('wallet.service.ts') ||
        message.includes('partner.service.ts') ||
        message.includes('finik.service.ts') ||
        message.includes('order.service.ts') ||
        message.includes('user.service.ts')) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }
  
  window.addEventListener('error', errorHandler, true)
  
  // Перехватываем необработанные промисы
  window.addEventListener('unhandledrejection', (event) => {
    const message = (
      event.reason?.message || 
      event.reason?.toString() || 
      ''
    ).toLowerCase()
    
    if (message.includes('500') || 
        message.includes('internal server error') ||
        message.includes('wallet.service.ts') ||
        message.includes('partner.service.ts') ||
        message.includes('finik.service.ts') ||
        message.includes('order.service.ts') ||
        message.includes('user.service.ts')) {
      event.preventDefault()
      event.stopPropagation()
    }
  })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Не повторяем запросы при ошибках 500 или 401
        if (error?.name === 'SilentError' || error?.response?.status === 401 || error?.response?.status >= 500) {
          return false
        }
        return failureCount < 1
      },
      staleTime: 5 * 60 * 1000, // 5 минут
      // Подавляем логирование ошибок 500
      meta: {
        errorMessage: false,
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Не повторяем мутации при ошибках 500 или 401
        if (error?.name === 'SilentError' || error?.response?.status === 401 || error?.response?.status >= 500) {
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

