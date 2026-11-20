import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppSwitch,
  AppButton,
  AppModal,
  AppInput,
  AppToast,
  MetricIconDisc,
} from '../../components/core/index.js';
import { useStaffStore, PERMISSIONS } from '../../store/useStaffStore.js';

const PERMISSION_LABELS = {
  [PERMISSIONS.SCAN_QR_DEVICE]: 'Scan QR (Device)',
  [PERMISSIONS.SCAN_QR_PLUGIN]: 'Scan QR (Plug-in)',
  [PERMISSIONS.PO_INITIATOR]: 'PO Initiator',
  [PERMISSIONS.PO_APPROVER]: 'PO Approver',
  [PERMISSIONS.EXPIRY_INITIATOR]: 'Expiry Initiator',
  [PERMISSIONS.EXPIRY_APPROVER]: 'Expiry Approver',
  [PERMISSIONS.UPLOAD_CLOSING_DATA]: 'Upload Closing',
};

/**
 * StaffListScreen - Staff Profiles & Access Management
 * Mandated by ONERETAIL_PRD.md:
 * - List staff profiles
 * - Admin can activate/deactivate any profile
 * - Admin can change password for any profile
 * - Navigate to StaffForm for creation / editing
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const StaffListScreen = ({ navigation }) => {
  const { colors, spacing, isDark } = useTheme();
  const staffList = useStaffStore((s) => s.staffList);
  const toggleStaffStatus = useStaffStore((s) => s.toggleStaffStatus);
  const updateStaff = useStaffStore((s) => s.updateStaff);
  const addStaff = useStaffStore((s) => s.addStaff);

  // Password reset modal state
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Default demo staff if list is empty
  React.useEffect(() => {
    if (staffList.length === 0) {
      addStaff({
        id: 'staff_1',
        username: 'staff_ali',
        name: 'Ali Raza',
        role: 'STAFF',
        isActive: true,
        allowedPermissions: [
          PERMISSIONS.SCAN_QR_DEVICE,
          PERMISSIONS.PO_INITIATOR,
          PERMISSIONS.EXPIRY_INITIATOR,
        ],
        createdAt: '2026-01-15',
      });
      addStaff({
        id: 'staff_2',
        username: 'staff_fatima',
        name: 'Fatima Noor',
        role: 'STAFF',
        isActive: false,
        allowedPermissions: [
          PERMISSIONS.SCAN_QR_DEVICE,
          PERMISSIONS.SCAN_QR_PLUGIN,
          PERMISSIONS.UPLOAD_CLOSING_DATA,
        ],
        createdAt: '2026-02-01',
      });
    }
  }, [staffList.length, addStaff]);

  const handleToggleStatus = (staffId, currentStatus, username) => {
    const nextStatus = !currentStatus;
    toggleStaffStatus(staffId, nextStatus);
    AppToast.show({
      title: nextStatus ? 'Staff Activated' : 'Staff Deactivated',
      message: `@${username} account is now ${nextStatus ? 'active' : 'disabled'}.`,
      type: nextStatus ? 'success' : 'warning',
    });
  };

  const openResetPasswordModal = (staff) => {
    setSelectedStaff(staff);
    setNewPassword('');
    setConfirmPassword('');
    setResetModalVisible(true);
  };

  const handleSavePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      AppToast.show({
        title: 'Invalid Password',
        message: 'Password must be at least 6 characters long.',
        type: 'warning',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      AppToast.show({
        title: 'Mismatch Error',
        message: 'New password and confirmation do not match.',
        type: 'error',
      });
      return;
    }

    if (selectedStaff) {
      updateStaff(selectedStaff.id, { passwordUpdatedAt: new Date().toISOString() });
      AppToast.show({
        title: 'Password Updated',
        message: `Password reset successfully for @${selectedStaff.username}.`,
        type: 'success',
      });
    }

    setResetModalVisible(false);
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true}>
      <AppHeader
        title="Staff Management"
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('StaffForm')}
            style={styles.addBtn}
            accessibilityRole="button"
            accessibilityLabel="Add Staff"
          >
            <AppBadge label="+ Add" variant="brand" />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.summaryBar}>
          <View>
            <AppText variant="titleMedium" colorType="primary">
              Pharmacy Team ({staffList.length})
            </AppText>
            <AppText variant="caption" colorType="muted">
              Configure staff logins and operational permissions
            </AppText>
          </View>
        </View>

        {staffList.map((staff) => (
          <GlassCard key={staff.id} style={styles.staffCard}>
            {/* Header: User, Role, Active Switch */}
            <View style={styles.cardHeader}>
              <MetricIconDisc
                variant={staff.isActive ? 'teal' : 'neutral'}
                size={40}
                marginRight={10}
              >
                <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                    stroke={colors.text.inverse || '#FFFFFF'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M12 11a4 4 0 100-8 4 4 0 000 8z"
                    stroke={colors.text.inverse || '#FFFFFF'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </MetricIconDisc>

              <View style={{ flex: 1 }}>
                <AppText variant="titleMedium" colorType="primary">
                  @{staff.username}
                </AppText>
                <AppText variant="caption" colorType="muted">
                  {staff.name || 'Staff Member'} • Added {staff.createdAt || 'Recent'}
                </AppText>
              </View>

              <View style={styles.statusSwitchWrap}>
                <AppBadge
                  label={staff.isActive ? 'Active' : 'Inactive'}
                  variant={staff.isActive ? 'success' : 'muted'}
                  style={{ marginRight: 8 }}
                />
                <AppSwitch
                  value={staff.isActive}
                  onValueChange={() =>
                    handleToggleStatus(staff.id, staff.isActive, staff.username)
                  }
                />
              </View>
            </View>

            {/* Allowed Permissions Chips */}
            <View style={styles.permSection}>
              <AppText variant="caption" colorType="muted" style={{ marginBottom: 6 }}>
                Allowed Access Permissions ({staff.allowedPermissions?.length || 0}):
              </AppText>
              <View style={styles.chipRow}>
                {staff.allowedPermissions?.map((permKey) => (
                  <View key={permKey} style={styles.chipWrapper}>
                    <AppBadge
                      label={PERMISSION_LABELS[permKey] || permKey}
                      variant="brand"
                      size="sm"
                    />
                  </View>
                ))}
                {(!staff.allowedPermissions || staff.allowedPermissions.length === 0) && (
                  <AppText variant="caption" colorType="muted">
                    No permissions assigned.
                  </AppText>
                )}
              </View>
            </View>

            {/* Action Buttons: Reset Password & Edit Permissions */}
            <View
              style={[
                styles.actionsRow,
                { borderTopColor: colors.border.subtle },
              ]}
            >
              <AppButton
                variant="outline"
                size="xs"
                title="Reset Password"
                onPress={() => openResetPasswordModal(staff)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <AppButton
                variant="secondary"
                size="xs"
                title="Edit Access"
                onPress={() => navigation.navigate('StaffForm', { staff })}
                style={{ flex: 1 }}
              />
            </View>
          </GlassCard>
        ))}

        <View style={{ height: verticalScale(16) }} />

        <AppButton
          variant="primary"
          title="+ Create New Staff Profile"
          onPress={() => navigation.navigate('StaffForm')}
        />

        <View style={{ height: verticalScale(20) }} />
      </View>

      {/* Password Reset Modal */}
      <AppModal
        visible={resetModalVisible}
        type="bottomSheet"
        title={`Reset Password: @${selectedStaff?.username || ''}`}
        onClose={() => setResetModalVisible(false)}
      >
        <View style={styles.modalBody}>
          <AppText variant="caption" colorType="muted" style={{ marginBottom: 12 }}>
            Set a temporary or new password for this staff profile. The user can sign in immediately.
          </AppText>

          <AppInput
            label="New Password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />

          <AppInput
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />

          <View style={{ height: spacing.md }} />

          <AppButton
            variant="primary"
            title="Save New Password"
            onPress={handleSavePassword}
          />
        </View>
      </AppModal>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: verticalScale(12),
  },
  addBtn: {
    paddingHorizontal: scale(4),
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  staffCard: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  statusSwitchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permSection: {
    marginTop: verticalScale(12),
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipWrapper: {
    marginRight: scale(6),
    marginBottom: verticalScale(6),
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: verticalScale(10),
    marginTop: verticalScale(8),
  },
  modalBody: {
    paddingBottom: verticalScale(16),
  },
});

export default StaffListScreen;