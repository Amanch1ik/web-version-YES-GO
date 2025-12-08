import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { API_BASE_URL } from '@/config/api'
import { getToken, removeToken } from '@/utils/storage'

// В dev режиме используем прокси Vite для обхода CORS
// В production используем прямой URL (тот же, что и мобильное приложение: https://api.yessgo.org)
const isDev = import.meta.env.DEV
// В dev: baseURL = '/api', endpoints начинаются с '/v1/...' -> итого '/api/v1/...'
// В prod: baseURL = 'https://api.yessgo.org', endpoints начинаются с '/v1/...' -> добавляем '/api'
const baseURL = isDev ? '/api' : `${API_BASE_URL}/api`

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // В DEV режиме не редиректим на логин, так как используем моковые данные
      // и реальные запросы могут не работать
      if (!isDev) {
        removeToken()
        window.location.href = '/login'
      }
      // В DEV режиме просто возвращаем ошибку без редиректа
    } else if (!error.response) {
      // Обработка CORS и сетевых ошибок
      if (error.code === 'ERR_NETWORK' || 
          error.message?.includes('ERR_CONNECTION_REFUSED') ||
          error.message?.includes('CORS') ||
          error.code === 'ERR_FAILED') {
        // В dev режиме не показываем ошибки CORS, так как они должны решаться через прокси
        if (!isDev) {
          const apiUrl = API_BASE_URL
          message.error({
            content: `Сервер недоступен. Проверьте подключение к интернету или убедитесь, что Backend API запущен на ${apiUrl}`,
            duration: 5,
          })
        }
      }
    } else if (error.response?.status >= 500) {
      // Ошибки 500 обрабатываются в сервисах с fallback данными
      // Подавляем вывод в консоль, перехватывая ошибку
      const silentError = new Error('Server error')
      silentError.name = 'SilentError'
      // Не логируем ошибку - она будет подавлена на уровне main.tsx
      return Promise.reject(silentError)
    }
    return Promise.reject(error)
  }
)

export default api

