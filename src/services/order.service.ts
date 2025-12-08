import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { Order, CreateOrderRequest } from '@/types/order'

// Мок-режим управляется только переменной VITE_DEV_MODE
const isDev = import.meta.env.VITE_DEV_MODE === 'true'

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get<Order[]>(API_ENDPOINTS.ORDERS)
      return response.data
    } catch (error: any) {
      // В DEV режиме возвращаем пустой массив вместо ошибки
      if (isDev && (
        error.response?.status === 401 || 
        error.response?.status === 404 || 
        error.response?.status === 500 || 
        !error.response ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('Network Error')
      )) {
        return []
      }
      throw error
    }
  },

  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    try {
      const response = await api.post<Order>(API_ENDPOINTS.ORDER_CREATE, data)
      return response.data
    } catch (error: any) {
      // В DEV режиме не обрабатываем ошибки создания заказа
      throw error
    }
  },
}

