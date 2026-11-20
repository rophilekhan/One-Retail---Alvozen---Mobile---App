import { useAuthStore } from '../store/useAuthStore.js';
import { useStaffStore } from '../store/useStaffStore.js';

/**
 * useStaffPermission - Custom React Hook for Role & RBAC Permission Checking
 * Returns whether the active user has access based on PHARMACY_ADMIN or STAFF permission.
 *
 * @param {string} permissionKey - Key from PERMISSIONS
 * @returns {{ isGranted: boolean, role: string, isPharmacyAdmin: boolean }}
 */
export const useStaffPermission = (permissionKey) => {
  const role = useAuthStore((s) => s.role);
  const isPharmacyAdmin = role === 'PHARMACY_ADMIN' || role === 'ADMIN';
  const currentPermissions = useStaffStore((s) => s.currentStaffPermissions);

  const isGranted =
    isPharmacyAdmin ||
    (role === 'STAFF' &&
      Array.isArray(currentPermissions) &&
      currentPermissions.includes(permissionKey));

  return {
    isGranted,
    role,
    isPharmacyAdmin,
  };
};

export default useStaffPermission;
