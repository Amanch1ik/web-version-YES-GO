export interface PartnerCategory {
  id: number
  name: string
  iconUrl?: string
  sortOrder: number
  partnersCount?: number
}

export interface PartnerLocation {
  id: number
  partnerId: number
  name?: string
  address: string
  latitude: number
  longitude: number
  phone?: string
  workingHours?: string
  isMain: boolean
}

export interface PartnerSocialMedia {
  instagram?: string
  whatsapp?: string
  telegram?: string
  facebook?: string
  phone?: string
  website?: string
}

export interface Partner {
  id: number | string
  name: string
  description?: string
  shortDescription?: string
  logoUrl?: string
  logo?: string
  coverUrl?: string
  cashbackPercent?: number
  discount?: number
  address?: string
  phone?: string
  email?: string
  website?: string
  isActive: boolean
  isVerified?: boolean
  categoryId?: number
  category?: string
  categoryName?: string
  rating?: number
  reviewCount?: number
  ordersCount?: number
  socialMedia?: PartnerSocialMedia
  workingHours?: string
  locations?: PartnerLocation[]
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface PartnerDetail extends Partner {
  products?: Product[]
  promotions?: PartnerPromotion[]
  reviews?: Review[]
  nearbyPartners?: Partner[]
}

export interface Product {
  id: number | string
  partnerId: number | string
  name: string
  description?: string
  shortDescription?: string
  price: number
  originalPrice?: number
  imageUrl?: string
  image?: string
  images?: string[]
  category?: string
  categoryId?: number
  isAvailable: boolean
  isActive?: boolean
  discount?: number
  yessCoins?: number
  cashbackPercent?: number
  specifications?: string[]
  attributes?: Record<string, string>
  stock?: number
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
}

export interface ProductListResponse {
  items: Product[]
  total: number
  page: number
  pageSize: number
}

export interface Review {
  id: number | string
  partnerId: number | string
  userId: number | string
  userName: string
  userAvatar?: string
  rating: number
  text: string
  images?: string[]
  isVerified?: boolean
  response?: {
    text: string
    createdAt: string
  }
  createdAt: string
  updatedAt?: string
}

export interface CreateReviewRequest {
  partnerId: number | string
  rating: number
  text: string
  images?: string[]
}

export interface PartnerPromotion {
  id: number
  partnerId: number
  title: string
  description?: string
  imageUrl?: string
  discountPercent?: number
  discountAmount?: number
  startDate: string
  endDate: string
  isActive: boolean
}

export interface NearbyPartnerRequest {
  latitude: number
  longitude: number
  radius?: number // в метрах
  categoryId?: number
  limit?: number
}
