import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { API_BASE_URL } from '@/config/api'
import { getToken, removeToken } from '@/utils/storage'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
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
      removeToken()
      window.location.href = '/login'
    } else if (!error.response) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        const apiUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000'
        message.error(`Сервер недоступен. Проверьте подключение к интернету или убедитесь, что Backend API запущен на ${apiUrl}`)
      }
    }
    return Promise.reject(error)
  }
)

export default api

