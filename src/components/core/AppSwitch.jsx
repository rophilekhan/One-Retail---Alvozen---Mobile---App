import React, { memo, useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';

/**
 * AppSwitch - Custom Animated Toggle Switch Atom
 * Matches Figma OneRx / OneRetail specification with smooth spring slide.
 *
 * @param {Object} props
 * @param {boolean} [props.value=false]
 * @param {Function} props.onValueChange
 * @param {boolean} [props.disabled=false]
 * @param {Object} [props.style]
 */
export const AppSwitch = memo(({
  value = false,
  onValueChange,
  disabled = false,
  style,
}) => {
  const { colors, isDark } = useTheme();

  const trackW = scale(40);
  const trackH = verticalScale(24);
  const thumbSize = scale(18);
  const thumbPadding = scale(3);
  const maxTranslate = trackW - thumbSize - thumbPadding * 2;

  const translateX = useRef(new Animated.Value(value ? maxTranslate : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? maxTranslate : 0,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [value, maxTranslate, translateX]);

  // Track colors
  const activeTrackColor = colors.brand?.primary || '#009BA9';
  const inactiveTrackColor = isDark ? '#14181C' : '#E5E7EB';
  const trackBg = value ? activeTrackColor : inactiveTrackColor;

  const trackBorderColor = isDark
    ? (value ? 'transparent' : 'rgba(255, 255, 255, 0.15)')
    : 'transparent';

  // Thumb colors:
  // Dark mode: active thumb is pitch black (#000000), inactive thumb is dark slate grey (#3E454D)
  // Light mode: thumb is crisp white (#FFFFFF)
  const thumbBg = isDark
    ? (value ? '#000000' : '#3E454D')
    : '#FFFFFF';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onValueChange && onValueChange(!value)}
      style={[
        styles.track,
        {
          width: trackW,
          height: trackH,
          borderRadius: trackH / 2,
          paddingHorizontal: thumbPadding,
          backgroundColor: trackBg,
          borderColor: trackBorderColor,
          borderWidth: isDark && !value ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: thumbBg,
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default AppSwitch;
