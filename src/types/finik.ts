export interface FinikApiKey {
  id?: string
  name: string
  apiKey: string
  secretKey: string
  accountId?: string
  isActive: boolean
  createdAt?: string
}

export interface FinikPaymentRequest {
  amount: number
  currency: string
  orderId: string
  description?: string
  returnUrl: string
  accountId?: string
}

export interface FinikPaymentResponse {
  success: boolean
  paymentId?: string
  paymentUrl?: string
  error?: string
  message?: string
}

export interface FinikPaymentStatus {
  paymentId: string
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  amount: number
  currency: string
  orderId: string
  createdAt: string
  paidAt?: string
}

export interface FinikWebhookPayload {
  paymentId: string
  status: string
  amount: number
  currency: string
  orderId: string
  signature: string
}

