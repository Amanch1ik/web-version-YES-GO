export type QRCodeType = 'payment' | 'partner' | 'product' | 'promotion' | 'certificate'

export interface QRGenerateRequest {
  partnerId: number
  amount?: number
  description?: string
  validityMinutes?: number
}

export interface QRGenerateResponse {
  qrCode: string
  qrCodeUrl: string
  expiresAt: string
  transactionId?: string
}

export interface QRScanRequest {
  qrCode: string
  amount?: number
}

export interface QRScanResponse {
  success: boolean
  type: QRCodeType
  message?: string
  partnerId?: number
  partnerName?: string
  partnerLogo?: string
  amount?: number
  coinsEarned?: number
  addedCoins?: number  // Alias for coinsEarned
  newBalance?: number
  transactionId?: string
  promotionId?: number
  productId?: number
}

export interface QRPayRequest {
  qrCode: string
  amount: number
  useCoins?: boolean
  coinsToUse?: number
}

export interface QRPayResponse {
  success: boolean
  message?: string
  transactionId: string
  amountPaid: number
  coinsUsed?: number
  coinsEarned?: number
  newBalance?: number
  newCoinsBalance?: number
  receipt?: QRPaymentReceipt
}

export interface QRPaymentReceipt {
  receiptId: string
  partnerId: number
  partnerName: string
  amount: number
  coinsUsed: number
  coinsEarned: number
  discount?: number
  timestamp: string
}

export interface QRValidateResponse {
  isValid: boolean
  type?: QRCodeType
  message?: string
  partnerId?: number
  partnerName?: string
  amount?: number
  expiresAt?: string
}

