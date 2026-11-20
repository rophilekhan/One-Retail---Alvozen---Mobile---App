import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import AppText from './AppText.jsx';

let uidCounter = 0;

const GLASS = {
  light: {
    fillTop: 0.16,
    fillBottom: 0.3,
    tint: 0.07,
    glow: 0.4,
    rim: [0.95, 0.3, 0.25, 0.9],
    topLine: 0.7,
    spec: 0.35,
  },
  dark: {
    fillTop: 0.025,
    fillBottom: 0.055,
    tint: 0,
    glow: 0.05,
    rim: [0.32, 0.04, 0.03, 0.2],
    topLine: 0.14,
    spec: 0.07,
  },
};

/**
 * AppWelcomeBadge - Signature Glassmorphic Capsule Tag
 * Matches exact OneRx Figma design
 */
export const AppWelcomeBadge = ({
  text = 'WELCOME TO ONERETAIL',
  children,
  width,
  height,
  borderRadius,
  style,
  textStyle,
  rightIcon,
  onPress,
}) => {
  const { colors, isDark } = useTheme();
  const g = isDark ? GLASS.dark : GLASS.light;
  const uid = useRef(`wb${++uidCounter}`).current;

  const h = height ?? verticalScale(36);
  const [size, setSize] = useState({ w: width ?? 0, h });

  const onLayout = useCallback((e) => {
    const { width: lw, height: lh } = e.nativeEvent.layout;
    setSize((p) =>
      Math.abs(p.w - lw) > 0.5 || Math.abs(p.h - lh) > 0.5
        ? { w: lw, h: lh }
        : p
    );
  }, []);

  const w = size.w;
  const r = borderRadius ?? h / 2;

  const WrapperComponent = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress
    ? {
        activeOpacity: 0.7,
        onPress,
        accessible: true,
        accessibilityRole: 'button',
      }
    : {};

  const id = (n) => `${uid}-${n}`;

  return (
    <WrapperComponent
      {...wrapperProps}
      onLayout={onLayout}
      style={[
        styles.wrap,
        style,
        width != null && { width },
        { height: h, borderRadius: r },
      ]}
    >
      {w > 0 && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={w} height={h}>
            <Defs>
              <LinearGradient id={id('fill')} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={g.fillTop} />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity={g.fillBottom} />
              </LinearGradient>

              <LinearGradient id={id('tint')} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#009BA9" stopOpacity={g.tint} />
                <Stop offset="0.5" stopColor="#009BA9" stopOpacity={0} />
              </LinearGradient>

              <LinearGradient id={id('glow')} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0} />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity={g.glow} />
              </LinearGradient>

              <LinearGradient id={id('rim')} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2={h}>
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={g.rim[0]} />
                <Stop offset="0.3" stopColor="#FFFFFF" stopOpacity={g.rim[1]} />
                <Stop offset="0.7" stopColor="#FFFFFF" stopOpacity={g.rim[2]} />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity={g.rim[3]} />
              </LinearGradient>

              <LinearGradient id={id('lineTop')} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
                <Stop offset="0.3" stopColor="#FFFFFF" stopOpacity={g.topLine} />
                <Stop offset="0.7" stopColor="#FFFFFF" stopOpacity={g.topLine * 0.5} />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
              </LinearGradient>

              <RadialGradient id={id('specTL')} cx="0.07" cy="0.15" r="0.14">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={g.spec} />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
              </RadialGradient>
              <RadialGradient id={id('specBR')} cx="0.94" cy="0.85" r="0.12">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={g.spec * 0.8} />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
              </RadialGradient>
            </Defs>

            <Rect width={w} height={h} rx={r} ry={r} fill={`url(#${id('fill')})`} />
            {g.tint > 0 && (
              <Rect width={w} height={h} rx={r} ry={r} fill={`url(#${id('tint')})`} />
            )}
            <Rect width={w} height={h} rx={r} ry={r} fill={`url(#${id('glow')})`} />
            <Rect width={w} height={h} rx={r} ry={r} fill={`url(#${id('specTL')})`} />
            <Rect width={w} height={h} rx={r} ry={r} fill={`url(#${id('specBR')})`} />

            <Rect
              x={r * 0.8}
              y={1.5}
              width={Math.max(w - r * 1.6, 0)}
              height={0.5}
              fill={`url(#${id('lineTop')})`}
            />

            <Rect
              x={0.25}
              y={0.25}
              width={w - 0.5}
              height={h - 0.5}
              rx={Math.max(r - 0.25, 0)}
              ry={Math.max(r - 0.25, 0)}
              stroke={`url(#${id('rim')})`}
              strokeWidth={0.5}
              fill="none"
            />
          </Svg>
        </View>
      )}

      <View style={styles.content}>
        {children ? (
          children
        ) : (
          <View style={styles.innerRow}>
            <AppText
              variant="monoSmall"
              style={[
                styles.text,
                {
                  color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                  fontWeight: '500',
                  fontSize: scaleFont(12),
                },
                textStyle,
              ]}
            >
              {text}
            </AppText>
            {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
          </View>
        )}
      </View>
    </WrapperComponent>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    marginBottom: verticalScale(16),
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { marginLeft: scale(8) },
  text: {
    letterSpacing: -0.2,
    textAlign: 'center',
  },
});

export default AppWelcomeBadge;
