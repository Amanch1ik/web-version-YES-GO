import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { Partner, Product } from '@/types/partner'

const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'

export const partnerService = {
  getPartners: async (): Promise<Partner[]> => {
    try {
      const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS)
      return response.data
    } catch (error: any) {
      // В DEV режиме возвращаем пустой массив вместо ошибки
      if (isDev && (
        error.response?.status === 401 || 
        error.response?.status === 404 || 
        error.response?.status === 500 || 
        !error.response ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('Network Error')
      )) {
        return []
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
      // В DEV режиме возвращаем пустой массив вместо ошибки
      if (isDev && (
        error.response?.status === 401 || 
        error.response?.status === 404 || 
        error.response?.status === 500 || 
        !error.response ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('Network Error')
      )) {
        return []
      }
      throw error
    }
  },
}

