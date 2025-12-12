import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { 
  Order, 
  CreateOrderRequest,
  OrderCalculateRequest,
  OrderCalculateResponse,
  OrderPaymentRequest,
  OrderPaymentResponse,
  OrderPaymentStatus
} from '@/types/order'
import { getToken } from '@/utils/storage'

export const orderService = {
  /**
   * Получить список заказов пользователя
   */
  getOrders: async (): Promise<Order[]> => {
    const token = getToken()
    const isDevMode = import.meta.env.VITE_DEV_MODE === 'true'
    // В dev с dev-token возвращаем пустой список, чтобы не ловить 401 от отсутствующего пользователя
    if (isDevMode && token === 'dev-token') {
      return []
    }
    const response = await api.get<Order[]>(API_ENDPOINTS.ORDERS.LIST)
    return response.data
  },

  /**
   * Получить заказ по ID
   */
  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(API_ENDPOINTS.ORDERS.BY_ID(id))
    return response.data
  },

  /**
   * Рассчитать стоимость заказа
   */
  calculateOrder: async (data: OrderCalculateRequest): Promise<OrderCalculateResponse> => {
    const response = await api.post<OrderCalculateResponse>(API_ENDPOINTS.ORDERS.CALCULATE, data)
    return response.data
  },

  /**
   * Создать заказ
   */
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>(API_ENDPOINTS.ORDERS.CREATE, data)
    return response.data
  },

  /**
   * Оплатить заказ
   */
  payOrder: async (data: OrderPaymentRequest): Promise<OrderPaymentResponse> => {
    const response = await api.post<OrderPaymentResponse>(
      API_ENDPOINTS.ORDERS.PAYMENT(data.orderId),
      data
    )
    return response.data
  },

  /**
   * Получить статус оплаты заказа
   */
  getPaymentStatus: async (orderId: string): Promise<OrderPaymentStatus> => {
    const response = await api.get<OrderPaymentStatus>(
      API_ENDPOINTS.ORDERS.PAYMENT_STATUS(orderId)
    )
    return response.data
  },

  /**
   * Отменить заказ
   */
  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    const response = await api.post<Order>(
      `${API_ENDPOINTS.ORDERS.BY_ID(orderId)}/cancel`,
      { reason }
    )
    return response.data
  },
}
