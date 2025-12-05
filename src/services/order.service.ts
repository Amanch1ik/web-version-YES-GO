import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { Order, CreateOrderRequest } from '@/types/order'

// Моковые данные для fallback
const mockOrders: Order[] = []

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get<Order[]>(API_ENDPOINTS.ORDERS)
      return response.data
    } catch (error: any) {
      // Если ошибка 500 или сервер недоступен, возвращаем моковые данные
      // Подавляем ошибки 500, чтобы они не попадали в консоль
      if (error?.name === 'SilentError' || error?.response?.status >= 500 || !error?.response || error?.response?.status === 0) {
        return mockOrders
      }
      throw error
    }
  },

  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>(API_ENDPOINTS.ORDER_CREATE, data)
    return response.data
  },
}

