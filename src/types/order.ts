export interface Order {
  id: string
  partnerId: string
  partnerName: string
  products: OrderProduct[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface OrderProduct {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface CreateOrderRequest {
  partnerId: string
  products: {
    productId: string
    quantity: number
  }[]
}

