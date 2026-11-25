import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import AppText from './AppText.jsx';

/**
 * AppBadge - Reusable Badge / Tag / Status Chip Atom
 * Fully implements all design system variants with semantic tokens and size options.
 *
 * @param {Object} props
 * @param {string} props.label - Badge text content
 * @param {'brand' | 'accent' | 'warning' | 'error' | 'success' | 'neutral' | 'muted'} [props.variant='brand'] - Visual badge variant
 * @param {'sm' | 'md'} [props.size='md'] - Sizing option
 * @param {boolean} [props.isMono=false] - Whether to use DM Mono typography
 * @param {React.ReactNode} [props.icon] - Optional leading icon
 * @param {Object} [props.style] - Container style overrides
 * @param {Object} [props.textStyle] - Label text style overrides
 */
export const AppBadge = ({
  label,
  variant = 'brand',
  size = 'md',
  isMono = false,
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
          text: isDark ? '#FFA043' : '#EA580C',
          border: isDark ? 'rgba(251, 107, 3, 0.35)' : 'rgba(251, 107, 3, 0.25)',
        };
      case 'success':
        return {
          bg: isDark ? 'rgba(40, 167, 69, 0.18)' : 'rgba(73, 200, 143, 0.14)',
          text: isDark ? '#34D399' : '#059669',
          border: isDark ? 'rgba(40, 167, 69, 0.35)' : 'rgba(73, 200, 143, 0.30)',
        };
      case 'error':
        return {
          bg: isDark ? 'rgba(239, 68, 68, 0.20)' : 'rgba(239, 68, 68, 0.12)',
          text: isDark ? '#F87171' : '#DC2626',
          border: isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.25)',
        };
      case 'warning':
        return {
          bg: isDark ? 'rgba(245, 158, 11, 0.20)' : 'rgba(245, 158, 11, 0.12)',
          text: isDark ? '#FBBF24' : '#D97706',
          border: isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.25)',
        };
      case 'neutral':
      case 'muted':
        return {
          bg: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          text: isDark ? '#D9D9D9' : '#52525B',
          border: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)',
        };
      case 'brand':
      default:
        return {
          bg: isDark ? 'rgba(0, 155, 169, 0.16)' : 'rgba(0, 155, 169, 0.12)',
          text: isDark ? '#38D6E5' : (colors.brand?.primaryDark || '#0F4761'),
          border: isDark ? 'rgba(0, 155, 169, 0.35)' : 'rgba(0, 155, 169, 0.25)',
        };
    }
  };

  const currentColors = getBadgeColors();
  const isSmall = size === 'sm';
  const safeLabel =
    label && typeof label === 'object' && !React.isValidElement(label)
      ? label.name ?? label.label ?? label.title ?? label.number ?? ''
      : label;

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
        isMono={isMono}
        style={[
          styles.text,
          {
            color: currentColors.text,
            fontFamily: isMono ? fontFamilies.monoMedium : fontFamilies.primaryMedium,
            ...(isMono ? { fontVariant: ['tabular-nums'] } : null),
          },
          isSmall && { fontSize: scale(9), lineHeight: scale(11) },
          textStyle,
        ]}
      >
        {safeLabel}
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
    flexShrink: 0,
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