import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import {
  FinikApiKey,
  FinikPaymentRequest,
  FinikPaymentResponse,
  FinikPaymentStatus,
} from '@/types/finik'

// Получаем API ключи из localStorage (в реальном приложении это должно быть на сервере)
const getFinikKeys = (): { apiKey: string; secretKey: string } | null => {
  const apiKey = localStorage.getItem('finik_api_key')
  const secretKey = localStorage.getItem('finik_secret_key')
  if (apiKey && secretKey) {
    return { apiKey, secretKey }
  }
  return null
}

export const finikService = {
  // Сохранить API ключи
  saveApiKeys: (apiKey: string, secretKey: string): void => {
    localStorage.setItem('finik_api_key', apiKey)
    localStorage.setItem('finik_secret_key', secretKey)
  },

  // Получить API ключи
  getApiKeys: (): { apiKey: string; secretKey: string } | null => {
    return getFinikKeys()
  },

  // Удалить API ключи
  removeApiKeys: (): void => {
    localStorage.removeItem('finik_api_key')
    localStorage.removeItem('finik_secret_key')
  },

  // Создать платеж через Finik
  createPayment: async (request: FinikPaymentRequest): Promise<FinikPaymentResponse> => {
    try {
      // В реальном приложении это должно быть на бэкенде
      // Здесь мы используем прокси через наш API
      const response = await api.post<FinikPaymentResponse>(
        API_ENDPOINTS.FINIK_CREATE_PAYMENT,
        request
      )
      return response.data
    } catch (error: any) {
      // Если ошибка 500 или сервер недоступен, используем fallback
      if (error?.name === 'SilentError' || error?.response?.status >= 500 || !error?.response || error?.response?.status === 0) {
        const keys = getFinikKeys()
        if (keys) {
          return await createPaymentDirect(request, keys)
        }
        // Если ключей нет, возвращаем mock ответ для демонстрации
        const paymentId = `finik_${Date.now()}`
        return {
          success: true,
          paymentId,
          // Используем returnUrl для демо-режима
          paymentUrl: request.returnUrl || `/wallet/finik-success?paymentId=${paymentId}&status=success&orderId=${request.orderId}`,
        }
      }
      throw error
    }
  },

  // Проверить статус платежа
  checkPaymentStatus: async (paymentId: string): Promise<FinikPaymentStatus> => {
    try {
      const response = await api.get<FinikPaymentStatus>(
        API_ENDPOINTS.FINIK_PAYMENT_STATUS.replace(':id', paymentId)
      )
      return response.data
    } catch (error: any) {
      throw error
    }
  },

  // Получить список API ключей (для админов)
  getApiKeysList: async (): Promise<FinikApiKey[]> => {
    try {
      const response = await api.get<FinikApiKey[]>(API_ENDPOINTS.FINIK_API_KEYS)
      return response.data
    } catch (error: any) {
      // Fallback: возвращаем ключи из localStorage
      const keys = getFinikKeys()
      if (keys) {
        return [
          {
            name: 'Основной ключ',
            apiKey: keys.apiKey.substring(0, 8) + '...',
            secretKey: keys.secretKey.substring(0, 8) + '...',
            isActive: true,
          },
        ]
      }
      return []
    }
  },

  // Создать новый API ключ
  createApiKey: async (name: string): Promise<FinikApiKey> => {
    try {
      const response = await api.post<FinikApiKey>(API_ENDPOINTS.FINIK_API_KEYS, { name })
      return response.data
    } catch (error: any) {
      throw error
    }
  },
}

// Прямой вызов Finik API (fallback)
const createPaymentDirect = async (
  request: FinikPaymentRequest,
  _keys: { apiKey: string; secretKey: string }
): Promise<FinikPaymentResponse> => {
  // В реальном приложении это должно быть на бэкенде
  // Здесь мы возвращаем mock ответ для демонстрации
  // В реальном приложении здесь должен быть вызов Finik API
  const paymentId = `finik_${Date.now()}`
  return {
    success: true,
    paymentId,
    // Используем returnUrl для демо-режима вместо реального paymentUrl
    paymentUrl: request.returnUrl || `/wallet/finik-success?paymentId=${paymentId}&status=success&orderId=${request.orderId}`,
  }
}

