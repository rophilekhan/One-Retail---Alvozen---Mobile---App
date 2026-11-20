import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { AppText, PAToggleSwitch } from '../core/index.js';
import { ChevronRightIcon } from '../../assets/vectors/index.js';

/**
 * StaffMemberCard - Exact OneRx PACard Port for OneRetail Staff Roster
 *
 * @param {Object} props
 * @param {Object} props.staff - Staff member object
 * @param {Function} props.onPress - Navigation callback to edit staff
 * @param {Function} props.onChangePassword - Trigger for Change Password modal
 * @param {Function} props.onToggleStatus - Status toggle callback (staffId, newStatus)
 */
export const StaffMemberCard = memo(({
  staff,
  onPress,
  onChangePassword,
  onToggleStatus,
}) => {
  const { colors, isDark } = useTheme();

  const isActive = staff?.isActive !== false && staff?.status !== 'Inactive';
  const name = staff?.name || staff?.username || 'Staff Member';
  const username = staff?.username ? `@${staff.username}` : '';
  const permissionsCount = Array.isArray(staff?.allowedPermissions)
    ? staff.allowedPermissions.length
    : 0;

  // Glass card transparency in dark mode allows background ambient gradient to shine through
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  const chevronBg = isDark ? 'rgba(255, 255, 255, 0.06)' : '#F5F5F5';
  const chevronColor = isDark ? '#9CA3AF' : '#787878';

  const btnBorder = isDark ? 'rgba(0, 181, 196, 0.35)' : '#E5E7EB';
  const btnText = isDark ? '#00B5C4' : '#0F4761';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.cardContainer,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
        },
        !isDark && styles.cardShadow,
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Staff member ${name}, ${permissionsCount} permissions`}
    >
      {/* ── Top Row: Avatar, Identity Info, Chevron Action ──── */}
      <View style={styles.topRow}>
        {/* Avatar Image / Fallback Initials */}
        {staff?.avatarUrl ? (
          <Image
            source={{ uri: staff.avatarUrl }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.avatarFallback,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : colors.surface?.iconBg || 'rgba(0, 155, 169, 0.1)',
              },
            ]}
          >
            <AppText
              style={[
                styles.avatarFallbackText,
                { color: colors.brand?.primary || '#009BA9' },
              ]}
            >
              {name.substring(0, 2).toUpperCase()}
            </AppText>
          </View>
        )}

        {/* Name & Role/Permissions Column */}
        <View style={styles.identityCol}>
          <AppText
            numberOfLines={1}
            style={[styles.staffName, { color: colors.text?.primary || '#020202' }]}
          >
            {name}
          </AppText>

          <AppText
            numberOfLines={1}
            style={[styles.subText, { color: colors.text?.secondary || '#787878' }]}
          >
            {username ? `${username} • ` : ''}{permissionsCount} of 7 permissions
          </AppText>
        </View>

        {/* Right Circular Chevron Action Button */}
        <View
          style={[
            styles.chevronCircle,
            { backgroundColor: chevronBg },
          ]}
        >
          <ChevronRightIcon size={scale(18)} color={chevronColor} />
        </View>
      </View>

      {/* ── Bottom Row: "Change Password" + Status Toggle ───── */}
      <View style={styles.bottomRow}>
        {/* "Change Password" Pill Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onChangePassword && onChangePassword(staff)}
          style={[
            styles.changePasswordBtn,
            { borderColor: btnBorder, backgroundColor: 'transparent' },
          ]}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          accessibilityRole="button"
          accessibilityLabel={`Change password for ${name}`}
        >
          <AppText style={[styles.changePasswordBtnText, { color: btnText }]}>
            Change Password
          </AppText>
        </TouchableOpacity>

        {/* Status Label & Toggle Switch */}
        <View style={styles.statusSwitchRow}>
          <AppText
            style={[
              styles.statusLabel,
              { color: isDark ? '#D1D5DB' : colors.text?.secondary || '#787878' },
            ]}
          >
            {isActive ? 'Active' : 'Inactive'}
          </AppText>

          <PAToggleSwitch
            value={isActive}
            onValueChange={(val) => onToggleStatus && onToggleStatus(staff.id, val)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: scale(22),
    borderWidth: 1,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(12),
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  avatarImage: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(23),
  },
  avatarFallback: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(23),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    fontFamily: fontFamilies.primaryBold,
    fontSize: scaleFont(16),
  },
  identityCol: {
    flex: 1,
    marginLeft: scale(12),
    justifyContent: 'center',
  },
  staffName: {
    fontFamily: fontFamilies.primaryBold,
    fontSize: scaleFont(17),
    fontWeight: '700',
  },
  subText: {
    fontFamily: fontFamilies.primary,
    fontSize: scaleFont(13.5),
    marginTop: verticalScale(2),
  },
  chevronCircle: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(8),
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changePasswordBtn: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  changePasswordBtnText: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(12),
  },
  statusSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  statusLabel: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(13),
    marginRight: scale(8),
  },
});

export default StaffMemberCard;
