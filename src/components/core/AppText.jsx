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
const sanitizeTextChild = (node) => {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return node;
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return node;
  }
  if (React.isValidElement(node)) {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(sanitizeTextChild);
  }
  if (typeof node === 'object') {
    const candidate = node.name ?? node.label ?? node.title ?? node.number ?? '';
    return typeof candidate === 'string' || typeof candidate === 'number'
      ? candidate
      : '';
  }
  return String(node);
};

export const AppText = ({
  variant = 'bodyMedium',
  colorType = 'primary',
  color,
  align = 'left',
  isMono = false,
  style,
  children,
  ...rest
}) => {
  const { typography, colors } = useTheme();

  const variantStyle = typography?.[variant] || typography?.bodyMedium || {};
  const isMonoVariant =
    isMono || (typeof variant === 'string' && variant.startsWith('mono'));
  const monoOverrideStyle = isMonoVariant
    ? {
        fontVariant: ['tabular-nums'],
        ...(isMono && !(typeof variant === 'string' && variant.startsWith('mono'))
          ? { fontFamily: typography?.monoClinical?.fontFamily || 'DMMono-Medium' }
          : null),
      }
    : null;

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
        monoOverrideStyle,
        { color: resolveColor(), textAlign: align },
        style,
      ]}
    >
      {sanitizeTextChild(children)}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

export default AppText;
