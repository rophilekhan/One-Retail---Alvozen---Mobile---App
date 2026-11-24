import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import AppText from './AppText.jsx';

/**
 * FilterPillsBar
 *
 * Horizontal pill filter bar modeled on OneRx FilterTabs.jsx.
 * Strict geometry locks pill height & border width so switching active state NEVER jumps layout.
 *
 * @param {Object} props
 * @param {Array<string|{ id: string, label: string }>} props.tabs
 * @param {string} props.activeTab
 * @param {Function} props.onTabChange
 * @param {Object} [props.style]
 * @param {Object} [props.contentContainerStyle]
 */
export const FilterPillsBar = ({
  tabs = [],
  activeTab,
  onTabChange,
  style,
  contentContainerStyle,
}) => {
  const { isDark, colors, spacing } = useTheme();

  const activeColor = isDark
    ? (colors.brand?.primary || '#009BA9')
    : (colors.brand?.primaryDark || '#0F4761');

  const inactiveBg = isDark
    ? 'rgba(255, 255, 255, 0.06)'
    : (colors.surface?.card || '#FFFFFF');

  const inactiveBorder = colors.border?.default || (isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0');
  const inactiveTextColor = colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B');

  return (
    <View style={[styles.barWrapper, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingHorizontal: spacing?.screenHorizontal || scale(20),
            gap: spacing?.sm || scale(8),
          },
          contentContainerStyle,
        ]}
      >
        {tabs.map((tab) => {
          const tabKey = typeof tab === 'object' ? tab.id || tab.label : tab;
          const tabLabel = typeof tab === 'object' ? tab.label : tab;
          const isActive = activeTab === tabKey || activeTab === tabLabel;

          return (
            <TouchableOpacity
              key={tabKey}
              activeOpacity={0.8}
              onPress={() => onTabChange && onTabChange(tabKey)}
              style={[
                styles.pill,
                {
                  backgroundColor: isActive ? activeColor : inactiveBg,
                  borderColor: isActive ? activeColor : inactiveBorder,
                },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tabLabel} filter pill`}
            >
              <AppText
                numberOfLines={1}
                style={[
                  styles.pillText,
                  {
                    color: isActive ? '#FFFFFF' : inactiveTextColor,
                    fontFamily: isActive
                      ? (fontFamilies.primaryMedium || 'DMSans-Medium')
                      : (fontFamilies.primaryRegular || 'DMSans-Regular'),
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {tabLabel}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  barWrapper: {
    height: verticalScale(46),
    justifyContent: 'center',
    width: '100%',
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    height: verticalScale(38),
    paddingHorizontal: scale(16),
    borderRadius: radii?.pill || scale(999),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: scaleFont(13),
    letterSpacing: -0.2,
  },
});

export default FilterPillsBar;
