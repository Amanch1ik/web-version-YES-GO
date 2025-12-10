export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'ready' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'wallet' | 'card' | 'cash' | 'finik' | 'mbank'

export interface OrderProduct {
  productId: string | number
  productName: string
  quantity: number
  price: number
  originalPrice?: number
  imageUrl?: string
  discount?: number
  subtotal: number
}

export interface Order {
  id: string
  userId: number
  partnerId: number | string
  partnerName: string
  partnerLogo?: string
  products: OrderProduct[]
  subtotal: number
  discount: number
  coinsUsed: number
  coinsEarned: number
  deliveryFee?: number
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  promoCode?: string
  promoDiscount?: number
  notes?: string
  deliveryAddress?: string
  contactPhone?: string
  createdAt: string
  updatedAt?: string
  confirmedAt?: string
  completedAt?: string
  cancelledAt?: string
  cancellationReason?: string
}

export interface CreateOrderRequest {
  partnerId: string | number
  products: {
    productId: string | number
    quantity: number
  }[]
  promoCode?: string
  useCoins?: boolean
  coinsToUse?: number
  paymentMethod?: PaymentMethod
  notes?: string
  deliveryAddress?: string
  contactPhone?: string
}

export interface OrderCalculateRequest {
  partnerId: string | number
  products: {
    productId: string | number
    quantity: number
  }[]
  promoCode?: string
  useCoins?: boolean
  coinsToUse?: number
}

export interface OrderCalculateResponse {
  subtotal: number
  discount: number
  promoDiscount?: number
  coinsDiscount?: number
  deliveryFee?: number
  totalAmount: number
  coinsToEarn: number
  maxCoinsUsable: number
  isPromoCodeValid?: boolean
  promoCodeMessage?: string
}

export interface OrderPaymentRequest {
  orderId: string
  paymentMethod: PaymentMethod
  cardNumber?: string
  returnUrl?: string
}

export interface OrderPaymentResponse {
  success: boolean
  transactionId: string
  paymentUrl?: string
  message?: string
  order?: Order
}

export interface OrderPaymentStatus {
  orderId: string
  paymentStatus: PaymentStatus
  transactionId?: string
  paidAt?: string
  failureReason?: string
}
