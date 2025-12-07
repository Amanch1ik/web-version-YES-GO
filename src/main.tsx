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
  const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader
  
  // Сохраняем URL для проверки
  const xhrUrls = new WeakMap<XMLHttpRequest, string>()
  
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
    const urlString = typeof url === 'string' ? url : url.toString()
    xhrUrls.set(this, urlString)
    return originalXHROpen.apply(this, [method, url, ...args] as any)
  }
  
  XMLHttpRequest.prototype.send = function(...args: any[]) {
    const xhr = this
    const url = xhrUrls.get(xhr) || ''
    const isApiRequest = url.includes('/api/v1/')
    const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'
    
    // Перехватываем события до того, как они попадут в консоль
    const originalOnError = xhr.onerror
    const originalOnLoad = xhr.onload
    const originalOnLoadEnd = xhr.onloadend
    const originalOnReadyStateChange = xhr.onreadystatechange
    
    // Перехватываем через addEventListener с capture фазой
    const errorHandler = function(event: any) {
      // В DEV режиме подавляем ошибки 401, 404, 500
      if (isDev && isApiRequest && (xhr.status === 401 || xhr.status === 404 || xhr.status >= 500 || xhr.status === 0)) {
        event.stopPropagation()
        event.stopImmediatePropagation()
        event.preventDefault()
        return false
      }
      if (!isDev && isApiRequest && (xhr.status >= 500 || xhr.status === 0)) {
        event.stopPropagation()
        event.stopImmediatePropagation()
        event.preventDefault()
        return false
      }
    }
    
    const loadHandler = function(event: any) {
      // В DEV режиме подавляем ошибки 401, 404, 500
      if (isDev && isApiRequest && (xhr.status === 401 || xhr.status === 404 || xhr.status >= 500)) {
        event.stopPropagation()
        event.stopImmediatePropagation()
        event.preventDefault()
        return false
      }
      if (!isDev && isApiRequest && xhr.status >= 500) {
        event.stopPropagation()
        event.stopImmediatePropagation()
        event.preventDefault()
        return false
      }
    }
    
    const loadEndHandler = function(event: any) {
      // В DEV режиме подавляем ошибки 401, 404, 500
      if (isDev && isApiRequest && (xhr.status === 401 || xhr.status === 404 || xhr.status >= 500)) {
        event.stopPropagation()
        event.stopImmediatePropagation()
        event.preventDefault()
        return false
      }
      if (!isDev && isApiRequest && xhr.status >= 500) {
        event.stopPropagation()
        event.stopImmediatePropagation()
        event.preventDefault()
        return false
      }
    }
    
    xhr.addEventListener('error', errorHandler, { capture: true, passive: false })
    xhr.addEventListener('load', loadHandler, { capture: true, passive: false })
    xhr.addEventListener('loadend', loadEndHandler, { capture: true, passive: false })
    
    xhr.onerror = function(event: any) {
      // В DEV режиме подавляем ошибки 401, 404, 500
      if (isDev && isApiRequest && (xhr.status === 401 || xhr.status === 404 || xhr.status >= 500 || xhr.status === 0)) {
        event.stopPropagation()
        event.preventDefault()
        return false
      }
      if (!isDev && isApiRequest && (xhr.status >= 500 || xhr.status === 0)) {
        event.stopPropagation()
        event.preventDefault()
        return false
      }
      if (originalOnError) {
        return originalOnError.call(this, event)
      }
    }
    
    xhr.onload = function(event: any) {
      // В DEV режиме подавляем ошибки 401, 404, 500
      if (isDev && isApiRequest && (xhr.status === 401 || xhr.status === 404 || xhr.status >= 500)) {
        event.stopPropagation()
        event.preventDefault()
        return false
      }
      if (!isDev && isApiRequest && xhr.status >= 500) {
        event.stopPropagation()
        event.preventDefault()
        return false
      }
      if (originalOnLoad) {
        return originalOnLoad.call(this, event)
      }
    }
    
    xhr.onloadend = function(event: any) {
      // В DEV режиме подавляем ошибки 401, 404, 500
      if (isDev && isApiRequest && (xhr.status === 401 || xhr.status === 404 || xhr.status >= 500)) {
        event.stopPropagation()
        event.preventDefault()
        return false
      }
      if (!isDev && isApiRequest && xhr.status >= 500) {
        event.stopPropagation()
        event.preventDefault()
        return false
      }
      if (originalOnLoadEnd) {
        return originalOnLoadEnd.call(this, event)
      }
    }
    
    // Перехватываем readystatechange для подавления ошибок
    const readyStateChangeHandler = function(event: any) {
      // В DEV режиме подавляем ошибки 401, 404, 500
      if (isDev && isApiRequest && xhr.readyState === 4 && (xhr.status === 401 || xhr.status === 404 || xhr.status >= 500 || xhr.status === 0)) {
        if (event) {
          event.stopPropagation()
          event.stopImmediatePropagation()
          event.preventDefault()
        }
        // Подавляем вывод в консоль
        const originalLog = console.log
        console.log = () => {}
        setTimeout(() => { console.log = originalLog }, 0)
        return false
      }
      if (!isDev && isApiRequest && xhr.readyState === 4 && (xhr.status >= 500 || xhr.status === 0)) {
        if (event) {
          event.stopPropagation()
          event.stopImmediatePropagation()
          event.preventDefault()
        }
        return false
      }
    }
    
    xhr.addEventListener('readystatechange', readyStateChangeHandler, { capture: true, passive: false })
    
    xhr.onreadystatechange = function(event: any) {
      // В DEV режиме подавляем ошибки 401, 404, 500
      if (isDev && isApiRequest && xhr.readyState === 4 && (xhr.status === 401 || xhr.status === 404 || xhr.status >= 500 || xhr.status === 0)) {
        if (event) {
          event.stopPropagation()
          event.preventDefault()
        }
        return false
      }
      if (!isDev && isApiRequest && xhr.readyState === 4 && (xhr.status >= 500 || xhr.status === 0)) {
        if (event) {
          event.stopPropagation()
          event.preventDefault()
        }
        return false
      }
      if (originalOnReadyStateChange) {
        return originalOnReadyStateChange.call(this, event)
      }
    }
    
    // Дополнительная защита - перехватываем все события ошибок
    const originalAddEventListener = xhr.addEventListener.bind(xhr)
    xhr.addEventListener = function(type: string, listener: any, options?: any) {
      if (isDev && isApiRequest && (type === 'error' || type === 'loadend')) {
        const wrappedListener = function(e: any) {
          if (xhr.status === 401 || xhr.status === 404 || xhr.status >= 500) {
            e.stopPropagation()
            e.stopImmediatePropagation()
            e.preventDefault()
            return false
          }
          if (listener) {
            return listener.call(this, e)
          }
        }
        return originalAddEventListener(type, wrappedListener, options)
      }
      return originalAddEventListener(type, listener, options)
    }
    
    return originalXHRSend.apply(this, args as any)
  }
  
  // Используем уже переопределенные функции, если они есть
  const originalError = (console.error as any).__original || console.error
  const originalWarn = (console.warn as any).__original || console.warn
  
  // Сохраняем ссылки на оригинальные функции
  ;(console.error as any).__original = originalError
  ;(console.warn as any).__original = originalWarn
  
  console.error = (...args: any[]) => {
    const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'
    const message = args.map(arg => 
      typeof arg === 'string' ? arg : 
      arg?.message || arg?.toString() || ''
    ).join(' ').toLowerCase()
    
    // В DEV режиме подавляем все ошибки API
    if (isDev) {
      if (message.includes('401') || 
          message.includes('404') ||
          message.includes('500') || 
          message.includes('unauthorized') ||
          message.includes('not found') ||
          message.includes('internal server error') ||
          message.includes('wallet.service.ts') ||
          message.includes('partner.service.ts') ||
          message.includes('order.service.ts') ||
          message.includes('user.service.ts') ||
          message.includes('finik.service.ts') ||
          message.includes('/api/v1/') ||
          message.includes('xmlhttprequest') ||
          message.includes('xhr') ||
          message.includes('dispatchxhrrequest') ||
          message.includes('main.tsx:165') ||
          message.includes('main.tsx:') ||
          (message.includes('get ') && message.includes('/api/v1/')) ||
          (message.includes('post ') && message.includes('/api/v1/')) ||
          (message.includes('dispatchxhrrequest') && (message.includes('401') || message.includes('404') || message.includes('500')))) {
        return
      }
    }
    
    // В продакшене подавляем только 500 ошибки
    if (!isDev) {
      if (message.includes('500') || 
          message.includes('internal server error')) {
        return
      }
    }
    
    originalError.apply(console, args)
  }
  
  console.warn = (...args: any[]) => {
    const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'
    const message = args.map(arg => 
      typeof arg === 'string' ? arg : 
      arg?.message || arg?.toString() || ''
    ).join(' ').toLowerCase()
    
    // В DEV режиме подавляем все предупреждения об ошибках API
    if (isDev) {
      if (message.includes('401') || 
          message.includes('404') ||
          message.includes('500') || 
          message.includes('unauthorized') ||
          message.includes('not found') ||
          message.includes('internal server error') ||
          message.includes('wallet.service.ts') ||
          message.includes('partner.service.ts') ||
          message.includes('finik.service.ts') ||
          message.includes('order.service.ts') ||
          message.includes('user.service.ts') ||
          message.includes('/api/v1/') ||
          message.includes('xmlhttprequest') ||
          message.includes('xhr')) {
        return
      }
    }
    
    // Пропускаем предупреждения о маршрутах
    if (message.includes('no routes matched') || 
        message.includes('no routes matched location')) {
      return
    }
    
    // Пропускаем предупреждения о видео (AbortError при размонтировании - это нормально)
    if (message.includes('video autoplay failed') ||
        message.includes('aborterror') ||
        message.includes('the play() request was interrupted') ||
        message.includes('media was removed from the document')) {
      return
    }
    
    originalWarn.apply(console, args)
  }
  
  // Перехватываем необработанные ошибки
  const errorHandler = (event: ErrorEvent) => {
    const message = (event.message || '').toLowerCase()
    const filename = (event.filename || '').toLowerCase()
    const target = event.target as any
    
    // Подавляем ошибки 401, 404, 500 из XMLHttpRequest
    if (target && (target instanceof XMLHttpRequest || target.tagName === 'SCRIPT')) {
      const xhr = target as XMLHttpRequest
      const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'
      if (isDev && (xhr.status === 401 || xhr.status === 404 || xhr.status >= 500 || message.includes('401') || message.includes('404') || message.includes('500') || message.includes('internal server error'))) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        return false
      }
      if (!isDev && (xhr.status >= 500 || message.includes('500') || message.includes('internal server error'))) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        return false
      }
    }
    
    const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'
    if (isDev && (message.includes('401') || message.includes('404') || message.includes('500') || 
        message.includes('unauthorized') || message.includes('not found') ||
        message.includes('internal server error') ||
        message.includes('wallet.service.ts') ||
        message.includes('partner.service.ts') ||
        message.includes('finik.service.ts') ||
        message.includes('order.service.ts') ||
        message.includes('user.service.ts') ||
        message.includes('/api/v1/') ||
        filename.includes('main.tsx') ||
        filename.includes('api.ts'))) {
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
      return false
    }
    if (!isDev && (message.includes('500') || 
        message.includes('internal server error') ||
        message.includes('wallet.service.ts') ||
        message.includes('partner.service.ts') ||
        message.includes('finik.service.ts') ||
        message.includes('order.service.ts') ||
        message.includes('user.service.ts') ||
        message.includes('/api/v1/') ||
        filename.includes('main.tsx') ||
        filename.includes('api.ts'))) {
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
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
    
    const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'
    if (isDev && (message.includes('401') || message.includes('404') || message.includes('500') || 
        message.includes('unauthorized') || message.includes('not found') ||
        message.includes('internal server error') ||
        message.includes('wallet.service.ts') ||
        message.includes('partner.service.ts') ||
        message.includes('finik.service.ts') ||
        message.includes('order.service.ts') ||
        message.includes('user.service.ts'))) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (!isDev && (message.includes('500') || 
        message.includes('internal server error') ||
        message.includes('wallet.service.ts') ||
        message.includes('partner.service.ts') ||
        message.includes('finik.service.ts') ||
        message.includes('order.service.ts') ||
        message.includes('user.service.ts'))) {
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

