import React, { memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale } from '../../theme/responsive.js';
import { useTheme } from '../../theme/index.js';

/**
 * BADGE_GRADIENTS
 * Exact 3D spherical gradient palettes from OneRx Figma (FieldIconBadge.jsx)
 */
export const BADGE_GRADIENTS = {
  // ── 1. Default Standard Slate / Periwinkle ─────────────────
  default: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },

  // ── 2. First Visit & Teal / Aqua ───────────────────────────
  teal: {
    dark: ['#1C373B', '#152528', '#0A1214'],
    light: ['#D8F5F8', '#EAF7F8', '#FFFFFF'],
  },
  first_visit: {
    dark: ['#1C373B', '#152528', '#0A1214'],
    light: ['#D8F5F8', '#EAF7F8', '#FFFFFF'],
  },
  follow_up: {
    dark: ['#1C373B', '#152528', '#0A1214'],
    light: ['#D8F5F8', '#EAF7F8', '#FFFFFF'],
  },
  aqua: {
    dark: ['#1C373B', '#152528', '#0A1214'],
    light: ['#D8F5F8', '#EAF7F8', '#FFFFFF'],
  },

  // ── 3. Vitals & Purple Specific Gradients ──────────────────
  purple: {
    dark: ['#5E5E74', '#4B5060', '#323740'],
    light: ['#FAF2FF', '#FCF6FF', '#FFFFFF'],
  },
  vitals: {
    dark: ['#5E5E74', '#4B5060', '#323740'],
    light: ['#FAF2FF', '#FCF6FF', '#FFFFFF'],
  },
  blood_pressure: {
    dark: ['#5E5E74', '#4B5060', '#323740'],
    light: ['#FAF2FF', '#FCF6FF', '#FFFFFF'],
  },
  heart_rate: {
    dark: ['#5E5E74', '#4B5060', '#323740'],
    light: ['#FAF2FF', '#FCF6FF', '#FFFFFF'],
  },
  temperature: {
    dark: ['#5E5E74', '#4B5060', '#323740'],
    light: ['#FAF2FF', '#FCF6FF', '#FFFFFF'],
  },
  glucose: {
    dark: ['#5E5E74', '#4B5060', '#323740'],
    light: ['#FAF2FF', '#FCF6FF', '#FFFFFF'],
  },
  allergies: {
    dark: ['#5E5E74', '#4B5060', '#323740'],
    light: ['#FAF2FF', '#FCF6FF', '#FFFFFF'],
  },

  // ── 4. Gold & Banking Specific Gradients ───────────────────
  gold: {
    dark: ['#543A1F', '#48321B', '#362112'],
    light: ['#FFE4D3', '#FEF4EB', '#FFFFFF'],
  },
  bank: {
    dark: ['#5C5361', '#39353B', '#1D1D1D'],
    light: ['#FAF2FF', '#FDFAFF', '#FFFFFF'],
  },
  bank_transfer: {
    dark: ['#5C5361', '#39353B', '#1D1D1D'],
    light: ['#FAF2FF', '#FDFAFF', '#FFFFFF'],
  },

  // ── 5. Impact Index Tier Specific Gradients ───────────────
  tier_emerging: {
    dark: ['#364A48', '#2B4542', '#20483D'],
    light: ['#DCFCF7', '#EAF7F5', '#FFFFFF'],
  },
  emerging: {
    dark: ['#364A48', '#2B4542', '#20483D'],
    light: ['#DCFCF7', '#EAF7F5', '#FFFFFF'],
  },
  tier_general_trade: {
    dark: ['#364A48', '#2B4542', '#20483D'],
    light: ['#DCFCF7', '#EAF7F5', '#FFFFFF'],
  },
  general_trade: {
    dark: ['#364A48', '#2B4542', '#20483D'],
    light: ['#DCFCF7', '#EAF7F5', '#FFFFFF'],
  },
  tier_established: {
    dark: ['#543A1F', '#48321B', '#362112'],
    light: ['#FFE4D3', '#FEF4EB', '#FFFFFF'],
  },
  established: {
    dark: ['#543A1F', '#48321B', '#362112'],
    light: ['#FFE4D3', '#FEF4EB', '#FFFFFF'],
  },
  tier_senior: {
    dark: ['#36444D', '#293C4B', '#1D2A35'],
    light: ['#DCEDF4', '#EFF6FB', '#FFFFFF'],
  },
  senior: {
    dark: ['#36444D', '#293C4B', '#1D2A35'],
    light: ['#DCEDF4', '#EFF6FB', '#FFFFFF'],
  },
  tier_key_account: {
    dark: ['#36444D', '#293C4B', '#1D2A35'],
    light: ['#DCEDF4', '#EFF6FB', '#FFFFFF'],
  },
  key_account: {
    dark: ['#36444D', '#293C4B', '#1D2A35'],
    light: ['#DCEDF4', '#EFF6FB', '#FFFFFF'],
  },
  tier_distinguished: {
    dark: ['#534755', '#4A3C55', '#2E2235'],
    light: ['#F3E6FC', '#F9F1FD', '#FFFFFF'],
  },
  distinguished: {
    dark: ['#534755', '#4A3C55', '#2E2235'],
    light: ['#F3E6FC', '#F9F1FD', '#FFFFFF'],
  },
  tier_flagship: {
    dark: ['#534755', '#4A3C55', '#2E2235'],
    light: ['#F3E6FC', '#F9F1FD', '#FFFFFF'],
  },
  flagship: {
    dark: ['#534755', '#4A3C55', '#2E2235'],
    light: ['#F3E6FC', '#F9F1FD', '#FFFFFF'],
  },

  // Field & Profile gradients
  name: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#fbfcff', '#f6f9ff', '#FFFFFF'],
  },
  username: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#fbfcff', '#f6f9ff', '#FFFFFF'],
  },
  phone: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#fbfcff', '#f6f9ff', '#FFFFFF'],
  },
  dob: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  calendar: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  address: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
};

