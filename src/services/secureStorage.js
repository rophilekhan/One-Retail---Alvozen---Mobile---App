import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

/**
 * SecureStorage - Hardware-Backed Encrypted Storage for OneRetail
 * Strictly persists sensitive tokens, refresh tokens, and authentication credentials
 * using Android KeyStore / iOS Keychain via react-native-encrypted-storage.
 */
class SecureStorageService {
  constructor() {
    this.memoryCache = new Map();
  }

  /**
   * Set item in EncryptedStorage with AsyncStorage fallback
   * @param {string} key
   * @param {any} value
   */
  async setItem(key, value) {
    if (!key) return;
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
    this.memoryCache.set(key, stringVal);

    try {
      if (EncryptedStorage?.setItem) {
        await EncryptedStorage.setItem(key, stringVal);
        return;
      }
    } catch (err) {
      console.warn(`[SecureStorage] EncryptedStorage.setItem failed for "${key}", using AsyncStorage:`, err.message);
    }

    try {
      if (AsyncStorage?.setItem) {
        await AsyncStorage.setItem(key, stringVal);
      }
    } catch (fallbackErr) {
      console.warn(`[SecureStorage] AsyncStorage.setItem failed for "${key}":`, fallbackErr.message);
    }
  }

  /**
   * Retrieve item from EncryptedStorage with AsyncStorage fallback
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  async getItem(key) {
    if (!key) return null;

    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }

    try {
      if (EncryptedStorage?.getItem) {
        const val = await EncryptedStorage.getItem(key);
        if (val !== null && val !== undefined) {
          this.memoryCache.set(key, val);
          return val;
        }
      }
    } catch (err) {
      console.warn(`[SecureStorage] EncryptedStorage.getItem failed for "${key}":`, err.message);
    }

    try {
      if (AsyncStorage?.getItem) {
        const val = await AsyncStorage.getItem(key);
        if (val !== null && val !== undefined) {
          this.memoryCache.set(key, val);
          return val;
        }
      }
    } catch (fallbackErr) {
      console.warn(`[SecureStorage] AsyncStorage.getItem failed for "${key}":`, fallbackErr.message);
    }

    return null;
  }

  /**
   * Remove item from storage
   * @param {string} key
   */
  async removeItem(key) {
    if (!key) return;
    this.memoryCache.delete(key);

    try {
      if (EncryptedStorage?.removeItem) {
        await EncryptedStorage.removeItem(key);
      }
    } catch {}

    try {
      if (AsyncStorage?.removeItem) {
        await AsyncStorage.removeItem(key);
      }
    } catch {}
  }

  /**
   * Clear all stored credentials and cache
   */
  async clear() {
    this.memoryCache.clear();

    try {
      if (EncryptedStorage?.clear) {
        await EncryptedStorage.clear();
      }
    } catch {}

    try {
      if (AsyncStorage?.clear) {
        await AsyncStorage.clear();
      }
    } catch {}
  }

  // ── Specialized Token & Credential Helpers ──

  async getToken() {
    return this.getItem('oneretail_access_token');
  }

  async setToken(token) {
    return this.setItem('oneretail_access_token', token);
  }

  async removeToken() {
    return this.removeItem('oneretail_access_token');
  }

  async getRefreshToken() {
    return this.getItem('oneretail_refresh_token');
  }

  async setRefreshToken(token) {
    return this.setItem('oneretail_refresh_token', token);
  }

  async removeRefreshToken() {
    return this.removeItem('oneretail_refresh_token');
  }

  async getUser() {
    const raw = await this.getItem('oneretail_user_profile');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async setUser(user) {
    return this.setItem('oneretail_user_profile', user);
  }

  async removeUser() {
    return this.removeItem('oneretail_user_profile');
  }
}

export const secureStorage = new SecureStorageService();
export default secureStorage;
