import { create } from 'zustand';
import { useAuthStore } from './useAuthStore.js';

/**
 * Staff Permissions Constants according to ONERETAIL_PRD.md & SKILL.md
 * - SCAN_QR_DEVICE: Scan QR through device
 * - SCAN_QR_PLUGIN: Scan QR through Plug-in
 * - PO_INITIATOR: Purchase Order Initiator
 * - PO_APPROVER: Purchase Order Approver
 * - EXPIRY_INITIATOR: Expiry Claim Initiator
 * - EXPIRY_APPROVER: Expiry Claim Approver
 * - UPLOAD_CLOSING_DATA: Upload Closing Data (non-integrated systems)
 */
export const PERMISSIONS = {
  SCAN_QR_DEVICE: 'SCAN_QR_DEVICE',
  SCAN_QR_PLUGIN: 'SCAN_QR_PLUGIN',
  PO_INITIATOR: 'PO_INITIATOR',
  PO_APPROVER: 'PO_APPROVER',
  EXPIRY_INITIATOR: 'EXPIRY_INITIATOR',
  EXPIRY_APPROVER: 'EXPIRY_APPROVER',
  UPLOAD_CLOSING_DATA: 'UPLOAD_CLOSING_DATA',
};

/**
 * Helper to check if a specific permission is granted to current user.
 * Admin (PHARMACY_ADMIN or ADMIN) always has unrestricted permission (returns true).
 * Staff permissions are checked against active staff permissions or user payload.
 *
 * @param {string} permission - Key from PERMISSIONS
 * @returns {boolean}
 */
export const hasPermission = (permission) => {
  const authState = useAuthStore.getState();
  const role = authState.role || authState.user?.role;
  if (role === 'PHARMACY_ADMIN' || role === 'ADMIN') {
    return true;
  }

  const currentPerms = useStaffStore.getState().currentStaffPermissions;
  if (Array.isArray(currentPerms) && currentPerms.includes(permission)) {
    return true;
  }

  const userPerms = authState.user?.permissions || authState.user?.allowedPermissions;
  if (Array.isArray(userPerms) && userPerms.includes(permission)) {
    return true;
  }

  return false;
};

const DEFAULT_MOCK_STAFF = [
  {
    id: 'staff_1',
    name: 'Ali Reza',
    username: 'ali_reza',
    role: 'STAFF',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    allowedPermissions: [
      PERMISSIONS.SCAN_QR_DEVICE,
      PERMISSIONS.PO_INITIATOR,
      PERMISSIONS.UPLOAD_CLOSING_DATA,
    ],
    isActive: true,
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'staff_2',
    name: 'Fatima Noor',
    username: 'fatima_noor',
    role: 'STAFF',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    allowedPermissions: [
      PERMISSIONS.SCAN_QR_DEVICE,
      PERMISSIONS.SCAN_QR_PLUGIN,
      PERMISSIONS.PO_APPROVER,
      PERMISSIONS.EXPIRY_APPROVER,
    ],
    isActive: true,
    createdAt: '2026-02-14T12:30:00.000Z',
  },
  {
    id: 'staff_3',
    name: 'Bilal Ahmed',
    username: 'bilal_ahmed',
    role: 'STAFF',
    avatarUrl: '',
    allowedPermissions: [
      PERMISSIONS.SCAN_QR_DEVICE,
      PERMISSIONS.EXPIRY_INITIATOR,
    ],
    isActive: false,
    createdAt: '2026-03-01T09:15:00.000Z',
  },
];

const initialState = {
  staffList: DEFAULT_MOCK_STAFF,
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

  deleteStaff: (staffId) => {
    set((state) => ({
      staffList: state.staffList.filter((s) => s.id !== staffId),
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
