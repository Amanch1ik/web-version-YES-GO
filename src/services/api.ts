import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { API_BASE_URL } from '@/config/api'
import { getToken, removeToken } from '@/utils/storage'

// В dev можно принудительно ходить напрямую на API (если прокси не работает)
// VITE_DIRECT_API=true — использовать прямой URL даже в dev
const isDev = import.meta.env.DEV
const useDirectApi = import.meta.env.VITE_DIRECT_API === 'true'
const isDevModeEnv = import.meta.env.VITE_DEV_MODE === 'true'
// Всегда используем /api для прокси в dev или полный URL в prod
const baseURL = useDirectApi ? `${API_BASE_URL}/api` : (isDev ? '/api' : `${API_BASE_URL}/api`)

// Логирование для отладки
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    isDev,
    useDirectApi,
    API_BASE_URL,
    baseURL,
    proxyTarget: isDev ? 'http://localhost:3000/api -> https://api.yessgo.org/api' : 'direct'
  })
}

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 секунд таймаут
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    // Публичные endpoints, не требующие авторизации
    const isPublicAuth = config.url?.match(/\/auth\/(login|register|send-code|verify-code|reset-password|login-json|google|apple|google\/callback|apple\/callback)/i)
    if (token && !isPublicAuth) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Логирование запросов в dev режиме
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        hasAuth: !!token && !isPublicAuth,
        baseURL: config.baseURL
      })
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    // Логирование успешных ответов в dev режиме
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        statusText: response.statusText
      })
    }
    return response
  },
  (error) => {
    // Логирование ошибок в dev режиме
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
    }
    
    if (error.response?.status === 401) {
      // В dev-режиме с dev-token не разлогиниваем, чтобы позволить просмотр без бэка
      const token = getToken()
      if (!(isDevModeEnv && token === 'dev-token')) {
        removeToken()
        window.location.href = '/login'
      }
    } else if (!error.response) {
      // Обработка CORS и сетевых ошибок
      if (error.code === 'ERR_NETWORK' || 
          error.message?.includes('ERR_CONNECTION_REFUSED') ||
          error.message?.includes('CORS') ||
          error.code === 'ERR_FAILED') {
        const apiUrl = API_BASE_URL
        message.error({
          content: `Сервер недоступен. Проверьте подключение к интернету или убедитесь, что Backend API запущен на ${apiUrl}`,
          duration: 5,
        })
      }
    } else if (error.response?.status >= 500) {
      message.error({
        content: 'Ошибка сервера. Пожалуйста, попробуйте позже.',
        duration: 3,
      })
    }
    return Promise.reject(error)
  }
)

export default api
