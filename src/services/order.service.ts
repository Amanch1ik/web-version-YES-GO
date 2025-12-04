import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { Order, CreateOrderRequest } from '@/types/order'

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>(API_ENDPOINTS.ORDERS)
    return response.data
  },

  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>(API_ENDPOINTS.ORDER_CREATE, data)
    return response.data
  },
}

