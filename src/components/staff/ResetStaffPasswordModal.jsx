import React, { useState, memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { AppText, AppButton, AppModal, AppToast, FieldIconBadge } from '../core/index.js';
import {
  LockOutlineIcon,
  CloseIcon,
  EyeOffIcon,
  EyeOpenIcon,
} from '../../assets/vectors/index.js';

/**
 * ResetStaffPasswordModal
 * Exact 1:1 port of OneRx PAChangePasswordModal
 * Features the signature pill inputs with lavender/violet gradient halo behind lock icons
 * and eye-off/eye-open visibility toggles.
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Object} props.staffMember - Target staff record
 * @param {Function} props.onSave - Callback (staffId, newPassword)
 * @param {Function} [props.onSuccess]
 */
export const ResetStaffPasswordModal = memo(({
  visible,
  onClose,
  staffMember,
  onSave,
  onSuccess,
}) => {
  const { colors, isDark } = useTheme();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const staffName = staffMember?.name || staffMember?.username || 'Staff Member';

  const handleSubmit = () => {
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Confirmation password does not match.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSave && staffMember?.id) {
        onSave(staffMember.id, newPassword);
      }
      handleModalClose();
      AppToast.show({
        title: 'Password Updated',
        message: `Password for ${staffName} updated successfully.`,
        type: 'info',
        primaryButtonText: 'Okay',
      });
      if (onSuccess) onSuccess();
    }, 600);
  };

  const handleModalClose = () => {
    setError('');
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const isNewFilled = Boolean(newPassword && newPassword.length > 0);
  const isConfirmFilled = Boolean(confirmPassword && confirmPassword.length > 0);

  const getPillStyle = (isFilled) => {
    if (isDark) {
      if (isFilled) {
        return {
          bg: '#000000',
          border: 'transparent',
          borderWidth: 0,
          textColor: '#FFFFFF',
          iconColor: '#FFFFFF',
          placeholderColor: '#7E8B9B',
          eyeColor: '#9CA3AF',
          hasShadow: false,
        };
      } else {
        return {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.12)',
          borderWidth: 1,
          textColor: '#FFFFFF',
          iconColor: '#FFFFFF',
          placeholderColor: '#7E8B9B',
          eyeColor: '#7E8B9B',
          hasShadow: false,
        };
      }
    } else {
      return {
        bg: '#FFFFFF',
        border: '#EDF2F7',
        borderWidth: 1,
        textColor: '#0F172A',
        iconColor: '#020202',
        placeholderColor: '#9CA3AF',
        eyeColor: '#9CA3AF',
        hasShadow: true,
      };
    }
  };

  const newConfig = getPillStyle(isNewFilled);
  const confirmConfig = getPillStyle(isConfirmFilled);

  const primaryBtnBg = isDark ? '#00B5C4' : '#0F4761';
  const primaryBtnText = isDark ? '#020202' : '#FFFFFF';
  const handleBarColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';

  return (
    <AppModal
      visible={visible}
      onClose={handleModalClose}
      type="bottomSheet"
      style={styles.sheetSurface}
    >
      <View style={styles.sheetContent}>
        {/* Top Drag Handle Indicator */}
        <View style={[styles.handleBar, { backgroundColor: handleBarColor }]} />

        {/* Header: Title + Close Icon */}
        <View style={styles.headerRow}>
          <View>
            <AppText
              style={[styles.modalTitle, { color: colors.text?.primary || '#020202' }]}
            >
              Change Password
            </AppText>
            <AppText
              style={[styles.modalSubtitle, { color: colors.text?.secondary || '#787878' }]}
            >
              For {staffName}
            </AppText>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleModalClose}
            style={styles.closeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
          >
            <CloseIcon size={scale(18)} color={colors.text?.secondary || '#787878'} />
          </TouchableOpacity>
        </View>

        {error.length > 0 && (
          <View style={[styles.errorBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <AppText style={[styles.errorText, { color: colors.status?.error || '#EF4444' }]}>
              {error}
            </AppText>
          </View>
        )}

        {/* ── Input 1: New Password Pill ──────────────────── */}
        <View
          style={[
            styles.inputPill,
            {
              backgroundColor: newConfig.bg,
              borderColor: newConfig.border,
              borderWidth: newConfig.borderWidth,
            },
            newConfig.hasShadow && styles.pillShadow,
          ]}
        >
          <FieldIconBadge type="password" isDark={isDark} size={40}>
            <LockOutlineIcon size={scale(19)} color={newConfig.iconColor} />
          </FieldIconBadge>

          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            secureTextEntry={!showNewPassword}
            placeholderTextColor={newConfig.placeholderColor}
            style={[styles.textInput, { color: newConfig.textColor }]}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowNewPassword((prev) => !prev)}
            style={styles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={showNewPassword ? 'Hide password' : 'Show password'}
          >
            {showNewPassword ? (
              <EyeOpenIcon size={scale(18)} color={newConfig.eyeColor} />
            ) : (
              <EyeOffIcon size={scale(18)} color={newConfig.eyeColor} />
            )}
          </TouchableOpacity>
        </View>

        {/* ── Input 2: Confirm Password Pill ──────────────── */}
        <View
          style={[
            styles.inputPill,
            {
              backgroundColor: confirmConfig.bg,
              borderColor: confirmConfig.border,
              borderWidth: confirmConfig.borderWidth,
            },
            confirmConfig.hasShadow && styles.pillShadow,
          ]}
        >
          <FieldIconBadge type="password" isDark={isDark} size={40}>
            <LockOutlineIcon size={scale(19)} color={confirmConfig.iconColor} />
          </FieldIconBadge>

          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm New Password"
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor={confirmConfig.placeholderColor}
            style={[styles.textInput, { color: confirmConfig.textColor }]}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowConfirmPassword((prev) => !prev)}
            style={styles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOpenIcon size={scale(18)} color={confirmConfig.eyeColor} />
            ) : (
              <EyeOffIcon size={scale(18)} color={confirmConfig.eyeColor} />
            )}
          </TouchableOpacity>
        </View>

        {/* Subtle Horizontal Divider */}
        <View
          style={[
            styles.divider,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)',
            },
          ]}
        />

        {/* Update Password CTA */}
        <AppButton
          title="Update Password"
          size="lg"
          loading={isSubmitting}
          onPress={handleSubmit}
          style={[styles.submitBtn, { backgroundColor: primaryBtnBg }]}
          textStyle={{ color: primaryBtnText, fontFamily: fontFamilies.primaryBold }}
        />
      </View>
    </AppModal>
  );
});

const styles = StyleSheet.create({
  sheetSurface: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(Platform.OS === 'ios' ? 36 : 24),
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
  },
  sheetContent: {
    width: '100%',
  },
  handleBar: {
    width: scale(38),
    height: verticalScale(4),
    borderRadius: scale(2),
    alignSelf: 'center',
    marginBottom: verticalScale(14),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(18),
  },
  modalTitle: {
    fontFamily: fontFamilies.primaryBold,
    fontSize: scaleFont(18),
  },
  modalSubtitle: {
    fontFamily: fontFamilies.primary,
    fontSize: scaleFont(13),
    marginTop: verticalScale(2),
  },
  closeBtn: {
    padding: scale(4),
  },
  errorBox: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: scale(8),
    marginBottom: verticalScale(12),
  },
  errorText: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.primaryMedium,
  },
  inputPill: {
    height: verticalScale(56),
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    marginBottom: verticalScale(12),
  },
  pillShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(15),
    padding: 0,
  },
  eyeBtn: {
    padding: scale(6),
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: verticalScale(14),
  },
  submitBtn: {
    width: '100%',
    height: verticalScale(52),
    borderRadius: radii.pill,
  },
});

export default ResetStaffPasswordModal;
