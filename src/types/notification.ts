export type NotificationType = 'push' | 'sms' | 'email' | 'inapp' | 'in_app'
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Notification {
  id: number
  userId: number
  title: string
  body: string
  type: NotificationType
  isRead: boolean
  createdAt: string
  readAt?: string
  data?: Record<string, unknown>
}

export interface NotificationListResponse {
  notifications: Notification[]
  total: number
  page: number
  perPage: number
}

export interface UnreadCountResponse {
  unreadCount: number
}

export interface SendNotificationRequest {
  userId: number
  title: string
  body: string
  type?: NotificationType
  data?: Record<string, unknown>
}

export interface BulkNotificationRequest {
  userIds: number[]
  title: string
  body: string
  type?: NotificationType
  data?: Record<string, unknown>
}

export interface NotificationTemplate {
  id: number
  name: string
  title: string
  body: string
  type: NotificationType
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

