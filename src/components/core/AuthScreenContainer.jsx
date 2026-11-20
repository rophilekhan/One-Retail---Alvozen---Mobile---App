import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../../theme/index.js';

const DESIGN_W = 402;
const DESIGN_H = 874;

// Smoothed interpolation steps for a flawless mesh gradient blending
const KNOTS = [0, 0.25, 0.5, 0.75, 1];

const THEMES = {
  light: {
    base: '#FFFFFF',
    blobs: [
      {
        // Top-left bright cyan wash
        cx: 0,
        cy: 0,
        rx: 480,
        ry: 580,
        color: '#88E7ED',
        alpha: [1.0, 0.8, 0.4, 0.1, 0.0],
      },
      {
        // Top-right soft lavender/purple glow
        cx: 402,
        cy: 0,
        rx: 420,
        ry: 480,
        color: '#C8C6F5',
        alpha: [0.9, 0.65, 0.3, 0.08, 0.0],
      },
      {
        // Mid-right soft neutral blend
        cx: 402,
        cy: 380,
        rx: 350,
        ry: 350,
        color: '#E0F2FE',
        alpha: [0.6, 0.3, 0.1, 0.0, 0.0],
      },
    ],
  },
  dark: {
    base: '#000000',
    blobs: [
      {
        cx: 0,
        cy: 0,
        rx: 550,
        ry: 500,
        color: '#0B2A2D',
        alpha: [1.0, 0.85, 0.5, 0.15, 0.0],
      },
      {
        cx: 402,
        cy: 0,
        rx: 500,
        ry: 450,
        color: '#2A3256',
        alpha: [0.95, 0.75, 0.4, 0.1, 0.0],
      },
      {
        cx: 402,
        cy: 250,
        rx: 400,
        ry: 350,
        color: '#3B4D6B',
        alpha: [0.5, 0.25, 0.08, 0.0, 0.0],
      },
    ],
  },
};

/**
 * AuthScreenContainer - Multi-Radial SVG Mesh Gradient Container
 * Exact port from OneRx matching Figma designs
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.keyboardAvoiding=false]
 * @param {number} [props.keyboardVerticalOffset=0]
 * @param {Object} [props.style]
 */
export const AuthScreenContainer = ({
  children,
  keyboardAvoiding = false,
  keyboardVerticalOffset = 0,
  style,
}) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const t = isDark ? THEMES.dark : THEMES.light;
  const bottomInset = Math.max(insets.bottom, 16);

  const content = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardVerticalOffset : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <View style={[styles.flex, { paddingBottom: bottomInset }]}>{children}</View>
  );

  return (
    <View style={[styles.root, { backgroundColor: t.base }, style]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />

      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}
        preserveAspectRatio="xMidYMin slice"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          {/* Render Radial Gradients for the glowing blobs */}
          {t.blobs.map((b, i) => (
            <RadialGradient
              key={`g${i}`}
              id={`authGlow${i}`}
              cx={b.cx}
              cy={b.cy}
              fx={b.cx}
              fy={b.cy}
              rx={b.rx}
              ry={b.ry}
              gradientUnits="userSpaceOnUse"
            >
              {b.alpha.map((a, k) => (
                <Stop
                  key={k}
                  offset={KNOTS[k]}
                  stopColor={b.color}
                  stopOpacity={a}
                />
              ))}
            </RadialGradient>
          ))}
        </Defs>

        {/* Draw solid base background */}
        <Rect width={DESIGN_W} height={DESIGN_H} fill={t.base} />

        {/* Draw the glowing mesh gradient blobs */}
        {t.blobs.map((_, i) => (
          <Rect
            key={`r${i}`}
            width={DESIGN_W}
            height={DESIGN_H}
            fill={`url(#authGlow${i})`}
          />
        ))}
      </Svg>

      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});

export default AuthScreenContainer;
