import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText, PAToggleSwitch } from '../core/index.js';
import { PERMISSIONS } from '../../store/useStaffStore.js';

export const STAFF_PERMISSION_ITEMS = [
  {
    key: PERMISSIONS.SCAN_QR_DEVICE,
    label: 'Scan QR through device',
    subtext: 'Scan prescription QR codes directly using device camera',
  },
  {
    key: PERMISSIONS.SCAN_QR_PLUGIN,
    label: 'Scan QR through Plug-in',
    subtext: 'Scan prescription QR codes via desktop / POS barcode scanner',
  },
  {
    key: PERMISSIONS.PO_INITIATOR,
    label: 'PO Initiator',
    subtext: 'Draft and initiate distributor orders against trade schemes',
  },
  {
    key: PERMISSIONS.PO_APPROVER,
    label: 'PO Approver',
    subtext: 'Authorize, approve, and dispatch binding purchase orders',
  },
  {
    key: PERMISSIONS.EXPIRY_INITIATOR,
    label: 'Expiry Initiator',
    subtext: 'Log and initiate near-expiry medicine claim requests',
  },
  {
    key: PERMISSIONS.EXPIRY_APPROVER,
    label: 'Expiry Approver',
    subtext: 'Authorize and approve finalized expiry return consignments',
  },
  {
    key: PERMISSIONS.UPLOAD_CLOSING_DATA,
    label: 'Upload Closing Data',
    subtext: 'Upload daily closing stock & sales off-take data',
  },
];

/**
 * StaffPermissionsMatrix
 * Reusable features list with animated toggle switches & dynamic cyan borders
 * Exact 1:1 port of OneRx PAAllowedFeatures for the 7 OneRetail Staff Permissions.
 *
 * @param {Object} props
 * @param {Object|Array} props.permissions - Active permissions map or array of keys
 * @param {Function} props.onToggle - Callback (permissionKey) => void
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.title='Allowed permissions']
 */
export const StaffPermissionsMatrix = memo(({
  permissions = {},
  onToggle,
  onTogglePermission, // backwards compatibility
  disabled = false,
  title = 'Allowed permissions',
}) => {
  const { colors, isDark } = useTheme();

  const handleToggle = (key) => {
    if (onToggle) onToggle(key);
    else if (onTogglePermission) onTogglePermission(key);
  };

  const cardFill = isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF';
  const cardDefaultBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB';
  const cyanBorder = isDark ? '#00B5C4' : '#009BA9';

  return (
    <View style={styles.container}>
      {Boolean(title) && (
        <AppText style={[styles.sectionTitle, { color: colors.text?.primary || '#020202' }]}>
          {title}
        </AppText>
      )}

      {STAFF_PERMISSION_ITEMS.map((item) => {
        const isActive = Array.isArray(permissions)
          ? permissions.includes(item.key)
          : Boolean(permissions[item.key]);

        const borderColor = isActive ? cyanBorder : cardDefaultBorder;
        const borderWidth = isActive ? 1.5 : 1;

        return (
          <View
            key={item.key}
            style={[
              styles.featureCard,
              {
                backgroundColor: cardFill,
                borderColor,
                borderWidth,
              },
              !isDark && styles.cardShadow,
            ]}
          >
            <View style={styles.textWrap}>
              <AppText
                style={[styles.featureText, { color: colors.text?.primary || '#020202' }]}
              >
                {item.label}
              </AppText>
              {Boolean(item.subtext) && (
                <AppText
                  style={[styles.subtext, { color: colors.text?.secondary || '#787878' }]}
                >
                  {item.subtext}
                </AppText>
              )}
            </View>

            <PAToggleSwitch
              value={isActive}
              disabled={disabled}
              onValueChange={() => handleToggle(item.key)}
            />
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionTitle: {
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    fontSize: scaleFont(16),
    marginBottom: verticalScale(12),
  },
  featureCard: {
    minHeight: verticalScale(58),
    borderRadius: scale(18),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(10),
  },
  cardShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  textWrap: {
    flex: 1,
    marginRight: scale(12),
  },
  featureText: {
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
    fontSize: scaleFont(15),
  },
  subtext: {
    fontFamily: fontFamilies.primary,
    fontSize: scaleFont(12),
    marginTop: verticalScale(2),
  },
});

export default StaffPermissionsMatrix;
