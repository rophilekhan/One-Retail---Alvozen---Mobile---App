import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { radii } from '../../theme/radii.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText } from '../core/index.js';
import { useTheme } from '../../theme/index.js';

/**
 * OptionPills - Pill Capsule Segment Switcher
 * Exact 1:1 port of OneRx OptionPills with responsive capsule styling
 * and dynamic light/dark theme tokens.
 *
 * @param {Object} props
 * @param {string[]} props.options
 * @param {string} props.selected
 * @param {Function} props.onSelect
 * @param {Function} [props.format]
 * @param {Object} [props.style]
 */
export const OptionPills = memo(({ options = [], selected, onSelect, format, style }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.pillRow, style]}>
      {options.map((opt, i) => {
        const active = selected === opt;
        const unselectedBg = isDark ? 'rgba(255, 255, 255, 0.05)' : '#F0F2F5';
        const unselectedBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB';
        const activeBg = colors.brand?.primary || (isDark ? '#00829B' : '#009BA9');

        return (
          <TouchableOpacity
            key={opt}
            activeOpacity={0.8}
            onPress={() => onSelect?.(opt)}
            style={[
              styles.quickPill,
              i > 0 && { marginLeft: scale(8) },
              {
                backgroundColor: active ? activeBg : unselectedBg,
                borderColor: active ? activeBg : unselectedBorder,
              },
            ]}
          >
            <AppText
              numberOfLines={1}
              style={{
                fontFamily: fontFamilies.primaryMedium,
                fontSize: scaleFont(13),
                lineHeight: scaleFont(17),
                textAlign: 'center',
                color: active ? '#FFFFFF' : (isDark ? '#E4E4E7' : '#374151'),
                fontWeight: active ? '600' : '500',
              }}
            >
              {format ? format(opt) : opt}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  quickPill: {
    flex: 1,
    minHeight: verticalScale(38),
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OptionPills;
