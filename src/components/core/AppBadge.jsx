import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale } from '../../theme/responsive.js';
import AppText from './AppText.jsx';

/**
 * AppBadge - Reusable Badge / Tag / Status Chip Atom
 * Fully implements all design system variants with semantic tokens and size options.
 *
 * @param {Object} props
 * @param {string} props.label - Badge text content
 * @param {'brand' | 'accent' | 'warning' | 'error' | 'success' | 'neutral'} [props.variant='brand'] - Visual badge variant
 * @param {'sm' | 'md'} [props.size='md'] - Sizing option
 * @param {React.ReactNode} [props.icon] - Optional leading icon
 * @param {Object} [props.style] - Container style overrides
 * @param {Object} [props.textStyle] - Label text style overrides
 */
export const AppBadge = ({
  label,
  variant = 'brand',
  size = 'md',
  icon,
  style,
  textStyle,
}) => {
  const { colors, radii, isDark } = useTheme();

  const getBadgeColors = () => {
    switch (variant) {
      case 'accent':
        return {
          bg: isDark ? 'rgba(251, 107, 3, 0.16)' : 'rgba(251, 107, 3, 0.12)',
          text: colors.brand?.accent || '#fb6b03',
          border: isDark ? 'rgba(251, 107, 3, 0.35)' : 'rgba(251, 107, 3, 0.25)',
        };
      case 'success':
        return {
          bg: isDark ? 'rgba(40, 167, 69, 0.18)' : 'rgba(40, 167, 69, 0.12)',
          text: colors.status?.success || '#28A745',
          border: isDark ? 'rgba(40, 167, 69, 0.35)' : 'rgba(40, 167, 69, 0.25)',
        };
      case 'error':
        return {
          bg: isDark ? 'rgba(255, 75, 75, 0.18)' : 'rgba(255, 75, 75, 0.12)',
          text: colors.status?.error || '#FF4B4B',
          border: isDark ? 'rgba(255, 75, 75, 0.35)' : 'rgba(255, 75, 75, 0.25)',
        };
      case 'warning':
        return {
          bg: isDark ? 'rgba(255, 193, 7, 0.18)' : 'rgba(255, 193, 7, 0.12)',
          text: colors.status?.warning || '#FFC107',
          border: isDark ? 'rgba(255, 193, 7, 0.35)' : 'rgba(255, 193, 7, 0.25)',
        };
      case 'neutral':
        return {
          bg: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          text: colors.text?.secondary || '#787878',
          border: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)',
        };
      case 'brand':
      default:
        return {
          bg: isDark ? 'rgba(0, 155, 169, 0.16)' : 'rgba(0, 155, 169, 0.12)',
          text: colors.brand?.primary || '#009BA9',
          border: isDark ? 'rgba(0, 155, 169, 0.35)' : 'rgba(0, 155, 169, 0.25)',
        };
    }
  };

  const currentColors = getBadgeColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          borderRadius: radii.pill,
          backgroundColor: currentColors.bg,
          borderColor: currentColors.border,
          paddingHorizontal: isSmall ? scale(7) : scale(10),
          paddingVertical: isSmall ? 2 : 4,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <AppText
        variant="badge"
        style={[
          styles.text,
          { color: currentColors.text },
          isSmall && { fontSize: scale(9), lineHeight: scale(11) },
          textStyle,
        ]}
      >
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default AppBadge;