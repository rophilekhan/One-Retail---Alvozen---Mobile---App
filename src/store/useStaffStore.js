import { create } from 'zustand';
import { useAuthStore } from './useAuthStore.js';

/**
 * Staff Permissions Constants according to ONERETAIL_PRD.md & SKILL.md
 */
export const PERMISSIONS = {
  SCAN_QR_DEVICE: 'SCAN_QR_DEVICE',         // Scan QR through device
  SCAN_QR_PLUGIN: 'SCAN_QR_PLUGIN',         // Scan QR through Plug-in
  PO_INITIATOR: 'PO_INITIATOR',             // PO Initiator
  PO_APPROVER: 'PO_APPROVER',               // PO Approver
  EXPIRY_INITIATOR: 'EXPIRY_INITIATOR',     // Expiry Initiator
  EXPIRY_APPROVER: 'EXPIRY_APPROVER',       // Expiry Approver
  UPLOAD_CLOSING_DATA: 'UPLOAD_CLOSING_DATA', // Upload Closing Data (non-integrated systems)
};

/**
 * Helper to check if a specific permission is granted to current user
 * Admin always has unrestricted permission (returns true).
 */
export const hasPermission = (permission) => {
  const authState = useAuthStore.getState();
  if (authState.role === 'ADMIN') {
    return true;
  }
  const currentPerms = useStaffStore.getState().currentStaffPermissions;
  return Array.isArray(currentPerms) && currentPerms.includes(permission);
};

const initialState = {
  staffList: [],
  currentStaffPermissions: [],
  isLoading: false,
};

/**
 * useStaffStore - Staff Hierarchy & Permissions Store
 */
export const useStaffStore = create((set, get) => ({
  ...initialState,

  setStaffList: (list) => {
    set({ staffList: Array.isArray(list) ? list : [] });
  },

  addStaff: (staffMember) => {
    set((state) => ({
      staffList: [staffMember, ...state.staffList],
    }));
  },

  updateStaff: (staffId, updates) => {
    set((state) => ({
      staffList: state.staffList.map((s) => (s.id === staffId ? { ...s, ...updates } : s)),
    }));
  },

  toggleStaffStatus: (staffId, isActive) => {
    set((state) => ({
      staffList: state.staffList.map((s) =>
        s.id === staffId ? { ...s, isActive: Boolean(isActive) } : s
      ),
    }));
  },

  setCurrentStaffPermissions: (permissions) => {
    set({ currentStaffPermissions: Array.isArray(permissions) ? permissions : [] });
  },

  hasPermission: (permission) => {
    return hasPermission(permission);
  },

  resetStaffStore: () => {
    set(initialState);
  },
}));

export default useStaffStore;
