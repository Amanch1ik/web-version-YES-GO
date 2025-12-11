import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { getToken } from '@/utils/storage'
import { 
  Notification, 
  NotificationListResponse,
  UnreadCountResponse,
  SendNotificationRequest,
  BulkNotificationRequest
} from '@/types/notification'

export const notificationService = {
  /**
   * Получить уведомления текущего пользователя
   */
  getMyNotifications: async (page: number = 1, perPage: number = 20): Promise<NotificationListResponse> => {
    const token = getToken()
    const isDevMode = import.meta.env.VITE_DEV_MODE === 'true'

    if (isDevMode && token === 'dev-token') {
      return {
        notifications: [],
        totalCount: 0,
        page,
        pageSize: perPage,
      }
    }

    const response = await api.get<NotificationListResponse>(
      `${API_ENDPOINTS.NOTIFICATIONS.ME}?page=${page}&per_page=${perPage}`
    )
    return response.data
  },

  /**
   * Получить уведомления пользователя по ID
   */
  getUserNotifications: async (userId: string | number, page: number = 1, perPage: number = 20): Promise<NotificationListResponse> => {
    const response = await api.get<NotificationListResponse>(
      `${API_ENDPOINTS.NOTIFICATIONS.BY_USER(userId)}?page=${page}&per_page=${perPage}`
    )
    return response.data
  },

  /**
   * Отметить уведомление как прочитанное
   */
  markAsRead: async (notificationId: string | number): Promise<void> => {
    await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId), {})
  },

  /**
   * Отметить все уведомления как прочитанные
   */
  markAllAsRead: async (userId: string | number): Promise<void> => {
    await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(userId), {})
  },

  /**
   * Получить количество непрочитанных уведомлений
   */
  getUnreadCount: async (userId: string | number): Promise<number> => {
    const response = await api.get<UnreadCountResponse>(
      API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT(userId)
    )
    return response.data.unreadCount
  },

  /**
   * Отправить уведомление (для админов)
   */
  sendNotification: async (data: SendNotificationRequest): Promise<Notification> => {
    const response = await api.post<Notification>(API_ENDPOINTS.NOTIFICATIONS.SEND, data)
    return response.data
  },

  /**
   * Отправить уведомление нескольким пользователям (для админов)
   */
  sendBulkNotification: async (data: BulkNotificationRequest): Promise<{ sent: number; failed: number }> => {
    const response = await api.post<{ sent: number; failed: number }>(
      API_ENDPOINTS.NOTIFICATIONS.SEND_BULK,
      data
    )
    return response.data
  },
}
