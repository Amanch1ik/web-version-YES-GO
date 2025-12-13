import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { Banner, BannerListResponse } from '@/types/banner'

const normalizeBanner = (b: any): Banner => {
  const imageUrl =
    b.imageUrl ||
    b.ImageUrl ||
    b.image ||
    b.Image ||
    b.coverUrl ||
    b.CoverUrl ||
    b.photo ||
    b.Photo ||
    b.url ||
    b.Url ||
    ''

  return {
    ...b,
    imageUrl,
  } as Banner
}

export const bannerService = {
  /**
   * Получить все баннеры
   */
  getBanners: async (): Promise<Banner[]> => {
    const response = await api.get<Banner[] | BannerListResponse>(API_ENDPOINTS.BANNERS.LIST)
    
    let banners: any[] = []
    if (Array.isArray(response.data)) {
      banners = response.data
    } else if (response.data && 'items' in response.data) {
      banners = response.data.items
    }
    
    return banners.map(normalizeBanner)
  },

  /**
   * Получить активные баннеры
   */
  getActiveBanners: async (): Promise<Banner[]> => {
    const response = await api.get<Banner[] | BannerListResponse>(API_ENDPOINTS.BANNERS.ACTIVE)
    
    let banners: any[] = []
    if (Array.isArray(response.data)) {
      banners = response.data
    } else if (response.data && 'items' in response.data) {
      banners = response.data.items
    }
    
    return banners.map(normalizeBanner)
  },

  /**
   * Получить баннер по ID
   */
  getBannerById: async (id: string | number): Promise<Banner | null> => {
    const response = await api.get<Banner>(API_ENDPOINTS.BANNERS.BY_ID(id))
    return response.data
  },
}
