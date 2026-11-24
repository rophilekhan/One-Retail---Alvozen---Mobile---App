import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import AppText from './AppText.jsx';

/**
 * DetailsChevronButton - Reusable Pill Details Button with Crisp SVG Chevron
 * Ported from OneRx AppointmentCard & OfferDiscountCard styling.
 *
 * Exact proportions:
 * - Height: verticalScale(34)
 * - Padding: paddingHorizontal: scale(12)
 * - Border radius: radii.pill (999)
 * - Layout: flexDirection: 'row', alignItems: 'center', gap: scale(4)
 * - Light Mode:
 *     backgroundColor: 'rgba(0, 155, 169, 0.10)'
 *     borderWidth: 1
 *     borderColor: 'rgba(0, 155, 169, 0.22)'
 *     text & chevron: colors.brand.primaryDark (#0F4761)
 * - Dark Mode:
 *     backgroundColor: 'rgba(255, 255, 255, 0.08)'
 *     borderWidth: 1
 *     borderColor: 'rgba(255, 255, 255, 0.16)'
 *     text & chevron: '#FFFFFF'
 * - Typography: DMSans-Medium, 12px, numberOfLines={1}
 * - Icon: <Path d="M9 6L15 12L9 18" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
 *
 * @param {Object} props
 * @param {string} [props.label='View Details']
 * @param {Function} props.onPress
 * @param {Object} [props.style]
 * @param {Object} [props.textStyle]
 * @param {string} [props.iconColor]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.testID]
 */
export const DetailsChevronButton = ({
  label = 'View Details',
  onPress,
  style,
  textStyle,
  iconColor,
  disabled = false,
  testID,
  ...rest
}) => {
  const { colors, isDark } = useTheme();

  const textColor = iconColor || (isDark ? '#FFFFFF' : (colors.brand?.primaryDark || '#0F4761'));

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.button,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 155, 169, 0.10)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 155, 169, 0.22)',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...rest}
    >
      <AppText
        style={[
          styles.label,
          {
            color: textColor,
            fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </AppText>
      <Svg
        width={scale(12)}
        height={scale(12)}
        viewBox="0 0 24 24"
        fill="none"
        style={styles.chevronIcon}
      >
        <Path
          d="M9 6L15 12L9 18"
          stroke={textColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: verticalScale(34),
    paddingHorizontal: scale(12),
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: scale(4),
  },
  label: {
    fontSize: scaleFont(12),
    letterSpacing: -0.2,
  },
  chevronIcon: {
    marginLeft: scale(2),
  },
});

export default DetailsChevronButton;
