import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { 
  QRGenerateRequest,
  QRGenerateResponse,
  QRScanRequest,
  QRScanResponse,
  QRPayRequest,
  QRPayResponse,
  QRValidateResponse
} from '@/types/qr'

export const qrService = {
  /**
   * Сканировать QR-код
   */
  scan: async (data: QRScanRequest): Promise<QRScanResponse> => {
    const response = await api.post<QRScanResponse>(API_ENDPOINTS.QR.SCAN, data)
    return response.data
  },

  /**
   * Оплатить по QR-коду
   */
  pay: async (data: QRPayRequest): Promise<QRPayResponse> => {
    const response = await api.post<QRPayResponse>(API_ENDPOINTS.QR.PAY, data)
    return response.data
  },

  /**
   * Сгенерировать QR-код для партнера
   */
  generate: async (data: QRGenerateRequest): Promise<QRGenerateResponse> => {
    const response = await api.post<QRGenerateResponse>(
      API_ENDPOINTS.QR.GENERATE(data.partnerId),
      {
        amount: data.amount,
        description: data.description,
        validityMinutes: data.validityMinutes
      }
    )
    return response.data
  },

  /**
   * Валидировать QR-код (без выполнения действия)
   */
  validate: async (qrCode: string): Promise<QRValidateResponse> => {
    try {
      // Пробуем сканировать без суммы для валидации
      const response = await api.post<QRScanResponse>(API_ENDPOINTS.QR.SCAN, {
        qrCode,
        validateOnly: true
      })
      
      return {
        isValid: response.data.success,
        type: response.data.type,
        message: response.data.message,
        partnerId: response.data.partnerId,
        partnerName: response.data.partnerName,
        amount: response.data.amount
      }
    } catch (error: unknown) {
      return {
        isValid: false,
        message: 'Недействительный QR-код'
      }
    }
  },

  /**
   * Применить QR-код чека/сертификата
   */
  applyQrCode: async (qrCode: string): Promise<QRScanResponse> => {
    const response = await api.post<QRScanResponse>(API_ENDPOINTS.QR.SCAN, {
      qrCode
    })
    return response.data
  },
}

