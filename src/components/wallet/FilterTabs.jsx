import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText } from '../core/index.js';

/**
 * FilterTabs
 *
 * Horizontally scrollable pill tabs for categories & reward filters.
 * Matches exact OneRx specifications:
 * - Active: Solid white pill in Light mode, solid black pill in Dark mode
 * - Inactive: Soft tinted aqua-slate in Light mode (#D0E2E7), dark slate in Dark mode (#263339)
 *
 * @param {Object} props
 * @param {Array<string>} [props.tabs=['All', 'Prescriptions', 'Data Sharing', 'Engagement']]
 * @param {string} [props.activeTab='All']
 * @param {Function} props.onTabChange
 * @param {Object} [props.style]
 */
export const FilterTabs = ({
  tabs = ['All', 'Prescriptions', 'Data Sharing', 'Engagement'],
  activeTab = 'All',
  onTabChange,
  style,
}) => {
  const { isDark } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.8}
            onPress={() => onTabChange && onTabChange(tab)}
            style={[
              styles.tabPill,
              {
                backgroundColor: isActive
                  ? (isDark ? '#000000' : '#FFFFFF')
                  : (isDark ? '#263339' : '#D0E2E7'),
                borderColor: isActive
                  ? (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)')
                  : 'transparent',
                borderWidth: isActive ? 1 : 0,
                shadowColor: isActive ? '#000000' : 'transparent',
                shadowOpacity: isActive ? 0.08 : 0,
                elevation: isActive ? 2 : 0,
              },
            ]}
          >
            <AppText
              style={[
                styles.tabText,
                {
                  color: isActive
                    ? (isDark ? '#FFFFFF' : '#020202')
                    : (isDark ? '#E2E8F0' : '#0F172A'),
                  fontFamily: isActive ? fontFamilies.primaryBold : fontFamilies.primaryMedium,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: verticalScale(4),
  },
  tabPill: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  tabText: {
    fontSize: scaleFont(13),
    letterSpacing: -0.2,
  },
});

export default FilterTabs;
