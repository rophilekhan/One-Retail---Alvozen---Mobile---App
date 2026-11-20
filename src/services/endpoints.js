/**
 * OneRetail API Endpoints Registry
 */
export const ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/api/v1/oneretail/auth/sign-in',
    REFRESH: '/api/v1/oneretail/auth/refresh',
    OTP_REQUEST: '/api/v1/oneretail/auth/otp/request',
    OTP_VERIFY: '/api/v1/oneretail/auth/otp/verify',
    SET_CREDENTIALS: '/api/v1/oneretail/auth/set-credentials',
    LOGOUT: '/api/v1/oneretail/auth/logout',
  },
  PHARMACY: {
    PROFILE: '/api/v1/oneretail/pharmacy/profile',
    UPDATE_LICENSES: '/api/v1/oneretail/pharmacy/licenses',
    TERRITORY: '/api/v1/oneretail/pharmacy/territory',
    PII: '/api/v1/oneretail/pharmacy/impact-index',
    WALLET: '/api/v1/oneretail/pharmacy/wallet',
    CASHOUT: '/api/v1/oneretail/pharmacy/wallet/cashout',
    SKU_VISIBILITY: '/api/v1/oneretail/pharmacy/settings/sku-visibility',
  },
  STAFF: {
    LIST: '/api/v1/oneretail/staff',
    CREATE: '/api/v1/oneretail/staff',
    UPDATE: (id) => `/api/v1/oneretail/staff/${id}`,
    TOGGLE_STATUS: (id) => `/api/v1/oneretail/staff/${id}/status`,
    CHANGE_PASSWORD: (id) => `/api/v1/oneretail/staff/${id}/password`,
  },
  PRESCRIPTION: {
    SCAN_QR: '/api/v1/oneretail/prescription/scan',
    LOOKUP_GENERIC: (genericId) => `/api/v1/oneretail/prescription/generic/${genericId}/brands`,
    SUBSTITUTES: '/api/v1/oneretail/prescription/substitutes',
    CONFIRM_DISPENSE: '/api/v1/oneretail/prescription/dispense',
    NEARBY_STOCK: '/api/v1/oneretail/prescription/nearby-stock',
    HISTORY: '/api/v1/oneretail/prescription/history',
  },
  ANALYTICS: {
    DASHBOARD: '/api/v1/oneretail/analytics/dashboard',
    DAILY_SUMMARY: '/api/v1/oneretail/analytics/daily-summary',
    TERRITORY_BENCHMARK: '/api/v1/oneretail/analytics/territory-benchmark',
    TOP_BRANDS: '/api/v1/oneretail/analytics/top-brands',
  },
  TRADE_SCHEMES: {
    ACTIVE: '/api/v1/oneretail/schemes/active',
    DISTRIBUTORS: '/api/v1/oneretail/distributors',
  },
};

export default ENDPOINTS;
