import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import AppText from './AppText.jsx';
import AppToast from './AppToast.jsx';
import { QRScannerIcon } from '../../assets/vectors/PrescriptionIcons.jsx';
import { useStaffStore, PERMISSIONS } from '../../store/useStaffStore.js';

/**
 * FloatingBottomBar - OneRetail Floating Pill Navigation Bar
 * Exact OneRx & Figma dimensions: 290x64 pill container + 8px gap + 64x64 FAB button (width 362pt)
 * Center FAB is dedicated to digital prescription QR scanning.
 *
 * @param {Object} props
 * @param {string} [props.activeTab='Home']
 * @param {Function} props.onTabPress
 * @param {Function} props.onFabPress
 * @param {Array<Object>} [props.tabs]
 * @param {Object} [props.style]
 */
export const FloatingBottomBar = ({
  activeTab = 'Home',
  onTabPress,
  onFabPress,
  tabs,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const hasScanDevice = useStaffStore((s) => s.hasPermission?.(PERMISSIONS.SCAN_QR_DEVICE) ?? true);
  const hasScanPlugin = useStaffStore((s) => s.hasPermission?.(PERMISSIONS.SCAN_QR_PLUGIN) ?? true);
  const canScan = hasScanDevice || hasScanPlugin;

  const pillBg = isDark ? '#020202' : '#FFFFFF';
  const pillBorder = isDark ? 'rgba(255, 255, 255, 0.10)' : '#F5F5F5';

  const fabBg = isDark ? '#009BA9' : '#0F4761';
  const fabBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const fabShadowColor = isDark ? '#009BA9' : '#0F4761';
  const primaryBrand = colors.brand?.primary || '#009BA9';

  // Default OneRetail Navigation Items matching OneRx exact SVGs
  const DEFAULT_ITEMS = [
    {
      id: 'Home',
      label: 'Home',
      icon: (color, isActive) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M10.19 2.83 3.64 8.07c-1.12.9-1.64 2.38-1.64 3.82v7.11c0 1.66 1.34 3 3 3h14c1.66 0 3-1.34 3-3v-7.11c0-1.44-.52-2.92-1.64-3.82l-6.55-5.24a2.99 2.99 0 0 0-3.62 0Z"
            fill={isActive ? primaryBrand : 'none'}
            stroke={isActive ? primaryBrand : color}
            strokeWidth={isActive ? '0' : '1.8'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {isActive ? (
            <Path d="M12 15v3.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          ) : null}
        </Svg>
      ),
    },
    {
      id: 'TradeSchemes',
      label: 'Schemes',
      icon: (color, isActive) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
            fill={isActive ? primaryBrand : 'none'}
            stroke={isActive ? primaryBrand : color}
            strokeWidth={isActive ? '0' : '1.8'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="7" cy="7" r="2" fill={isActive ? '#FFFFFF' : color} />
          <Path
            d="M10 14l4-4"
            stroke={isActive ? '#FFFFFF' : color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </Svg>
      ),
    },
    {
      id: 'ImpactWallet',
      label: 'Impact',
      icon: (color, isActive) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 3h12l4 6-10 12L2 9l4-6z"
            fill={isActive ? primaryBrand : 'none'}
            stroke={isActive ? primaryBrand : color}
            strokeWidth={isActive ? '0' : '1.8'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M2 9h20M10 21L6 9l3-6m9 6l-4 12"
            stroke={isActive ? '#FFFFFF' : color}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ),
    },
    {
      id: 'Settings',
      label: 'Settings',
      icon: (color, isActive) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            fill={isActive ? primaryBrand : 'none'}
            stroke={isActive ? primaryBrand : color}
            strokeWidth={isActive ? '0' : '1.8'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            stroke={isActive ? primaryBrand : color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ),
    },
  ];

  const navItems = tabs || DEFAULT_ITEMS;
  const bottomPosition = insets.bottom > 0 ? insets.bottom + verticalScale(8) : verticalScale(24);

  const handleFabAction = () => {
    if (!canScan) {
      AppToast.show({
        title: 'Access Restricted',
        message: 'Your staff account lacks permission to scan prescription QR codes.',
        type: 'warning',
      });
      return;
    }
    if (onFabPress) onFabPress();
  };

  return (
    <View
      style={[styles.absoluteContainer, { bottom: bottomPosition }, style]}
      pointerEvents="box-none"
    >
      <View style={styles.navRow} pointerEvents="box-none">
        {/* Menu Items Pill (290x64 in Figma) */}
        <View
          style={[
            styles.pillContainer,
            {
              backgroundColor: pillBg,
              borderColor: pillBorder,
            },
          ]}
          accessibilityRole="tablist"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const itemIconColor = isActive
              ? primaryBrand
              : isDark
              ? '#787878'
              : '#ABABAB';

            const itemTextColor = isActive
              ? (isDark ? '#FFFFFF' : '#020202')
              : (isDark ? '#ABABAB' : '#787878');

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.navItem}
                activeOpacity={0.7}
                accessibilityRole="tab"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isActive }}
                onPress={() => onTabPress && onTabPress(item.id)}
              >
                <View style={styles.iconWrapper}>
                  {typeof item.icon === 'function' ? item.icon(itemIconColor, isActive) : item.icon}
                </View>
                <AppText
                  variant={isActive ? 'captionMedium' : 'caption'}
                  style={[
                    styles.navLabel,
                    {
                      color: itemTextColor,
                      fontFamily: isActive ? 'DMSans-Medium' : 'DMSans-Regular',
                    },
                  ]}
                >
                  {item.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Center Rx QR Scanner Action Button (64x64 in Figma) */}
        <TouchableOpacity
          style={[
            styles.fab,
            {
              backgroundColor: fabBg,
              borderColor: fabBorder,
              shadowColor: fabShadowColor,
            },
          ]}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Scan Prescription QR"
          onPress={handleFabAction}
        >
          {/* Exact OneRx QR Scanner SVG Vector */}
          <QRScannerIcon size={26} color="#FFFFFF" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    left: scale(20),
    right: scale(20),
    zIndex: 100,
    alignItems: 'center',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(362),
    gap: scale(8),
  },
  pillContainer: {
    width: scale(290),
    height: verticalScale(64),
    borderRadius: scale(200),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: scale(12),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.08,
    shadowRadius: scale(16),
    elevation: 6,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(52),
    minHeight: verticalScale(48),
  },
  iconWrapper: {
    height: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(2),
  },
  navLabel: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    textAlign: 'center',
  },
  fab: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(200),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowOpacity: 0.35,
    shadowRadius: scale(14),
    elevation: 8,
  },
});

export default FloatingBottomBar;
