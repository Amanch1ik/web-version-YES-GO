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
import { resolveAssetUrl } from '@/utils/assets'

const normalizePartner = (p: any): Partner => {
  const logoUrl =
    p.logoUrl ||
    p.LogoUrl ||
    p.logo ||
    p.Logo ||
    p.image ||
    p.Image ||
    p.avatarUrl ||
    p.avatar ||
    p.Avatar ||
    p.photo ||
    p.Photo

  const coverUrl =
    p.coverUrl ||
    p.CoverUrl ||
    p.cover ||
    p.Cover ||
    p.coverImageUrl ||
    p.CoverImageUrl ||
    p.image ||
    p.Image ||
    p.photo ||
    p.Photo

  return {
    ...p,
    logoUrl,
    coverUrl,
  } as Partner
}

const normalizeProduct = (prod: any): Product => {
  const image =
    prod.imageUrl ||
    prod.ImageUrl ||
    prod.image ||
    prod.Image ||
    (Array.isArray(prod.images) ? prod.images[0] : undefined)

  return {
    ...prod,
    image,
    imageUrl: image,
  } as Product
}

export const partnerService = {
  /**
   * Получить список всех партнеров
   */
  getPartners: async (): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS.LIST)
    return response.data.map(normalizePartner)
  },

  /**
   * Получить партнера по ID
   */
  getPartnerById: async (id: string | number): Promise<PartnerDetail> => {
    const response = await api.get<PartnerDetail>(API_ENDPOINTS.PARTNERS.BY_ID(id))
    return normalizePartner(response.data) as PartnerDetail
  },

  /**
   * Получить партнеров по категории
   */
  getPartnersByCategory: async (category: string): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS.BY_CATEGORY(category))
    return response.data.map(normalizePartner)
  },

  /**
   * Получить партнеров по ID категории
   */
  getPartnersByCategoryId: async (categoryId: number): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS.BY_CATEGORY_ID(categoryId))
    return response.data.map(normalizePartner)
  },

  /**
   * Поиск партнеров
   */
  searchPartners: async (query: string): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(API_ENDPOINTS.PARTNERS.SEARCH(query))
    return response.data.map(normalizePartner)
  },

  /**
   * Получить ближайших партнеров
   */
  getNearbyPartners: async (data: NearbyPartnerRequest): Promise<Partner[]> => {
    const response = await api.get<Partner[]>(
      API_ENDPOINTS.PARTNERS.NEARBY(data.latitude, data.longitude, data.radius ? data.radius / 1000 : 10)
    )
    return response.data.map(normalizePartner)
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
      return response.data.map(normalizeProduct)
    }
    if (response.data && 'items' in response.data) {
      return (response.data.items as any[]).map(normalizeProduct)
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
    try {
      const response = await api.get<Review[]>(`${API_ENDPOINTS.PARTNERS.BY_ID(partnerId)}/reviews`)
      return response.data
    } catch (error: any) {
      // Если эндпоинт отсутствует или отдает 404, возвращаем пустой список, чтобы не ломать экран
      if (error?.response?.status === 404) {
        return []
      }
      throw error
    }
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
