import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { API_BASE_URL } from '@/config/api'
import { getToken, removeToken } from '@/utils/storage'

// В dev можно принудительно ходить напрямую на API (если прокси не работает)
// VITE_DIRECT_API=true — использовать прямой URL даже в dev
const isDev = import.meta.env.DEV
const useDirectApi = import.meta.env.VITE_DIRECT_API === 'true'
const baseURL = useDirectApi ? `${API_BASE_URL}/api` : (isDev ? '/api' : `${API_BASE_URL}/api`)

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
      removeToken()
      window.location.href = '/login'
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
