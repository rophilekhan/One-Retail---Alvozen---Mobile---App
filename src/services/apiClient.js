import { Platform } from 'react-native';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import secureStorage from './secureStorage.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { AppToast } from '../components/core/AppToast.jsx';
import { ENDPOINTS } from './endpoints.js';
import { resetToAuth } from '../navigation/navigationService.js';

let cachedDeviceId = null;
const PLATFORM_NAME = Platform.OS === 'ios' ? 'iOS' : 'Android';

/**
 * Base URL resolution: Environment variable with strict production fallback
 */
const rawBaseUrl =
  (typeof process !== 'undefined' &&
    (process.env?.API_BASE_URL ||
      process.env?.EXPO_PUBLIC_API_URL ||
      process.env?.REACT_APP_API_URL)) ||
  'https://alvozen.hassoftsolutions.com';

export const BASE_URL = rawBaseUrl
  .replace(/\/+$/, '')
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/v1\/?$/, '')
  .replace(/\/api\/?$/, '');

/**
 * Standardized Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status = 500, code = 'UNKNOWN_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Extracts the most specific error message from backend responses.
 * Handles:
 * - RFC 7807 / RFC 9110 Problem Details (`data.detail`, `data.title`)
 * - ASP.NET ValidationProblemDetails (`data.errors`)
 * - Standard REST error payloads (`data.message`, `data.error`, `data.errorMessage`)
 */
export const extractBackendErrorMessage = (data, status) => {
  if (!data) return getHttpStatusMessage(status);
  if (typeof data === 'string') return data.trim();

  // 1. Direct ProblemDetails detail
  const detail = data.detail ?? data.Detail;
  if (detail && typeof detail === 'string') {
    return detail.trim();
  }

  // 2. Direct error_description
  const errorDesc = data.error_description ?? data.errorDescription;
  if (errorDesc && typeof errorDesc === 'string') {
    return errorDesc.trim();
  }

  // 3. Direct message or error property
  const message = data.message ?? data.Message;
  if (message && typeof message === 'string') {
    return message.trim();
  }
  if (typeof data.error === 'string') {
    return data.error.trim();
  }
  if (data.error?.message && typeof data.error.message === 'string') {
    return data.error.message.trim();
  }
  const errorMessage = data.errorMessage ?? data.ErrorMessage;
  if (errorMessage && typeof errorMessage === 'string') {
    return errorMessage.trim();
  }

  // 4. Validation errors map (ASP.NET ValidationProblemDetails)
  const validationErrors = data.errors ?? data.Errors;
  if (validationErrors && typeof validationErrors === 'object') {
    const errorList = Object.values(validationErrors).flat().filter(Boolean);
    if (errorList.length > 0) {
      return errorList.join('\n');
    }
  }

  // 5. ProblemDetails title
  const title = data.title ?? data.Title;
  if (title && typeof title === 'string') {
    const trimmedTitle = title.trim();
    if (
      trimmedTitle &&
      trimmedTitle !== 'Bad Request' &&
      trimmedTitle !== 'Internal Server Error' &&
      trimmedTitle !== 'One or more validation errors occurred.'
    ) {
      return trimmedTitle;
    }
  }

  return getHttpStatusMessage(status);
};

export const parseApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data || {};
    const message = extractBackendErrorMessage(data, status);
    const code = data.code || data.Code || `HTTP_${status}`;

    return new ApiError(message, status, code, data.details || data.errors || null);
  } else if (error.request) {
    if (error.code === 'ECONNABORTED') {
      return new ApiError(
        'Request timed out. Please check your network and try again.',
        408,
        'TIMEOUT'
      );
    }
    return new ApiError(
      'No internet connection. Please verify your network connectivity.',
      0,
      'NETWORK_ERROR'
    );
  }

  return new ApiError(
    error.message || 'An unexpected error occurred.',
    500,
    'UNEXPECTED'
  );
};

const getHttpStatusMessage = (status) => {
  switch (status) {
    case 400:
      return 'Bad request. Please check the entered information.';
    case 401:
      return 'Session expired. Please sign in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'Requested resource was not found.';
    case 409:
      return 'Conflict detected. The resource already exists.';
    case 422:
      return 'Validation failed. Please verify your details.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Internal server error. Our team has been notified.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

/**
 * Centralized OneRetail Axios Instance
 */
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Platform': 'OneRetail-Mobile',
  },
});

// ── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      config.headers['X-OneRetail-Platform'] = PLATFORM_NAME;
      config.headers['X-App-Platform'] = 'OneRetail-Mobile';

      try {
        config.headers['X-OneRetail-App-Version'] = DeviceInfo.getVersion();
      } catch {
        config.headers['X-OneRetail-App-Version'] = '1.0.0';
      }

      if (!cachedDeviceId) {
        try {
          cachedDeviceId = await DeviceInfo.getUniqueId();
        } catch {
          cachedDeviceId = 'device_' + Platform.OS + '_' + Math.random().toString(36).substring(2, 9);
        }
      }
      config.headers['X-Device-Id'] = cachedDeviceId;
      config.headers['X-OneRetail-Device-Id'] = cachedDeviceId;

      // Token Attachment
      const token = useAuthStore.getState().token || (await secureStorage.getToken());
      if (token) {
        const bearerVal = `Bearer ${token}`;
        if (config.headers?.set) {
          config.headers.set('Authorization', bearerVal);
        }
        config.headers.Authorization = bearerVal;
      } else {
        delete config.headers['Authorization'];
        delete config.headers['authorization'];
      }
    } catch (e) {
      console.warn('[apiClient] Request interceptor warning:', e.message);
    }

    return config;
  },
  (error) => {
    return Promise.reject(parseApiError(error));
  }
);

// ── TOKEN REFRESH MUTEX & QUEUE ──────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const parsedError = parseApiError(error);
    const originalRequest = error.config || {};
    const skipGlobalToast = Boolean(originalRequest?.skipGlobalToast);

    // 1. Global 401 Unauthorized handling with Auto Refresh Flow
    if (parsedError.status === 401) {
      const requestUrl = originalRequest?.url || '';
      const isSignIn = requestUrl.includes(ENDPOINTS.AUTH.SIGN_IN);
      const isRefresh = requestUrl.includes(ENDPOINTS.AUTH.REFRESH);

      if (isSignIn) {
        if (!skipGlobalToast) {
          AppToast.show({
            title: 'Sign In Failed',
            message: parsedError.message || 'Invalid username or password.',
            type: 'error',
          });
        }
        return Promise.reject(parsedError);
      }

      if (isRefresh || originalRequest?._retry) {
        try {
          await useAuthStore.getState().logout();
          resetToAuth();
        } catch {}
        if (!skipGlobalToast) {
          AppToast.show({
            title: 'Session Expired',
            message: 'Your session has expired. Please sign in again.',
            type: 'error',
          });
        }
        return Promise.reject(parsedError);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken) => {
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => {
              reject(parseApiError(err));
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const authState = useAuthStore.getState();
      const refreshToken = authState.refreshToken || (await secureStorage.getRefreshToken());

      if (!refreshToken) {
        isRefreshing = false;
        processQueue(new Error('Missing refresh token'), null);
        await useAuthStore.getState().logout();
        resetToAuth();
        return Promise.reject(parsedError);
      }

      try {
        const refreshRes = await axios.post(
          `${BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-App-Platform': 'OneRetail-Mobile',
              'X-OneRetail-Platform': PLATFORM_NAME,
            },
            timeout: 15000,
          }
        );

        const resData = refreshRes.data?.data || refreshRes.data || {};
        const newAccessToken = resData.token || resData.accessToken;
        const newRefreshToken = resData.refreshToken || refreshToken;

        if (!newAccessToken) {
          throw new Error('Refresh response missing token.');
        }

        await useAuthStore.getState().setCredentials({
          user: authState.user,
          token: newAccessToken,
          refreshToken: newRefreshToken,
          role: authState.role,
        });

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await useAuthStore.getState().logout();
        resetToAuth();
        AppToast.show({
          title: 'Session Expired',
          message: 'Please sign in to continue.',
          type: 'error',
        });
        return Promise.reject(parseApiError(refreshErr));
      } finally {
        isRefreshing = false;
      }
    }

    // 2. Client Errors (400-499)
    else if (parsedError.status >= 400 && parsedError.status < 500) {
      if (!skipGlobalToast) {
        AppToast.show({
          title: 'Request Failed',
          message: parsedError.message,
          type: 'error',
        });
      }
    }

    // 3. Server Errors (500+)
    else if (parsedError.status >= 500) {
      if (!skipGlobalToast) {
        AppToast.show({
          title: 'Server Error',
          message: parsedError.message || 'Server is temporarily unavailable.',
          type: 'error',
        });
      }
    }

    // 4. Network dropped
    else if (parsedError.status === 0 || parsedError.code === 'NETWORK_ERROR') {
      if (!skipGlobalToast) {
        AppToast.show({
          title: 'Connection Issue',
          message: 'Please verify your network connection.',
          type: 'error',
        });
      }
    }

    return Promise.reject(parsedError);
  }
);

export const apiClient = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
};

export { ENDPOINTS };
export default apiClient;
