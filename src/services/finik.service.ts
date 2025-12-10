import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import {
  FinikApiKey,
  FinikPaymentRequest,
  FinikPaymentResponse,
  FinikPaymentStatus,
} from '@/types/finik'
import { getFinikKeys, setFinikKeys, removeFinikKeys } from '@/utils/storage'

export const finikService = {
  /**
   * Сохранить API ключи
   */
  saveApiKeys: (apiKey: string, secretKey: string): void => {
    setFinikKeys(apiKey, secretKey)
  },

  /**
   * Получить API ключи
   */
  getApiKeys: (): { apiKey: string; secretKey: string } | null => {
    return getFinikKeys()
  },

  /**
   * Удалить API ключи
   */
  removeApiKeys: (): void => {
    removeFinikKeys()
  },

  /**
   * Создать платеж через Finik
   */
  createPayment: async (request: FinikPaymentRequest): Promise<FinikPaymentResponse> => {
    try {
      const response = await api.post<FinikPaymentResponse>(
        API_ENDPOINTS.PAYMENTS.FINIK_CREATE,
        request
      )
      return response.data
    } catch (error: unknown) {
      const keys = getFinikKeys()
      if (keys) {
        // Fallback - попробовать через Payment Provider
        const providerResponse = await api.post<FinikPaymentResponse>(
          API_ENDPOINTS.PAYMENT_PROVIDER.PAYMENT,
          {
            ...request,
            provider: 'finik'
          }
        )
        return providerResponse.data
      }
      throw new Error('Finik API keys not configured')
    }
  },

  /**
   * Проверить статус платежа
   */
  checkPaymentStatus: async (paymentId: string): Promise<FinikPaymentStatus> => {
    try {
      const response = await api.get<FinikPaymentStatus>(
        API_ENDPOINTS.PAYMENTS.STATUS(paymentId)
      )
      return response.data
    } catch (error: unknown) {
      // Попробовать через Payment Provider
      const response = await api.get<FinikPaymentStatus>(
        API_ENDPOINTS.PAYMENT_PROVIDER.STATUS(paymentId)
      )
      return response.data
    }
  },

  /**
   * Отменить платеж
   */
  cancelPayment: async (paymentId: string): Promise<{ success: boolean; message?: string }> => {
    const response = await api.post<{ success: boolean; message?: string }>(
      API_ENDPOINTS.PAYMENT_PROVIDER.CANCEL(paymentId),
      {}
    )
    return response.data
  },

  /**
   * Получить список API ключей (для админов)
   */
  getApiKeysList: async (): Promise<FinikApiKey[]> => {
    try {
      const response = await api.get<FinikApiKey[]>(`${API_ENDPOINTS.PAYMENTS.FINIK_CREATE}/api-keys`)
      return response.data
    } catch (error: unknown) {
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

  /**
   * Получить доступные методы оплаты
   */
  getPaymentMethods: async (): Promise<{ id: string; name: string; icon?: string; isActive: boolean }[]> => {
    try {
      const response = await api.get<{ id: string; name: string; icon?: string; isActive: boolean }[]>(
        API_ENDPOINTS.PAYMENT_PROVIDER.METHODS
      )
      return response.data
    } catch (error: unknown) {
      return [
        { id: 'finik', name: 'Finik', isActive: true },
        { id: 'mbank', name: 'MBank', isActive: true },
        { id: 'card', name: 'Банковская карта', isActive: true }
      ]
    }
  },

  /**
   * Создать новый API ключ
   */
  createApiKey: async (name: string): Promise<FinikApiKey> => {
    const response = await api.post<FinikApiKey>(
      `${API_ENDPOINTS.PAYMENTS.FINIK_CREATE}/api-keys`,
      { name }
    )
    return response.data
  },
}
