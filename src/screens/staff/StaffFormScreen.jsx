import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppInput,
  AppCheckbox,
  AppButton,
  AppBadge,
  AppToast,
} from '../../components/core/index.js';
import { useStaffStore, PERMISSIONS } from '../../store/useStaffStore.js';

const PERMISSION_CONFIG = [
  {
    key: PERMISSIONS.SCAN_QR_DEVICE,
    label: 'Scan QR through device',
    description: 'Use device camera to scan patient prescription & stock QR codes.',
  },
  {
    key: PERMISSIONS.SCAN_QR_PLUGIN,
    label: 'Scan QR through Plug-in',
    description: 'Connect with desktop POS barcode scanner plug-in for instant Rx logging.',
  },
  {
    key: PERMISSIONS.PO_INITIATOR,
    label: 'Purchase Order Initiator',
    description: 'Create and draft purchase orders for distributor trade schemes.',
  },
  {
    key: PERMISSIONS.PO_APPROVER,
    label: 'Purchase Order Approver',
    description: 'Review, authorize and electronically sign distributor purchase orders.',
  },
  {
    key: PERMISSIONS.EXPIRY_INITIATOR,
    label: 'Expiry Initiator',
    description: 'Audit shelf stock and flag near-expiry medicines for return.',
  },
  {
    key: PERMISSIONS.EXPIRY_APPROVER,
    label: 'Expiry Approver',
    description: 'Authorize expiry return batches and distributor credit notes.',
  },
  {
    key: PERMISSIONS.UPLOAD_CLOSING_DATA,
    label: 'Upload Closing Data',
    description: 'Upload daily POS closing ledger files for non-integrated systems.',
  },
];

/**
 * StaffFormScreen - Create or Edit Staff Profile
 * Mandated by ONERETAIL_PRD.md:
 * - Username
 * - Password (or new password)
 * - Granular permission toggles for all 7 RBAC roles
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} props.route
 */
export const StaffFormScreen = ({ navigation, route }) => {
  const { colors, spacing } = useTheme();
  const existingStaff = route?.params?.staff;
  const isEditing = Boolean(existingStaff);

  const addStaff = useStaffStore((s) => s.addStaff);
  const updateStaff = useStaffStore((s) => s.updateStaff);

  const [username, setUsername] = useState(existingStaff?.username || '');
  const [password, setPassword] = useState('');

  // Initial permissions mapping
  const initialPerms = {};
  PERMISSION_CONFIG.forEach((p) => {
    initialPerms[p.key] = existingStaff
      ? Boolean(existingStaff.allowedPermissions?.includes(p.key))
      : p.key === PERMISSIONS.SCAN_QR_DEVICE; // Default true for device scanning
  });

  const [permissions, setPermissions] = useState(initialPerms);

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = () => {
    const all = {};
    PERMISSION_CONFIG.forEach((p) => {
      all[p.key] = true;
    });
    setPermissions(all);
  };

  const clearAll = () => {
    const none = {};
    PERMISSION_CONFIG.forEach((p) => {
      none[p.key] = false;
    });
    setPermissions(none);
  };

  const handleSave = () => {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      AppToast.show({
        title: 'Username Required',
        message: 'Please provide a unique username for this staff profile.',
        type: 'warning',
      });
      return;
    }

    if (!isEditing && (!trimmedPass || trimmedPass.length < 6)) {
      AppToast.show({
        title: 'Password Required',
        message: 'Please provide a temporary password of at least 6 characters.',
        type: 'warning',
      });
      return;
    }

    const grantedKeys = Object.keys(permissions).filter((k) => permissions[k]);

    if (isEditing) {
      updateStaff(existingStaff.id, {
        allowedPermissions: grantedKeys,
      });
      AppToast.show({
        title: 'Staff Updated',
        message: `Permissions updated for @${trimmedUser}.`,
        type: 'success',
      });
    } else {
      addStaff({
        id: 'staff_' + Date.now(),
        username: trimmedUser,
        name: trimmedUser,
        role: 'STAFF',
        isActive: true,
        allowedPermissions: grantedKeys,
        createdAt: new Date().toISOString().split('T')[0],
      });
      AppToast.show({
        title: 'Staff Profile Created',
        message: `Profile created for @${trimmedUser}.`,
        type: 'success',
      });
    }

    navigation.goBack();
  };

  return (
    <AppScreenContainer keyboardAvoiding={true} scrollable={true} withAmbientGlow={true}>
      <AppHeader
        title={isEditing ? 'Edit Staff Profile' : 'Create Staff Profile'}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <GlassCard style={styles.card}>
          <AppText variant="titleMedium" colorType="primary">
            Staff Credentials
          </AppText>
          <AppText variant="caption" colorType="muted" style={{ marginBottom: 12 }}>
            {isEditing
              ? 'Update permissions for this staff member.'
              : 'Create a dedicated login for your dispensary or store staff.'}
          </AppText>

          <AppInput
            label="Staff Username"
            placeholder="e.g. staff_kashif"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!isEditing}
          />
          {isEditing && (
            <AppText variant="caption" colorType="muted" style={styles.inputHelper}>
              Username cannot be changed after creation.
            </AppText>
          )}

          {!isEditing && (
            <AppInput
              label="Temporary Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          )}
        </GlassCard>

        {/* Permissions Configuration Card */}
        <GlassCard style={styles.card}>
          <View style={styles.permHeader}>
            <View style={{ flex: 1 }}>
              <AppText variant="titleMedium" colorType="primary">
                Allowed Access Permissions
              </AppText>
              <AppText variant="caption" colorType="muted">
                RBAC permissions according to pharmacy operational duties
              </AppText>
            </View>
            <View style={styles.quickActions}>
              <TouchableOpacity onPress={selectAll} style={styles.quickBtn}>
                <AppText variant="caption" colorType="brand">
                  All
                </AppText>
              </TouchableOpacity>
              <AppText variant="caption" colorType="muted">
                {' • '}
              </AppText>
              <TouchableOpacity onPress={clearAll} style={styles.quickBtn}>
                <AppText variant="caption" colorType="muted">
                  Clear
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {PERMISSION_CONFIG.map((perm) => (
            <View
              key={perm.key}
              style={[
                styles.permRow,
                { borderBottomColor: colors.border.subtle },
              ]}
            >
              <View style={{ flex: 1, paddingRight: 8 }}>
                <AppCheckbox
                  checked={permissions[perm.key]}
                  onChange={() => togglePermission(perm.key)}
                  label={perm.label}
                />
                <AppText
                  variant="caption"
                  colorType="muted"
                  style={{ marginLeft: scale(32), marginTop: 2 }}
                >
                  {perm.description}
                </AppText>
              </View>
              <AppBadge
                label={permissions[perm.key] ? 'Allowed' : 'Restricted'}
                variant={permissions[perm.key] ? 'success' : 'muted'}
              />
            </View>
          ))}
        </GlassCard>

        <View style={{ height: spacing.lg }} />

        <AppButton
          variant="primary"
          title={isEditing ? 'Save Changes' : 'Create Staff Profile'}
          onPress={handleSave}
        />

        <View style={{ height: verticalScale(20) }} />
      </View>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: verticalScale(12),
  },
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  inputHelper: {
    marginTop: verticalScale(-6),
    marginBottom: verticalScale(8),
  },
  permHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickBtn: {
    padding: scale(4),
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
  },
});

export default StaffFormScreen;