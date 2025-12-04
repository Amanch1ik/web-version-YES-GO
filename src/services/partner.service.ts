import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { Partner, Product } from '@/types/partner'

export const partnerService = {
  getPartners: async (): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS)
    return response.data
  },

  getPartnerProducts: async (partnerId: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(
      API_ENDPOINTS.PARTNER_PRODUCTS.replace(':id', partnerId)
    )
    return response.data
  },
}

