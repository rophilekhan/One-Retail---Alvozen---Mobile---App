import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale } from '../../theme/responsive.js';
import GlassSurface from './GlassSurface.jsx';

/**
 * AppBackButton - Circular glass back button with SVG chevron
 * Strictly adheres to rule: never raw '<' text.
 *
 * @param {Object} props
 * @param {Function} props.onPress
 * @param {number} [props.size] - Circle diameter (default scale(42))
 * @param {Object} [props.style]
 */
export const AppBackButton = ({
  onPress,
  size = scale(42),
  style,
  ...rest
}) => {
  const { isDark, colors } = useTheme();
  const iconColor = isDark ? '#FFFFFF' : (colors?.brand?.primaryDark || '#0F4761');
  const iconSize = Math.round(size * 0.48);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      {...rest}
    >
      <GlassSurface
        width={size}
        height={size}
        borderRadius={size / 2}
        fillOpacity={isDark ? 0.06 : 0.22}
        sheenScale={0}
        blurAmount={0}
      >
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M14.5 5.5L8 12L14.5 18.5"
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </GlassSurface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppBackButton;
