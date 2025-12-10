import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { 
  Partner, 
  PartnerDetail,
  Product, 
  ProductListResponse,
  PartnerCategory,
  Review,
  CreateReviewRequest,
  NearbyPartnerRequest
} from '@/types/partner'

export const partnerService = {
  /**
   * Получить список всех партнеров
   */
  getPartners: async (): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS.LIST)
    return response.data
  },

  /**
   * Получить партнера по ID
   */
  getPartnerById: async (id: string | number): Promise<PartnerDetail> => {
    const response = await api.get<PartnerDetail>(API_ENDPOINTS.PARTNERS.BY_ID(id))
    return response.data
  },

  /**
   * Получить партнеров по категории
   */
  getPartnersByCategory: async (category: string): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS.BY_CATEGORY(category))
    return response.data
  },

  /**
   * Получить партнеров по ID категории
   */
  getPartnersByCategoryId: async (categoryId: number): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS.BY_CATEGORY_ID(categoryId))
    return response.data
  },

  /**
   * Поиск партнеров
   */
  searchPartners: async (query: string): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS.SEARCH(query))
    return response.data
  },

  /**
   * Получить ближайших партнеров
   */
  getNearbyPartners: async (data: NearbyPartnerRequest): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(
      API_ENDPOINTS.PARTNERS.NEARBY(data.latitude, data.longitude, data.radius ? data.radius / 1000 : 10)
    )
    return response.data
  },

  /**
   * Получить категории партнеров
   */
  getCategories: async (): Promise<PartnerCategory[]> => {
    const response = await api.get<PartnerCategory[]>(API_ENDPOINTS.PARTNERS.CATEGORIES)
    return response.data
  },

  /**
   * Получить продукты партнера
   */
  getPartnerProducts: async (partnerId: string | number): Promise<Product[]> => {
    const response = await api.get<Product[] | ProductListResponse>(
      API_ENDPOINTS.PARTNERS.PRODUCTS(partnerId)
    )
    
    // Обрабатываем разные форматы ответа
    if (Array.isArray(response.data)) {
      return response.data
    }
    if (response.data && 'items' in response.data) {
      return response.data.items
    }
    return []
  },

  /**
   * Получить продукт по ID
   */
  getProductById: async (partnerId: string | number, productId: string | number): Promise<Product | null> => {
    const response = await api.get<Product>(
      API_ENDPOINTS.PARTNERS.PRODUCT_BY_ID(partnerId, productId)
    )
    return response.data
  },

  /**
   * Получить отзывы партнера
   */
  getPartnerReviews: async (partnerId: string | number): Promise<Review[]> => {
    const response = await api.get<Review[]>(`${API_ENDPOINTS.PARTNERS.BY_ID(partnerId)}/reviews`)
    return response.data
  },

  /**
   * Добавить отзыв
   */
  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await api.post<Review>(
      `${API_ENDPOINTS.PARTNERS.BY_ID(data.partnerId)}/reviews`,
      data
    )
    return response.data
  },
}
