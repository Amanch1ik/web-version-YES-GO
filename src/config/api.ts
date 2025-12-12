// Базовый URL backend API. Продакшн-домен API: https://api.yessgo.org
// Можно переопределить через VITE_API_BASE_URL в .env при необходимости.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yessgo.org'

// Версия API
const API_VERSION = '/v1'

export const API_ENDPOINTS = {
  // ==================== Authentication ====================
  AUTH: {
    LOGIN: `${API_VERSION}/auth/login`,
    LOGIN_JSON: `${API_VERSION}/auth/login/json`,
    REGISTER: `${API_VERSION}/auth/register`,
    ME: `${API_VERSION}/auth/me`,
    REFRESH: `${API_VERSION}/auth/refresh`,
    RESET_PASSWORD: `${API_VERSION}/auth/reset-password`,
    SEND_CODE: `${API_VERSION}/auth/send-code`,
    SEND_VERIFICATION_CODE: `${API_VERSION}/auth/send-verification-code`,
    VERIFY_CODE: `${API_VERSION}/auth/verify-code`,
    REFERRAL_STATS: `${API_VERSION}/auth/referral-stats`,
    // Social OAuth
    GOOGLE_LOGIN: `${API_VERSION}/auth/google`,
    GOOGLE_CALLBACK: `${API_VERSION}/auth/google/callback`,
    APPLE_LOGIN: `${API_VERSION}/auth/apple`,
    APPLE_CALLBACK: `${API_VERSION}/auth/apple/callback`,
  },

  // ==================== User/Profile ====================
  USER: {
    PROFILE: `${API_VERSION}/auth/me`,
    UPDATE: `${API_VERSION}/users/me`,
    DELETE: `${API_VERSION}/users/me`,
  },

  // ==================== Wallet ====================
  WALLET: {
    GET: `${API_VERSION}/wallet`,
    BALANCE: `${API_VERSION}/wallet/balance`,
    TRANSACTIONS: `${API_VERSION}/wallet/transactions`,
    HISTORY: `${API_VERSION}/wallet/history`,
    SYNC: `${API_VERSION}/wallet/sync`,
    TOPUP: `${API_VERSION}/wallet/topup`,
    WEBHOOK: `${API_VERSION}/wallet/webhook`,
  },

  // ==================== Payments ====================
  PAYMENTS: {
    BALANCE: `${API_VERSION}/payments/balance`,
    TRANSACTIONS: `${API_VERSION}/payments/transactions`,
    CREATE: `${API_VERSION}/payments/create`,
    FINIK_CREATE: `${API_VERSION}/payment/finik/create`,
    STATUS: (id: string) => `${API_VERSION}/payments/${id}/status`,
  },

  // ==================== Partners ====================
  PARTNERS: {
    LIST: `${API_VERSION}/partners/list`,
    BY_ID: (id: string | number) => `${API_VERSION}/partners/${id}`,
    BY_CATEGORY: (category: string) => `${API_VERSION}/partners/list?category=${encodeURIComponent(category)}`,
    BY_CATEGORY_ID: (categoryId: number) => `${API_VERSION}/partners/list?categoryId=${categoryId}`,
    SEARCH: (query: string) => `${API_VERSION}/partners/list?query=${encodeURIComponent(query)}`,
    LOCATIONS: `${API_VERSION}/partners/locations`,
    NEARBY: (lat: number, lon: number, radius: number = 10) => 
      `${API_VERSION}/partners/locations?latitude=${lat}&longitude=${lon}&radius=${radius}`,
    CATEGORIES: `${API_VERSION}/partner/categories`,
    PRODUCTS: (partnerId: string | number) => `${API_VERSION}/partners/${partnerId}/products`,
    PRODUCT_BY_ID: (partnerId: string | number, productId: string | number) => 
      `${API_VERSION}/partners/${partnerId}/products/${productId}`,
  },

  // ==================== Orders ====================
  ORDERS: {
    LIST: `${API_VERSION}/orders`,
    CREATE: `${API_VERSION}/orders`,
    CALCULATE: `${API_VERSION}/orders/calculate`,
    BY_ID: (id: string) => `${API_VERSION}/orders/${id}`,
    PAYMENT: (orderId: string) => `${API_VERSION}/orders/${orderId}/payment`,
    PAYMENT_STATUS: (orderId: string) => `${API_VERSION}/orders/${orderId}/payment/status`,
  },

  // ==================== QR Code ====================
  QR: {
    SCAN: `${API_VERSION}/qr/scan`,
    PAY: `${API_VERSION}/qr/pay`,
    GENERATE: (partnerId: string | number) => `${API_VERSION}/qr/generate/${partnerId}`,
  },

  // ==================== Notifications ====================
  NOTIFICATIONS: {
    LIST: `${API_VERSION}/notifications`,
    ME: `${API_VERSION}/notifications/me`,
    SEND: `${API_VERSION}/notifications/send`,
    SEND_BULK: `${API_VERSION}/notifications/send-bulk`,
    BY_USER: (userId: string | number) => `${API_VERSION}/notifications/user/${userId}`,
    MARK_READ: (id: string | number) => `${API_VERSION}/notifications/${id}/read`,
    MARK_ALL_READ: (userId: string | number) => `${API_VERSION}/notifications/user/${userId}/mark-all-read`,
    UNREAD_COUNT: (userId: string | number) => `${API_VERSION}/notifications/user/${userId}/unread-count`,
    STATS: `${API_VERSION}/notifications/stats`,
    TEMPLATES: `${API_VERSION}/notifications/templates`,
    SEND_TEMPLATE: (templateId: string | number) => `${API_VERSION}/notifications/send-template/${templateId}`,
  },

  // ==================== Promotions & Promo Codes ====================
  PROMOTIONS: {
    LIST: `${API_VERSION}/promotions`,
    BY_ID: (id: string | number) => `${API_VERSION}/promotions/${id}`,
    PROMO_CODES: `${API_VERSION}/promotions/promo-codes`,
    PROMO_CODE_BY_CODE: (code: string) => `${API_VERSION}/promotions/promo-codes/${encodeURIComponent(code)}`,
    APPLY_CODE: `${API_VERSION}/promotions/apply-code`,
    VALIDATE_CODE: `${API_VERSION}/promotions/validate-code`,
    USER_PROMO_CODES: (userId: string | number) => `${API_VERSION}/promotions/user/${userId}/promo-codes`,
    STATS: `${API_VERSION}/promotions/stats`,
    CHECK_USAGE: (code: string) => `${API_VERSION}/promotions/check-usage/${encodeURIComponent(code)}`,
  },

  // ==================== Banners ====================
  BANNERS: {
    LIST: `${API_VERSION}/banners`,
    ACTIVE: `${API_VERSION}/banners?active=true`,
    BY_ID: (id: string | number) => `${API_VERSION}/banners/${id}`,
  },

  // ==================== Stories ====================
  STORIES: {
    LIST: `${API_VERSION}/stories`,
    BY_ID: (id: string | number) => `${API_VERSION}/stories/${id}`,
    VIEW: (id: string | number) => `${API_VERSION}/stories/${id}/view`,
    CLICK: (id: string | number) => `${API_VERSION}/stories/${id}/click`,
  },

  // ==================== Achievements ====================
  ACHIEVEMENTS: {
    LIST: `${API_VERSION}/achievements`,
    BY_ID: (id: string | number) => `${API_VERSION}/achievements/${id}`,
    BY_USER: (userId: string | number) => `${API_VERSION}/achievements/user/${userId}`,
    USER_LEVEL: (userId: string | number) => `${API_VERSION}/achievements/user/${userId}/level`,
    REWARDS_BY_LEVEL: (level: number) => `${API_VERSION}/achievements/rewards/level/${level}`,
    CLAIM_REWARD: (rewardId: string | number) => `${API_VERSION}/achievements/claim-reward/${rewardId}`,
    STATS: `${API_VERSION}/achievements/stats`,
    CHECK: `${API_VERSION}/achievements/check`,
  },

  // ==================== Routes ====================
  ROUTES: {
    CALCULATE: `${API_VERSION}/routes/calculate`,
    OPTIMIZE: `${API_VERSION}/routes/optimize`,
    NAVIGATION: `${API_VERSION}/routes/navigation`,
    OSRM: `${API_VERSION}/routes/osrm`,
    TRANSIT: `${API_VERSION}/routes/transit`,
  },

  // ==================== Location ====================
  LOCATION: {
    PROXIMITY_CHECK: `${API_VERSION}/locations/proximity-check`,
  },

  // ==================== Banks ====================
  BANKS: {
    LIST: `${API_VERSION}/banks`,
    BY_CODE: (code: string) => `${API_VERSION}/banks/${code}`,
    CHECK_CARD: `${API_VERSION}/banks/check-card`,
    TRANSFER: `${API_VERSION}/banks/transfer`,
    TRANSFER_STATUS: (transactionId: string) => `${API_VERSION}/banks/transfer/${transactionId}/status`,
    BALANCE: (cardNumber: string) => `${API_VERSION}/banks/balance/${cardNumber}`,
    HISTORY: (cardNumber: string) => `${API_VERSION}/banks/history/${cardNumber}`,
  },

  // ==================== File Upload ====================
  UPLOAD: {
    AVATAR: `${API_VERSION}/upload/avatar`,
    PARTNER_LOGO: (partnerId: string | number) => `${API_VERSION}/upload/partner/logo/${partnerId}`,
    PARTNER_COVER: (partnerId: string | number) => `${API_VERSION}/upload/partner/cover/${partnerId}`,
  },

  // ==================== Admin ====================
  ADMIN: {
    FILE_UPLOAD: {
      AVATAR: `${API_VERSION}/admin/upload/avatar`,
    },
    STORIES: {
      LIST: `${API_VERSION}/admin/stories`,
      CREATE: `${API_VERSION}/admin/stories`,
      BY_ID: (storyId: string | number) => `${API_VERSION}/admin/stories/${storyId}`,
      UPDATE: (storyId: string | number) => `${API_VERSION}/admin/stories/${storyId}`,
      DELETE: (storyId: string | number) => `${API_VERSION}/admin/stories/${storyId}`,
      TOGGLE: (storyId: string | number) => `${API_VERSION}/admin/stories/${storyId}/toggle`,
      STATS_BY_ID: (storyId: string | number) => `${API_VERSION}/admin/stories/${storyId}/stats`,
      STATS: `${API_VERSION}/admin/stories/stats`,
    },
  },

  // ==================== Unified API ====================
  UNIFIED: {
    RECOMMENDATIONS: `${API_VERSION}/unified/recommendations`,
    ROUTE: `${API_VERSION}/unified/route`,
    WALLET: `${API_VERSION}/unified/wallet`,
    PROMOTIONS: `${API_VERSION}/unified/promotions`,
    NEARBY_PARTNERS: `${API_VERSION}/unified/nearby-partners`,
    USER_STATS: `${API_VERSION}/unified/user-stats`,
    PARTNER: (partnerId: string | number) => `${API_VERSION}/unified/partner/${partnerId}`,
  },

  // ==================== Webhooks ====================
  WEBHOOKS: {
    FINIK: `${API_VERSION}/webhooks/finik`,
    PAYMENT_CALLBACK: `${API_VERSION}/webhooks/payment/callback`,
  },

  // ==================== Optima Payment ====================
  OPTIMA: {
    PAYMENT: `${API_VERSION}/optima/payment`,
  },

  // ==================== Payment Provider ====================
  PAYMENT_PROVIDER: {
    PAYMENT: `${API_VERSION}/payment-provider/payment`,
    STATUS: (transactionId: string) => `${API_VERSION}/payment-provider/payment/${transactionId}/status`,
    CANCEL: (transactionId: string) => `${API_VERSION}/payment-provider/payment/${transactionId}/cancel`,
    METHODS: `${API_VERSION}/payment-provider/methods`,
  },

  // ==================== Health ====================
  HEALTH: `${API_VERSION}/health`,
}

