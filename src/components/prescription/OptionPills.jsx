import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { radii } from '../../theme/radii.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText } from '../global/index.js';
import { useTheme } from '../../theme/index.js';

/**
 * OptionPills - Exact OneRx Pill Segment Switcher
 * Zero hardcoded hex colors — powered strictly by useTheme().
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
        const unselectedBg = isDark ? colors.surface.inputSecondary : colors.surface.card;
        const unselectedBorder = isDark ? colors.border.subtle : colors.border.default;
        const activeBg = colors.brand.primary;

        return (
          <TouchableOpacity
            key={opt}
            activeOpacity={0.8}
            onPress={() => onSelect?.(opt)}
            style={[
              styles.quickPill,
              i > 0 && styles.pillGap,
              {
                backgroundColor: active ? activeBg : unselectedBg,
                borderColor: active ? activeBg : unselectedBorder,
              },
            ]}
          >
            <AppText
              numberOfLines={2}
              style={[
                styles.pillLabel,
                {
                  color: active ? colors.cta.sliderKnob : colors.text.primary,
                },
              ]}
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
    width: '100%',
  },
  pillGap: {
    marginLeft: scale(10),
  },
  quickPill: {
    flex: 1,
    minHeight: verticalScale(44),
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(14),
    lineHeight: scaleFont(18),
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default OptionPills;
