import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';

/**
 * AppText - OneRetail Typography Atom
 * Automatically binds typography tokens and semantic colors with foolproof fallbacks
 *
 * @param {Object} props
 * @param {string} [props.variant='bodyMedium']
 * @param {'primary' | 'secondary' | 'tertiary' | 'muted' | 'inverse' | 'brand' | 'accent' | 'warning' | 'error' | 'success'} [props.colorType='primary']
 * @param {string} [props.color] - Direct color override
 * @param {'left' | 'center' | 'right'} [props.align='left']
 * @param {Object} [props.style]
 * @param {React.ReactNode} props.children
 */
export const AppText = ({
  variant = 'bodyMedium',
  colorType = 'primary',
  color,
  align = 'left',
  style,
  children,
  ...rest
}) => {
  const { typography, colors } = useTheme();

  const variantStyle = typography?.[variant] || typography?.bodyMedium || {};

  // Clean, theme-driven semantic color mapping
  const resolveColor = () => {
    if (color) return color;

    switch (colorType) {
      case 'secondary':
        return colors.text?.secondary || '#787878';
      case 'tertiary':
        return colors.text?.tertiary || '#9CA3AF';
      case 'muted':
        return colors.text?.muted || '#787878';
      case 'inverse':
        return colors.text?.inverse || '#FFFFFF';
      case 'brand':
        return colors.brand?.primary || '#009BA9';
      case 'accent':
        return colors.brand?.accent || '#fb6b03';
      case 'warning':
        return colors.status?.warning || '#FFC107';
      case 'error':
        return colors.status?.error || '#FF4B4B';
      case 'success':
        return colors.status?.success || '#28A745';
      case 'primary':
      default:
        return colors.text?.primary || (colors.isDark ? '#FFFFFF' : '#020202');
    }
  };

  return (
    <Text
      {...rest}
      style={[
        styles.base,
        variantStyle,
        { color: resolveColor(), textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

export default AppText;
