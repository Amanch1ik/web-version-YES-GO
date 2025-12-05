import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { Partner, Product } from '@/types/partner'

// Моковые данные для fallback
const mockPartners: Partner[] = []

export const partnerService = {
  getPartners: async (): Promise<Partner[]> => {
    try {
      const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS)
      return response.data
    } catch (error: any) {
      // Если ошибка 500 или сервер недоступен, возвращаем моковые данные
      // Подавляем ошибки 500, чтобы они не попадали в консоль
      if (error?.name === 'SilentError' || error?.response?.status >= 500 || !error?.response || error?.response?.status === 0) {
        return mockPartners
      }
      throw error
    }
  },

  getPartnerProducts: async (partnerId: string): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(
        API_ENDPOINTS.PARTNER_PRODUCTS.replace(':id', partnerId)
      )
      return response.data
    } catch (error: any) {
      // Если ошибка 500 или сервер недоступен, возвращаем пустой массив
      // Подавляем ошибки 500, чтобы они не попадали в консоль
      if (error?.name === 'SilentError' || error?.response?.status >= 500 || !error?.response || error?.response?.status === 0) {
        return []
      }
      throw error
    }
  },
}

