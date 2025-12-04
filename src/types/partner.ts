export interface Partner {
  id: string
  name: string
  description?: string
  logo?: string
  address?: string
  phone?: string
  isActive: boolean
  category?: string
  discount?: number
  rating?: number
  reviewCount?: number
  socialMedia?: {
    instagram?: string
    whatsapp?: string
    phone?: string
  }
}

export interface Product {
  id: string
  partnerId: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  image?: string
  category?: string
  isAvailable: boolean
  discount?: number
  yessCoins?: number
  specifications?: string[]
}

export interface Review {
  id: string
  partnerId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  text: string
  createdAt: string
  updatedAt?: string
}
