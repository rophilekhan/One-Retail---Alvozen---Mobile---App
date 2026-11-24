import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import AppText from './AppText.jsx';

/**
 * AppButton - High-Contrast OneRetail Button Atom
 * Matches Figma capsule styling (radii.pill = 999)
 * Fixes OneRx dark mode contrast bugs (never black text on black background) & shadow bugs.
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'teal' | 'outline' | 'details' | 'iconOnly'} [props.variant='primary']
 * @param {'lg' | 'md' | 'sm' | 'xs'} [props.size='lg']
 * @param {string} [props.title]
 * @param {React.ReactNode} [props.iconLeft]
 * @param {React.ReactNode} [props.iconRight]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.disabled=false]
 * @param {Function} props.onPress
 * @param {Object} [props.style]
 * @param {Object} [props.textStyle]
 */
export const AppButton = ({
  variant = 'primary',
  size = 'lg',
  title,
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  onPress,
  style,
  textStyle,
  children,
  ...rest
}) => {
  const { colors, radii, spacing, shadows, isDark } = useTheme();

  // Size specifications
  const sizeStyles = {
    lg: { height: spacing.buttonHeight, paddingHorizontal: spacing.xxl },
    md: { height: spacing.buttonHeightSm, paddingHorizontal: spacing.lg },
    sm: { height: 36, paddingHorizontal: spacing.md },
    xs: { height: spacing.buttonHeightXs, paddingHorizontal: spacing.sm },
    details: { height: verticalScale(34), paddingHorizontal: scale(12) },
  };

  const currentSize = variant === 'details' && size === 'lg' ? sizeStyles.details : (sizeStyles[size] || sizeStyles.lg);

  // Variant styling with guaranteed high-contrast text in both Light & Dark modes
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
      case 'teal':
        return {
          backgroundColor: isDark ? (colors.brand?.primary || '#009BA9') : (colors.brand?.primaryDark || '#0F4761'),
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: '#FFFFFF',
          shadow: shadows.primary || shadows.subtle,
        };

      case 'secondary':
        return {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : (colors.surface?.card || '#FFFFFF'),
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : (colors.border?.default || '#E4E4E7'),
          borderWidth: 1,
          textColor: isDark ? '#FFFFFF' : (colors.brand?.primaryDark || '#0F4761'),
          shadow: shadows.subtle,
        };

      case 'accent':
        return {
          backgroundColor: colors.brand?.accent || '#FB6B03',
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: '#FFFFFF',
          shadow: shadows.accent || shadows.subtle,
        };

      case 'danger':
        return {
          backgroundColor: colors.status?.error || '#FF4B4B',
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: '#FFFFFF',
          shadow: shadows.danger || shadows.subtle,
        };

      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: isDark ? (colors.brand?.primary || '#009BA9') : (colors.brand?.primaryDark || '#0F4761'),
          borderWidth: 1.5,
          textColor: isDark ? '#FFFFFF' : (colors.brand?.primaryDark || '#0F4761'),
          shadow: shadows.none,
        };

      case 'details':
        return {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 155, 169, 0.10)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 155, 169, 0.22)',
          borderWidth: 1,
          textColor: isDark ? '#FFFFFF' : (colors.brand?.primaryDark || '#0F4761'),
          shadow: shadows.none,
        };

      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: isDark ? '#FFFFFF' : (colors.brand?.primaryDark || '#0F4761'),
          shadow: shadows.none,
        };

      case 'iconOnly':
        return {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : (colors.surface?.card || '#FFFFFF'),
          borderColor: colors.border.card,
          borderWidth: 1,
          textColor: colors.text.primary,
          shadow: shadows.subtle,
          width: currentSize.height,
          paddingHorizontal: 0,
        };

      default:
        return {
          backgroundColor: colors.brand.primary,
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: '#FFFFFF',
          shadow: shadows.subtle,
        };
    }
  };

  const vStyle = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          borderRadius: radii.pill,
          backgroundColor: vStyle.backgroundColor,
          borderColor: vStyle.borderColor,
          borderWidth: vStyle.borderWidth,
          opacity: disabled ? 0.45 : 1,
        },
        currentSize,
        vStyle.shadow,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={vStyle.textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
          {title ? (
            <AppText
              variant={size === 'lg' ? 'bodyLarge' : size === 'xs' ? 'captionMedium' : 'bodyMediumMedium'}
              style={[styles.text, { color: vStyle.textColor }, textStyle]}
            >
              {title}
            </AppText>
          ) : (
            children
          )}
          {iconRight ? (
            <View style={styles.iconRight}>{iconRight}</View>
          ) : variant === 'details' ? (
            <Svg
              width={scale(12)}
              height={scale(12)}
              viewBox="0 0 24 24"
              fill="none"
              style={styles.iconRight}
            >
              <Path
                d="M9 6L15 12L9 18"
                stroke={vStyle.textColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  text: {
    textAlign: 'center',
  },
});

export default AppButton;
