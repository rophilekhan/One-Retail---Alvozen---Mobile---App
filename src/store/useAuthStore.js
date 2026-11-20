import { create } from 'zustand';
import { storageService } from '../services/storage.js';

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  role: null, // 'ADMIN' | 'STAFF' | null
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
};

/**
 * useAuthStore - Zustand Authentication & Session Store
 * Hydrates tokens & session from EncryptedStorage.
 */
export const useAuthStore = create((set, get) => ({
  ...initialState,

  /**
   * Hydrate session from secure encrypted storage on app launch
   */
  hydrate: async () => {
    try {
      set({ isLoading: true });
      const [token, refreshToken, user] = await Promise.all([
        storageService.getToken(),
        storageService.getRefreshToken(),
        storageService.getUser(),
      ]);

      if (token && user) {
        const role = user.role || 'ADMIN';
        set({
          token,
          refreshToken,
          user,
          role,
          isAuthenticated: true,
          isHydrated: true,
          isLoading: false,
        });

        // Hydrate staff permissions if staff
        if (role === 'STAFF' && Array.isArray(user.permissions)) {
          const { useStaffStore } = require('./useStaffStore.js');
          useStaffStore.getState().setCurrentStaffPermissions(user.permissions);
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
    const resolvedRole = role || user?.role || 'ADMIN';
    const updatedUser = { ...user, role: resolvedRole };

    await Promise.all([
      storageService.setToken(token),
      refreshToken ? storageService.setRefreshToken(refreshToken) : Promise.resolve(),
      storageService.setUser(updatedUser),
    ]);

    set({
      user: updatedUser,
      token,
      refreshToken: refreshToken || get().refreshToken,
      role: resolvedRole,
      isAuthenticated: true,
      isLoading: false,
    });

    if (resolvedRole === 'STAFF' && Array.isArray(updatedUser.permissions)) {
      const { useStaffStore } = require('./useStaffStore.js');
      useStaffStore.getState().setCurrentStaffPermissions(updatedUser.permissions);
    }
  },

  /**
   * Update active user profile fields
   */
  updateUser: async (updates) => {
    const current = get().user || {};
    const updatedUser = { ...current, ...updates };

    await storageService.setUser(updatedUser);
    set({ user: updatedUser });
  },

  /**
   * Clear session, purge storage, and reset all dependent stores
   */
  logout: async () => {
    try {
      await Promise.all([
        storageService.removeToken(),
        storageService.removeRefreshToken(),
        storageService.removeUser(),
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
