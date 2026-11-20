import { create } from 'zustand';
import secureStorage from '../services/secureStorage.js';

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  role: null, // 'PHARMACY_ADMIN' | 'STAFF' | null
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
};

/**
 * Normalizes user role ensuring backwards compatibility between ADMIN and PHARMACY_ADMIN
 * @param {string|null|undefined} role
 * @returns {'PHARMACY_ADMIN' | 'STAFF'}
 */
const normalizeRole = (role) => {
  if (role === 'STAFF') return 'STAFF';
  return 'PHARMACY_ADMIN';
};

/**
 * useAuthStore - Zustand Authentication & Session Store
 * Hydrates tokens & session from EncryptedStorage via secureStorage.
 */
export const useAuthStore = create((set, get) => ({
  ...initialState,

  /**
   * Hydrate session from secure hardware-backed encrypted storage on app launch
   */
  hydrate: async () => {
    try {
      set({ isLoading: true });
      const [token, refreshToken, user] = await Promise.all([
        secureStorage.getToken(),
        secureStorage.getRefreshToken(),
        secureStorage.getUser(),
      ]);

      if (token && user) {
        const role = normalizeRole(user.role);
        set({
          token,
          refreshToken,
          user: { ...user, role },
          role,
          isAuthenticated: true,
          isHydrated: true,
          isLoading: false,
        });

        // Hydrate staff permissions if staff member
        if (role === 'STAFF' && (Array.isArray(user.permissions) || Array.isArray(user.allowedPermissions))) {
          const perms = user.permissions || user.allowedPermissions || [];
          const { useStaffStore } = require('./useStaffStore.js');
          useStaffStore.getState().setCurrentStaffPermissions(perms);
        }
      } else {
        set({
          ...initialState,
          isHydrated: true,
          isLoading: false,
        });
      }
    } catch (e) {
      console.warn('[useAuthStore] Hydration error:', e.message);
      set({
        ...initialState,
        isHydrated: true,
        isLoading: false,
      });
    }
  },

  /**
   * Set authentication credentials after sign in or OTP verification
   */
  setCredentials: async ({ user, token, refreshToken, role }) => {
    const resolvedRole = normalizeRole(role || user?.role);
    const updatedUser = { ...user, role: resolvedRole };

    await Promise.all([
      secureStorage.setToken(token),
      refreshToken ? secureStorage.setRefreshToken(refreshToken) : Promise.resolve(),
      secureStorage.setUser(updatedUser),
    ]);

    set({
      user: updatedUser,
      token,
      refreshToken: refreshToken || get().refreshToken,
      role: resolvedRole,
      isAuthenticated: true,
      isLoading: false,
    });

    if (resolvedRole === 'STAFF') {
      const perms = updatedUser.permissions || updatedUser.allowedPermissions || [];
      const { useStaffStore } = require('./useStaffStore.js');
      useStaffStore.getState().setCurrentStaffPermissions(perms);
    }
  },

  /**
   * Update active user profile fields
   */
  updateUser: async (updates) => {
    const current = get().user || {};
    const updatedUser = { ...current, ...updates };
    if (updatedUser.role) {
      updatedUser.role = normalizeRole(updatedUser.role);
    }

    await secureStorage.setUser(updatedUser);
    set({
      user: updatedUser,
      role: updatedUser.role || get().role,
    });
  },

  /**
   * Clear session, purge storage, and reset all dependent stores
   */
  logout: async () => {
    try {
      await Promise.all([
        secureStorage.removeToken(),
        secureStorage.removeRefreshToken(),
        secureStorage.removeUser(),
      ]);
    } catch (e) {
      console.warn('[useAuthStore] Logout purge error:', e.message);
    }

    set({
      ...initialState,
      isHydrated: true,
    });

    // Reset dependent stores
    try {
      const { usePharmacyStore } = require('./usePharmacyStore.js');
      usePharmacyStore.getState().resetPharmacy();
    } catch {}

    try {
      const { useDispenseStore } = require('./useDispenseStore.js');
      useDispenseStore.getState().clearDispenseSession();
    } catch {}
  },
}));

export default useAuthStore;
