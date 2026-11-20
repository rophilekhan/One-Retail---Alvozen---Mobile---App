import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import DeviceInfo from 'react-native-device-info';

/**
 * StorageService - OneRetail Robust Dual-Engine Secure Storage
 * Utilizes hardware-backed EncryptedStorage for sensitive tokens/credentials
 * with graceful fallback to AsyncStorage and in-memory cache.
 */
class StorageService {
  constructor() {
    this.memoryStore = new Map();
    this.isInitialized = false;
    this._initPromise = this._initStorage();
  }

  async _initStorage() {
    try {
      // Warm up in-memory cache from AsyncStorage
      if (AsyncStorage?.getAllKeys && AsyncStorage?.multiGet) {
        const keys = await AsyncStorage.getAllKeys();
        if (keys && keys.length > 0) {
          const pairs = await AsyncStorage.multiGet(keys);
          pairs.forEach(([k, v]) => {
            if (v !== null && v !== undefined) {
              this.memoryStore.set(k, v);
            }
          });
        }
      }
      this.isInitialized = true;
    } catch (e) {
      this.isInitialized = true;
      console.warn('[StorageService] Init cache warning:', e.message);
    }
  }

  /**
   * Securely store a value using EncryptedStorage
   */
  async setSecureItem(key, value) {
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
    this.memoryStore.set(key, stringVal);

    try {
      if (EncryptedStorage?.setItem) {
        await EncryptedStorage.setItem(key, stringVal);
        return;
      }
    } catch (e) {
      console.warn(`[StorageService] EncryptedStorage.setItem failed for "${key}", falling back to AsyncStorage:`, e.message);
    }

    try {
      if (AsyncStorage?.setItem) {
        await AsyncStorage.setItem(key, stringVal);
      }
    } catch (fallbackErr) {
      console.warn(`[StorageService] AsyncStorage setItem failed for "${key}":`, fallbackErr.message);
    }
  }

  /**
   * Retrieve securely stored value
   */
  async getSecureItem(key) {
    if (!this.isInitialized && this._initPromise) {
      await this._initPromise;
    }

    if (this.memoryStore.has(key)) {
      return this.memoryStore.get(key);
    }

    try {
      if (EncryptedStorage?.getItem) {
        const val = await EncryptedStorage.getItem(key);
        if (val !== null && val !== undefined) {
          this.memoryStore.set(key, val);
          return val;
        }
      }
    } catch (e) {
      console.warn(`[StorageService] EncryptedStorage.getItem failed for "${key}":`, e.message);
    }

    try {
      if (AsyncStorage?.getItem) {
        const val = await AsyncStorage.getItem(key);
        if (val !== null && val !== undefined) {
          this.memoryStore.set(key, val);
          return val;
        }
      }
    } catch {}

    return null;
  }

  /**
   * Remove a securely stored value
   */
  async removeSecureItem(key) {
    this.memoryStore.delete(key);

    try {
      if (EncryptedStorage?.removeItem) {
        await EncryptedStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[StorageService] EncryptedStorage.removeItem failed for "${key}":`, e.message);
    }

    try {
      if (AsyncStorage?.removeItem) {
        await AsyncStorage.removeItem(key);
      }
    } catch {}
  }

  // Generic key-value helpers
  async getItem(key) {
    return this.getSecureItem(key);
  }

  async setItem(key, value) {
    return this.setSecureItem(key, value);
  }

  async removeItem(key) {
    return this.removeSecureItem(key);
  }

  async clear() {
    this.memoryStore.clear();

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

  // Domain-specific token & user accessors
  async getToken() {
    return this.getSecureItem('oneretail_access_token');
  }

  async setToken(token) {
    return this.setSecureItem('oneretail_access_token', token);
  }

  async removeToken() {
    return this.removeSecureItem('oneretail_access_token');
  }

  async getRefreshToken() {
    return this.getSecureItem('oneretail_refresh_token');
  }

  async setRefreshToken(token) {
    return this.setSecureItem('oneretail_refresh_token', token);
  }

  async removeRefreshToken() {
    return this.removeSecureItem('oneretail_refresh_token');
  }

  async getUser() {
    const raw = await this.getSecureItem('oneretail_user_session');
    if (!raw) return null;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return null;
    }
  }

  async setUser(user) {
    return this.setSecureItem('oneretail_user_session', JSON.stringify(user));
  }

  async removeUser() {
    return this.removeSecureItem('oneretail_user_session');
  }

  async getDeviceId() {
    let deviceId = await this.getItem('oneretail_device_id');
    if (!deviceId) {
      try {
        deviceId = await DeviceInfo.getUniqueId();
      } catch {
        deviceId = null;
      }
      if (!deviceId) {
        deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      await this.setItem('oneretail_device_id', deviceId);
    }
    return deviceId;
  }
}

export const storageService = new StorageService();
export default storageService;
