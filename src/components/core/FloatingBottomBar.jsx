import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import AppText from './AppText.jsx';

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

  const pillBg = isDark ? '#020202' : '#FFFFFF';
  const pillBorder = isDark ? 'rgba(255, 255, 255, 0.10)' : '#F5F5F5';

  const fabBg = isDark ? colors.brand?.primary || '#009BA9' : colors.brand?.primaryDark || '#0F4761';
  const fabBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const fabShadowColor = isDark ? colors.brand?.primary || '#009BA9' : '#0F4761';

  // Default OneRetail Navigation Items matching OneRx exact SVGs
  const DEFAULT_ITEMS = [
    {
      id: 'Home',
      label: 'Home',
      icon: (color, isActive) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M10.19 2.83 3.64 8.07c-1.12.9-1.64 2.38-1.64 3.82v7.11c0 1.66 1.34 3 3 3h14c1.66 0 3-1.34 3-3v-7.11c0-1.44-.52-2.92-1.64-3.82l-6.55-5.24a2.99 2.99 0 0 0-3.62 0Z"
            fill={isActive ? colors.brand?.primary || '#009BA9' : 'none'}
            stroke={isActive ? colors.brand?.primary || '#009BA9' : color}
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
      icon: (color) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M16.75 3.56V2C16.75 1.59 16.41 1.25 16 1.25s-.75.34-.75.75v1.5H8.75V2C8.75 1.59 8.41 1.25 8 1.25s-.75.34-.75.75v1.56C4.55 3.81 3.24 5.42 3.04 7.81c-.02.29.22.53.5.53h16.92c.29 0 .53-.25.5-.53-.2-2.39-1.51-4-4.21-4.25Z"
            fill={color}
          />
          <Path
            opacity={0.4}
            d="M20 9.84c.55 0 1 .45 1 1v6.16c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V10.84c0-.55.45-1 1-1h16Z"
            fill={color}
          />
        </Svg>
      ),
    },
    {
      id: 'ImpactWallet',
      label: 'Impact',
      icon: (color) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ),
    },
    {
      id: 'Settings',
      label: 'Settings',
      icon: (color) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Circle cx="5" cy="12" r="2.2" fill={color} />
          <Circle cx="12" cy="12" r="2.2" fill={color} />
          <Circle cx="19" cy="12" r="2.2" fill={color} />
        </Svg>
      ),
    },
  ];

  const navItems = tabs || DEFAULT_ITEMS;
  const bottomPosition = insets.bottom > 0 ? insets.bottom + verticalScale(8) : verticalScale(24);

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
              ? colors.brand?.primary || '#009BA9'
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
          onPress={() => onFabPress && onFabPress()}
        >
          {/* Rx QR Scanner Reticle SVG Vector */}
          <Svg width={scale(26)} height={scale(26)} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Rect x="8" y="8" width="8" height="8" rx="1.5" stroke="#FFFFFF" strokeWidth="1.8" />
            <Circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
          </Svg>
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
