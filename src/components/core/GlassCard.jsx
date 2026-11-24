import React, { memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/index.js';
import { radii } from '../../theme/radii.js';
import { spacing } from '../../theme/spacing.js';
import { scale, moderateScale } from '../../theme/responsive.js';

const ENABLE_BLUR = Platform.OS === 'ios';
const BLUR_AMOUNT = 2;

const OUTER_W = 1.2;
const RING_W = 1.5;

const GlowRing = ({ index, alpha, radius }) => {
  if (Platform.OS === 'android') {
    // Android ReactViewBackgroundDrawable cannot render rounded corners with differing per-side colors.
    // Setting per-side border colors with borderRadius results in sharp rectangle artifacts on Android.
    return null;
  }
  const inset = index * RING_W;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: inset,
        left: inset,
        right: inset,
        bottom: inset,
        borderRadius: Math.max(radius - OUTER_W - inset, 0),
        borderWidth: RING_W,
        borderTopColor: `rgba(255,255,255,${alpha.top})`,
        borderLeftColor: `rgba(255,255,255,${alpha.left})`,
        borderRightColor: `rgba(255,255,255,${alpha.right})`,
        borderBottomColor: `rgba(255,255,255,${alpha.bottom})`,
      }}
    />
  );
};

export const GlassCard = memo(({
  children,
  style,
  contentStyle,
  radius = radii.card,
  noPadding = false,
}) => {
  const { colors, isDark } = useTheme();

  const blurType = isDark ? 'dark' : 'light';
  const glowTheme = isDark
    ? [
        { top: 0.04, left: 0.015, right: 0.015, bottom: 0.05 },
        { top: 0.015, left: 0.005, right: 0.005, bottom: 0.02 },
      ]
    : [];

  const frostColors = colors?.glassCard?.frost || (
    isDark
      ? ['rgba(192, 169, 255, 0.08)', 'rgba(182, 186, 229, 0.07)', 'rgba(152, 155, 168, 0.13)']
      : ['#FFFFFF', '#FFFFFF']
  );

  const borderProps = Platform.select({
    ios: {
      borderWidth: OUTER_W,
      borderTopColor: colors?.glassCard?.outerTop || (isDark ? 'rgba(255,255,255,0.34)' : 'rgba(0, 0, 0, 0.08)'),
      borderLeftColor: colors?.glassCard?.outerLeft || (isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0, 0, 0, 0.06)'),
      borderRightColor: colors?.glassCard?.outerRight || (isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0, 0, 0, 0.06)'),
      borderBottomColor: colors?.glassCard?.outerBottom || (isDark ? 'rgba(255,255,255,0.26)' : 'rgba(0, 0, 0, 0.08)'),
    },
    android: {
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : (colors?.border?.card || 'rgba(0, 0, 0, 0.06)'),
    },
  });

  return (
    <View
      style={[
        styles.outer,
        {
          borderRadius: radius,
          backgroundColor: isDark ? 'transparent' : (colors?.surface?.card || '#FFFFFF'),
        },
        !isDark && styles.lightCardShadow,
        borderProps,
        style,
      ]}
    >
      {ENABLE_BLUR && isDark && (
        <BlurView
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
          blurType={blurType}
          blurAmount={BLUR_AMOUNT}
          overlayColor="transparent"
          reducedTransparencyFallbackColor="transparent"
        />
      )}

      {isDark && (
        <LinearGradient
          pointerEvents="none"
          colors={frostColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        />
      )}

      {isDark && glowTheme.map((alpha, i) => (
        <GlowRing key={i} index={i} alpha={alpha} radius={radius} />
      ))}

      <View
        style={[
          styles.content,
          noPadding && { padding: 0 },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  lightCardShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    width: '100%',
    flexDirection: 'column',
    padding: moderateScale(14),
  },
});

export default GlassCard;
