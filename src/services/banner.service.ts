import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { Banner, BannerListResponse } from '@/types/banner'

export const bannerService = {
  /**
   * Получить все баннеры
   */
  getBanners: async (): Promise<Banner[]> => {
    const response = await api.get<Banner[] | BannerListResponse>(API_ENDPOINTS.BANNERS.LIST)
    
    if (Array.isArray(response.data)) {
      return response.data
    }
    if (response.data && 'items' in response.data) {
      return response.data.items
    }
    return []
  },

  /**
   * Получить активные баннеры
   */
  getActiveBanners: async (): Promise<Banner[]> => {
    const response = await api.get<Banner[] | BannerListResponse>(API_ENDPOINTS.BANNERS.ACTIVE)
    
    if (Array.isArray(response.data)) {
      return response.data
    }
    if (response.data && 'items' in response.data) {
      return response.data.items
    }
    return []
  },

  /**
   * Получить баннер по ID
   */
  getBannerById: async (id: string | number): Promise<Banner | null> => {
    const response = await api.get<Banner>(API_ENDPOINTS.BANNERS.BY_ID(id))
    return response.data
  },
}
