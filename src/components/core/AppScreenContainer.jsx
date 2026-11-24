import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Circle, Stop, Pattern } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { verticalScale } from '../../theme/responsive.js';

/**
 * AppScreenContainer - OneRetail Standard Screen Wrapper
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.scrollable=false]
 * @param {boolean} [props.withAmbientGlow=true]
 * @param {boolean} [props.withHorizontalPadding=true]
 * @param {boolean} [props.withBottomNavClearance=false]
 * @param {boolean} [props.keyboardAvoiding=false]
 * @param {number} [props.keyboardVerticalOffset=0]
 * @param {Object} [props.style]
 * @param {Object} [props.contentContainerStyle]
 */
export const AppScreenContainer = ({
  children,
  scrollable = false,
  withAmbientGlow = true,
  withHorizontalPadding = true,
  withBottomNavClearance = false,
  keyboardAvoiding = false,
  keyboardVerticalOffset = 0,
  style,
  contentContainerStyle,
}) => {
  const { colors, isDark, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const containerPadding = withHorizontalPadding ? spacing?.screenHorizontal || 20 : 0;
  const currentBgColor = colors?.background?.primary || (isDark ? '#020202' : '#ffffff');
  const topInset = insets?.top ?? 0;
  const bottomInset = insets?.bottom ?? 0;

  // Calibrated clearances according to OneRx floating bar geometry (height 64 at bottom 8 + insets.bottom):
  // 1. Screens WITH FloatingBottomBar (main tabs): leaves exact verticalScale(12) clean gap above the floating bar
  const bottomNavClearance = bottomInset + verticalScale(84);
  // 2. Screens WITHOUT FloatingBottomBar (stack screens): reaches cleanly down to safe area
  const standardBottomClearance = Math.max(bottomInset, verticalScale(16)) + verticalScale(12);

  const flattenedContent = StyleSheet.flatten(contentContainerStyle) || {};
  let resolvedPaddingBottom;
  if (flattenedContent.paddingBottom === 0) {
    // Explicit opt-out: inner scroll container (e.g. FlatList) handles bottom clearance ONCE
    resolvedPaddingBottom = 0;
  } else if (withBottomNavClearance) {
    resolvedPaddingBottom = bottomNavClearance;
  } else if (typeof flattenedContent.paddingBottom === 'number') {
    resolvedPaddingBottom = Math.max(flattenedContent.paddingBottom, standardBottomClearance);
  } else {
    resolvedPaddingBottom = standardBottomClearance;
  }

  const content = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingHorizontal: containerPadding,
          paddingTop: topInset,
        },
        contentContainerStyle,
        {
          paddingBottom: resolvedPaddingBottom,
        },
      ]}
      style={styles.contentLayer}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.contentLayer,
        {
          paddingHorizontal: containerPadding,
          paddingTop: topInset,
        },
        contentContainerStyle,
        {
          paddingBottom: resolvedPaddingBottom,
        },
      ]}
    >
      {children}
    </View>
  );

  // Exact OneRx visual identity: tinted wash only lives in the TOP ~40% of the screen.
  // Beyond that it settles into flat solid base color (pure black in dark mode, pure white in light mode).
  const baseColors = isDark
    ? ['#232C38', '#141A21', '#020202', '#020202']
    : ['#D9F1F1', '#EAF6F5', '#ffffff', '#ffffff'];

  const baseLocations = [0, 0.30, 0.72, 1];

  return (
    <LinearGradient
      colors={withAmbientGlow ? baseColors : [currentBgColor, currentBgColor]}
      locations={withAmbientGlow ? baseLocations : undefined}
      style={[styles.root, style]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* 1. Ambient accent layer: confined to the top portion of the screen */}
      {withAmbientGlow && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              {isDark && (
                <Pattern id="noise" width="4" height="4" patternUnits="userSpaceOnUse">
                  <Circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.03)" />
                </Pattern>
              )}

              {/* Top-right purple/violet accent */}
              <RadialGradient id="topRightAccent" cx="1" cy="0" r="0.55">
                <Stop offset="0%" stopColor={isDark ? '#7A5A9A' : '#C9B8E8'} stopOpacity={isDark ? 0.22 : 0.35} />
                <Stop offset="100%" stopColor={isDark ? '#141A21' : '#ffffff'} stopOpacity={0} />
              </RadialGradient>

              {/* Top-left cyan wash: dominant OneRetail tone */}
              <RadialGradient id="topWash" cx="0.15" cy="0.05" r="0.65">
                <Stop offset="0%" stopColor="#009BA9" stopOpacity={isDark ? 0.14 : 0.3} />
                <Stop offset="100%" stopColor={isDark ? '#141A21' : '#ffffff'} stopOpacity={0} />
              </RadialGradient>
            </Defs>

            {/* Constrain ambient mesh to top portion */}
            <Rect x="0" y="0" width="100%" height="42%" fill={currentBgColor} opacity={0} />
            {isDark && <Rect x="0" y="0" width="100%" height="53%" fill="url(#noise)" />}
            <Rect x="0" y="0" width="100%" height="63%" fill="url(#topWash)" />
            <Rect x="0" y="0" width="100%" height="58%" fill="url(#topRightAccent)" />
          </Svg>
        </View>
      )}

      {/* 2. Foreground Content Layer */}
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardVerticalOffset : 0}
          style={styles.keyboardContainer}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    zIndex: 1,
  },
  contentLayer: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default AppScreenContainer;