// Legacy endpoints для обратной совместимости
export const LEGACY_ENDPOINTS = {
  AUTH_LOGIN: API_ENDPOINTS.AUTH.LOGIN,
  AUTH_REGISTER: API_ENDPOINTS.AUTH.REGISTER,
  AUTH_ME: API_ENDPOINTS.AUTH.ME,
  AUTH_REFRESH: API_ENDPOINTS.AUTH.REFRESH,
  USER_PROFILE: API_ENDPOINTS.USER.PROFILE,
  USER_UPDATE: API_ENDPOINTS.USER.UPDATE,
  USER_DELETE: API_ENDPOINTS.USER.DELETE,
  WALLET_BALANCE: API_ENDPOINTS.PAYMENTS.BALANCE,
  WALLET_TRANSACTIONS: API_ENDPOINTS.PAYMENTS.TRANSACTIONS,
  QR_SCAN: API_ENDPOINTS.QR.SCAN,
  PARTNERS: API_ENDPOINTS.PARTNERS.LIST,
  PARTNER_PRODUCTS: `${API_VERSION}/partners/:id/products`,
  ORDERS: API_ENDPOINTS.ORDERS.LIST,
  ORDER_CREATE: API_ENDPOINTS.ORDERS.CREATE,
  FINIK_CREATE_PAYMENT: API_ENDPOINTS.PAYMENTS.FINIK_CREATE,
  FINIK_PAYMENT_STATUS: `${API_VERSION}/payments/:id/status`,
  FINIK_API_KEYS: `${API_VERSION}/finik/api-keys`,
  FINIK_WEBHOOK: `${API_VERSION}/finik/webhook`,
}
