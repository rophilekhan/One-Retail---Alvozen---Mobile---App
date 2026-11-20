import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useStaffPermission } from '../../hooks/useStaffPermission.js';
import { AppText, AppBadge } from '../core/index.js';

/**
 * PermissionGuard - RBAC Staff Permission Access Wrapper
 * Enforces staff permissions according to ONERETAIL_PRD.md & SKILL.md
 * Supports mode="hide" (renders fallback or null) or mode="lock" (renders disabled UI with lock badge).
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
 * @param {'hide' | 'lock'} [props.mode='hide'] - Behavior when access is restricted
 * @param {React.ReactNode} [props.fallback=null] - Rendered if user lacks permission
 * @param {React.ReactNode} props.children - Rendered if user is authorized
 */
export const PermissionGuard = ({
  permission,
  mode = 'hide',
  fallback = null,
  children,
}) => {
  const { isGranted } = useStaffPermission(permission);

  if (isGranted) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (mode === 'lock') {
    return (
      <View style={styles.lockContainer} pointerEvents="none">
        <View style={styles.lockBadgeWrap}>
          <AppBadge label="Restricted Access" variant="muted" size="sm" />
        </View>
        <View style={styles.dimmedContent}>{children}</View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  lockContainer: {
    position: 'relative',
    opacity: 0.5,
  },
  lockBadgeWrap: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 10,
  },
  dimmedContent: {
    opacity: 0.65,
  },
});

export default PermissionGuard;
