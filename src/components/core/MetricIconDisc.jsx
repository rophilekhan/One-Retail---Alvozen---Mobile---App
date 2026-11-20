import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale } from '../../theme/responsive.js';
import { useTheme } from '../../theme/index.js';

/**
 * BADGE_GRADIENTS
 * Exact 3D spherical gradient palettes from OneRx Figma
 */
export const BADGE_GRADIENTS = {
  // Mandatory core variants from skill
  default: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  teal: {
    dark: ['#1C373B', '#152528', '#0A1214'],
    light: ['#D8F5F8', '#EAF7F8', '#FFFFFF'],
  },
  purple: {
    dark: ['#534755', '#4A3C55', '#2E2235'],
    light: ['#F3E6FC', '#F9F1FD', '#FFFFFF'],
  },
  gold: {
    dark: ['#543A1F', '#48321B', '#362112'],
    light: ['#FFE4D3', '#FEF4EB', '#FFFFFF'],
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
  male: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  female: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  relation: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#fbfcff', '#f6f9ff', '#FFFFFF'],
  },
  company: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  institution: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  address: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  city: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  country: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  email: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  cnic: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },
  password: {
    dark: ['#282C38', '#1E202A', '#0F1015'],
    light: ['#E8EDFA', '#F1F4FC', '#FFFFFF'],
  },

  // First Visit / Aqua
  first_visit: {
    dark: ['#1C373B', '#152528', '#0A1214'],
    light: ['#D8F5F8', '#EAF7F8', '#FFFFFF'],
  },
  follow_up: {
    dark: ['#1C373B', '#152528', '#0A1214'],
    light: ['#D8F5F8', '#EAF7F8', '#FFFFFF'],
  },
  visit: {
    dark: ['#1C373B', '#152528', '#0A1214'],
    light: ['#D8F5F8', '#EAF7F8', '#FFFFFF'],
  },
  aqua: {
    dark: ['#1C373B', '#152528', '#0A1214'],
    light: ['#D8F5F8', '#EAF7F8', '#FFFFFF'],
  },

  // Metrics / Vitals
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
  bmi: {
    dark: ['#5E5E74', '#4B5060', '#323740'],
    light: ['#FAF2FF', '#FCF6FF', '#FFFFFF'],
  },

  // Banking
  bank: {
    dark: ['#5C5361', '#39353B', '#1D1D1D'],
    light: ['#FAF2FF', '#FDFAFF', '#FFFFFF'],
  },
  bank_transfer: {
    dark: ['#5C5361', '#39353B', '#1D1D1D'],
    light: ['#FAF2FF', '#FDFAFF', '#FFFFFF'],
  },
};

/**
 * MetricIconDisc
 * Standalone circular disc with 3D spherical gradient illumination.
 * Supports: 'default' | 'teal' | 'purple' | 'gold' | any domain key.
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
      {children}
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
});

export default MetricIconDisc;
