import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/index.js';

/**
 * AppCard - Reusable Content Card Atom
 * 24px border radius with glassmorphic border and dual-mode elevations
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.elevated=false]
 * @param {boolean} [props.clickable=false]
 * @param {Function} [props.onPress]
 * @param {Object} [props.style]
 */
export const AppCard = ({
  children,
  elevated = false,
  clickable = false,
  onPress,
  style,
  ...rest
}) => {
  const { colors, radii, spacing, shadows } = useTheme();

  const cardStyles = [
    styles.card,
    {
      backgroundColor: elevated ? colors.surface?.cardElevated || colors.surface?.card : colors.surface?.card,
      borderColor: colors.border?.card || (colors.isDark ? 'rgba(255, 255, 255, 0.12)' : '#E4E4E7'),
      borderRadius: radii.card, // 24px
      padding: spacing.cardPadding,
    },
    elevated ? shadows.card : shadows.subtle,
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
});

export default AppCard;
