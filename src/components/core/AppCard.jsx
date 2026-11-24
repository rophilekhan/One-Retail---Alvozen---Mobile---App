import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale } from '../../theme/responsive.js';

/**
 * AppCard - Reusable Content Card Atom
 * 24px border radius with glassmorphic border and dual-mode elevations
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.elevated=false]
 * @param {boolean} [props.clickable=false]
 * @param {boolean} [props.noPadding=false]
 * @param {Function} [props.onPress]
 * @param {Object} [props.style]
 */
export const AppCard = ({
  children,
  elevated = false,
  clickable = false,
  noPadding = false,
  onPress,
  style,
  ...rest
}) => {
  const { colors, radii, spacing, shadows, isDark } = useTheme();

  const cardStyles = [
    styles.card,
    {
      backgroundColor: isDark
        ? (elevated ? colors.surface?.cardElevated || colors.surface?.card : colors.surface?.card)
        : (colors.surface?.card || '#FFFFFF'),
      borderColor: colors.border?.card || (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)'),
      borderRadius: radii.card, // 24px
      padding: noPadding ? 0 : (spacing?.cardPadding || scale(14)),
    },
    !isDark ? styles.lightShadow : (elevated ? shadows.card : shadows.subtle),
    style,
  ];

  if (clickable) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={cardStyles}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'column',
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 6,
  },
  lightShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default AppCard;