/**
 * MetricIconDisc
 * Standalone circular disc with 3D spherical gradient illumination.
 * Supports: 'default' | 'teal' | 'purple' | 'gold' | any domain key.
 * Features 1px inner rim border and soft shadow in Light Mode.
 *
 * @param {Object} props
 * @param {boolean} [props.isDark] - Dark mode override (defaults to theme)
 * @param {number} [props.size=38]
 * @param {string} [props.variant='default']
 * @param {number} [props.marginRight=0]
 * @param {Object} [props.style]
 * @param {React.ReactNode} props.children
 */
export const MetricIconDisc = memo(({
  isDark: propIsDark,
  size = 38,
  variant = 'default',
  style,
  marginRight = 0,
  children,
}) => {
  const theme = useTheme();
  const isDark = propIsDark !== undefined ? propIsDark : theme.isDark;

  const gradient = BADGE_GRADIENTS[variant] || BADGE_GRADIENTS.default;
  const colors = isDark ? gradient.dark : gradient.light;
  const discSize = scale(size);
  const discRadius = discSize / 2;

  const defaultIconColor = isDark ? '#FFFFFF' : (theme.colors?.brand?.primaryDark || '#0F4761');
  const renderedChildren = React.isValidElement(children)
    ? React.cloneElement(children, {
        color: (children.props?.color && children.props.color !== '#FFFFFF' && children.props.color !== '#ffffff' && children.props.color !== '#fff')
          ? children.props.color
          : defaultIconColor,
      })
    : children;

  return (
    <View
      style={[
        styles.discContainer,
        {
          width: discSize,
          height: discSize,
          borderRadius: discRadius,
          ...(marginRight !== 0 ? { marginRight: scale(marginRight) } : {}),
        },
        !isDark && styles.discLightShadow,
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.45, 1]}
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: discRadius },
        ]}
      />
      {renderedChildren}
    </View>
  );
});

/**
 * FieldIconBadge
 * Direct wrapper for input pills and chips with built-in marginRight.
 */
export const FieldIconBadge = memo(({
  type = 'default',
  isDark,
  size = 40,
  variant,
  style,
  marginRight = 12,
  children,
}) => {
  const resolvedVariant = variant || type;
  return (
    <MetricIconDisc
      isDark={isDark}
      size={size}
      variant={resolvedVariant}
      marginRight={marginRight}
      style={style}
    >
      {children}
    </MetricIconDisc>
  );
});

const styles = StyleSheet.create({
  discContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  discLightShadow: {
    shadowColor: '#8db9ce',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.14,
    shadowRadius: scale(4),
    elevation: 2,
  },
});

export default MetricIconDisc;
