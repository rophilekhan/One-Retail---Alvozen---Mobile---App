/**
 * OneRetail API Endpoints Registry
 * Centralized API route definitions covering all PRD core features.
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/oneretail/auth/login',
    REFRESH: '/api/v1/oneretail/auth/refresh',
    LOGOUT: '/api/v1/oneretail/auth/logout',
    REGISTER: '/api/v1/oneretail/auth/register',
    SEND_OTP: '/api/v1/oneretail/auth/otp/send',
    VERIFY_OTP: '/api/v1/oneretail/auth/otp/verify',
  },
  PHARMACY: {
    PROFILE: '/api/v1/oneretail/pharmacy/profile',
    LICENSES: '/api/v1/oneretail/pharmacy/licenses',
    LOCATION: '/api/v1/oneretail/pharmacy/location',
    SKU_VISIBILITY: '/api/v1/oneretail/pharmacy/settings/sku-visibility',
  },
  TERRITORY: {
    ANALYTICS: '/api/v1/oneretail/territory/analytics',
    BENCHMARKING: '/api/v1/oneretail/territory/benchmarking',
    TOP_BRANDS: '/api/v1/oneretail/territory/top-brands',
  },
  PRESCRIPTION: {
    SCAN_QR: '/api/v1/oneretail/prescription/scan-qr',
    GENERIC_LOOKUP: (genericId) => `/api/v1/oneretail/prescription/generic/${genericId}/brands`,
    NEARBY_STOCK: '/api/v1/oneretail/prescription/nearby-stock',
    SUBSTITUTES: '/api/v1/oneretail/prescription/substitutes',
    CONFIRM_DISPENSE: '/api/v1/oneretail/prescription/dispense-confirmation',
    HISTORY: '/api/v1/oneretail/prescription/history',
  },
  WALLET: {
    PII_SUMMARY: '/api/v1/oneretail/wallet/pii-summary',
    EARNINGS: '/api/v1/oneretail/wallet/earnings',
    CASHOUT_REQUEST: '/api/v1/oneretail/wallet/cashout/request',
    CASHOUT_HISTORY: '/api/v1/oneretail/wallet/cashout/history',
  },
  STAFF: {
    LIST: '/api/v1/oneretail/staff',
    CREATE: '/api/v1/oneretail/staff',
    UPDATE: (staffId) => `/api/v1/oneretail/staff/${staffId}`,
    TOGGLE_STATUS: (staffId) => `/api/v1/oneretail/staff/${staffId}/toggle-status`,
    RESET_PASSWORD: (staffId) => `/api/v1/oneretail/staff/${staffId}/reset-password`,
  },
  TRADE_SCHEMES: {
    LIST: '/api/v1/oneretail/schemes/list',
    DETAIL: (id) => `/api/v1/oneretail/schemes/${id}`,
    BOOK: '/api/v1/oneretail/schemes/book',
  },
  DISTRIBUTOR: {
    ORDERS: '/api/v1/oneretail/distributor/orders',
    DRAFT_PO: '/api/v1/oneretail/distributor/orders/draft',
    APPROVE_PO: (orderId) => `/api/v1/oneretail/distributor/orders/${orderId}/approve`,
    EXPIRY_BATCHES: '/api/v1/oneretail/distributor/expiry/batches',
    LOG_EXPIRY: '/api/v1/oneretail/distributor/expiry/log',
    AUTHORIZE_CREDIT: (batchId) => `/api/v1/oneretail/distributor/expiry/${batchId}/authorize-credit`,
  },
  ENGAGE: {
    MODULES: '/api/v1/oneretail/engage/modules',
    COMPLETE: (moduleId) => `/api/v1/oneretail/engage/modules/${moduleId}/complete`,
    SURVEYS: '/api/v1/oneretail/engage/surveys',
  },
  SETTINGS: {
    PREFERENCES: '/api/v1/oneretail/settings/preferences',
    PRIVACY_CONTROLS: '/api/v1/oneretail/settings/privacy',
  },
};

export default ENDPOINTS;
