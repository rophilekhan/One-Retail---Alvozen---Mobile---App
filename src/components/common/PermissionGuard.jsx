import React from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useStaffStore } from '../../store/useStaffStore.js';

/**
 * PermissionGuard - RBAC Staff Permission Access Wrapper
 * Enforces staff permissions according to ONERETAIL_PRD.md & SKILL.md
 *
 * Supported Permissions:
 * - SCAN_QR_DEVICE
 * - SCAN_QR_PLUGIN
 * - PO_INITIATOR
 * - PO_APPROVER
 * - EXPIRY_INITIATOR
 * - EXPIRY_APPROVER
 * - UPLOAD_CLOSING_DATA
 *
 * @param {Object} props
 * @param {string} props.permission - Permission key to verify
 * @param {React.ReactNode} [props.fallback=null] - Rendered if user lacks permission
 * @param {React.ReactNode} props.children - Rendered if user is authorized
 */
export const PermissionGuard = ({
  permission,
  fallback = null,
  children,
}) => {
  const role = useAuthStore((s) => s.role);
  const currentStaffPermissions = useStaffStore((s) => s.currentStaffPermissions);

  // ADMIN role has unrestricted access across all actions
  if (role === 'ADMIN') {
    return <>{children}</>;
  }

  // STAFF role checks for granted permission in profile
  if (role === 'STAFF') {
    const hasAccess =
      Array.isArray(currentStaffPermissions) &&
      currentStaffPermissions.includes(permission);

    if (hasAccess) {
      return <>{children}</>;
    }
  }

  return <>{fallback}</>;
};

export default PermissionGuard;
