import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale } from '../../theme/responsive.js';
import AppText from './AppText.jsx';

/**
 * AppCheckbox - Custom Rounded Checkbox Atom
 *
 * @param {Object} props
 * @param {boolean} [props.checked=false]
 * @param {Function} [props.onChange]
 * @param {Function} [props.onPress]
 * @param {boolean} [props.disabled=false]
 * @param {number} [props.size=scale(22)]
 * @param {string} [props.label]
 * @param {Object} [props.style]
 */
export const AppCheckbox = memo(({
  checked = false,
  onChange,
  onPress,
  disabled = false,
  size = scale(22),
  label,
  style,
}) => {
  const { colors, isDark } = useTheme();

  const handlePress = () => {
    if (disabled) return;
    const nextVal = !checked;
    if (onChange) onChange(nextVal);
    if (onPress) onPress(nextVal);
  };

  const activeColor = colors.brand?.primary || '#009BA9';
  const inactiveBorder = isDark ? 'rgba(255, 255, 255, 0.25)' : '#C4C4C4';
  const iconSize = Math.round(size * 0.6);

  const box = (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: scale(6),
          borderColor: checked ? activeColor : inactiveBorder,
          backgroundColor: checked ? activeColor : 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {checked && (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <Path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </View>
  );

  if (label) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        disabled={disabled}
        style={[styles.rowContainer, style]}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        {box}
        <AppText variant="bodyMedium" colorType="primary" style={styles.label}>
          {label}
        </AppText>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled}
      style={style}
      accessible={true}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      {box}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 10,
  },
});

export default AppCheckbox;
