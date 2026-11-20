import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';

/**
 * GlassSurface – Unified Glassmorphic Surface Atom (capsule or circle).
 *
 * Props:
 *  width, height  : size in pt
 *  borderRadius   : default height/2 (capsule). For a circle, pass width=height.
 *  blurAmount     : default 14
 *  fillOpacity    : white fill opacity override (0 = fully transparent). Default: dark 0.06, light 0.30
 *  sheenScale     : top sheen reflection multiplier (default 1, 0 = off)
 *  rimOpacity     : 1px border rim opacity multiplier (default 1)
 *  style          : outer wrapper style
 *  contentStyle   : inner content style
 *  children       : content to render inside
 */
export const GlassSurface = ({
  width,
  height,
  borderRadius,
  blurAmount = 14,
  fillOpacity,
  sheenScale = 1,
  rimOpacity = 1,
  style,
  contentStyle,
  children,
}) => {
  const { colors, isDark } = useTheme();
  const radius = borderRadius ?? (height ? height / 2 : 20);
  const isIOS = Platform.OS === 'ios';

  // Android does not have hardware blur view; increase default fill opacity slightly for consistency
  const defaultFill = isDark ? (isIOS ? 0.06 : 0.1) : (isIOS ? 0.3 : 0.45);
  const fill = `rgba(255, 255, 255, ${fillOpacity ?? defaultFill})`;

  const sheenTop = (isDark ? 0.14 : 0.34) * sheenScale;
  const sheenMid = (isDark ? 0.04 : 0.1) * sheenScale;

  return (
    <View style={[{ width, height, borderRadius: radius }, style]}>
      <View
        style={[
          styles.surface,
          { borderRadius: radius, backgroundColor: fill },
        ]}
      >
        {blurAmount > 0 && isIOS && (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={isDark ? 'dark' : 'light'}
            blurAmount={blurAmount}
            overlayColor="transparent"
            reducedTransparencyFallbackColor={colors?.surface?.inputSecondary || '#181818'}
          />
        )}

        {/* Top-edge sheen reflection */}
        {sheenScale > 0 && (
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
            <Defs>
              <LinearGradient id="glassSheen" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={sheenTop} />
                <Stop offset="45%" stopColor="#FFFFFF" stopOpacity={sheenMid} />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#glassSheen)" />
          </Svg>
        )}

        {/* 1px subtle glass rim */}
        <View
          pointerEvents="none"
          style={[
            styles.rim,
            {
              borderRadius: radius,
              borderColor: isDark
                ? `rgba(255, 255, 255, ${0.28 * rimOpacity})`
                : `rgba(255, 255, 255, ${0.85 * rimOpacity})`,
              borderBottomColor: isDark
                ? `rgba(255, 255, 255, ${0.24 * rimOpacity})`
                : `rgba(255, 255, 255, ${0.65 * rimOpacity})`,
            },
          ]}
        />

        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    overflow: 'hidden',
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GlassSurface;
