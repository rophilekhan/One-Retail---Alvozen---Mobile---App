import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  RadialGradient,
  Ellipse,
  Rect,
  Stop,
  Pattern,
  Circle,
  Path,
} from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { AppText, AppWelcomeBadge } from '../../components/core/index.js';

/**
 * WelcomeScreen - OneRetail Onboarding Showcase
 * Grounded in exact OneRx visual identity with rotating aura and glassmorphic badge.
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const WelcomeScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const fanRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(fanRotation, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [fanRotation]);

  const fanRotate = fanRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const baseBg = colors.background?.primary || (isDark ? '#020202' : '#ffffff');
  const arcStrokeColor = colors.text?.primary || (isDark ? '#FFFFFF' : '#020202');

  return (
    <View style={[styles.root, { backgroundColor: baseBg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* 1. Ambient Background Lighting */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            {isDark && (
              <Pattern id="welcomeNoise" width="4" height="4" patternUnits="userSpaceOnUse">
                <Circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.04)" />
              </Pattern>
            )}

            <RadialGradient
              id="upperPurpleGlow"
              cx="55%"
              cy="18%"
              rx="62%"
              ry="36%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor={isDark ? '#8A5AA8' : '#A28DDC'} stopOpacity={isDark ? 0.38 : 0.40} />
              <Stop offset="30%" stopColor={isDark ? '#663680' : '#C0AEE4'} stopOpacity={isDark ? 0.22 : 0.24} />
              <Stop offset="100%" stopColor={baseBg} stopOpacity={0} />
            </RadialGradient>

            <RadialGradient
              id="upperBlueGlow"
              cx="10%"
              cy="24%"
              rx="58%"
              ry="34%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#009BA9" stopOpacity={isDark ? 0.18 : 0.24} />
              <Stop offset="100%" stopColor={baseBg} stopOpacity={0} />
            </RadialGradient>

            <RadialGradient
              id="bottomCyanGlow"
              cx="88%"
              cy="88%"
              rx="58%"
              ry="32%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#009BA9" stopOpacity={isDark ? 0.26 : 0.40} />
              <Stop offset="100%" stopColor={baseBg} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          <Rect width="100%" height="100%" fill="url(#upperPurpleGlow)" />
          <Rect width="100%" height="100%" fill="url(#upperBlueGlow)" />
          <Rect width="100%" height="100%" fill="url(#bottomCyanGlow)" />
          {isDark && <Rect width="100%" height="100%" fill="url(#welcomeNoise)" />}
        </Svg>
      </View>

      <View
        style={[
          styles.safeContainer,
          {
            paddingTop: Math.max(insets.top, verticalScale(20)),
            paddingBottom: Math.max(insets.bottom, verticalScale(16)) + verticalScale(16),
          },
        ]}
      >
        {/* Top Graphic Section with Rotating Ambient Blobs */}
        <View style={styles.graphicSection}>
          <View style={styles.iconAuraWrap} pointerEvents="none">
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.fanOrbit,
                { transform: [{ rotate: fanRotate }] },
              ]}
            >
              <View style={[styles.colorBlobWrap, styles.colorBlobPurple]}>
                <Svg width={scale(520)} height={scale(520)} viewBox="0 0 520 520">
                  <Defs>
                    <RadialGradient id="blobPurple" cx="260" cy="260" r="260" gradientUnits="userSpaceOnUse">
                      <Stop offset="0%" stopColor={isDark ? '#8A5AA8' : '#B39DDB'} stopOpacity={isDark ? 0.34 : 0.32} />
                      <Stop offset="100%" stopColor={baseBg} stopOpacity={0} />
                    </RadialGradient>
                  </Defs>
                  <Ellipse cx="260" cy="260" rx="260" ry="260" fill="url(#blobPurple)" />
                </Svg>
              </View>

              <View style={[styles.colorBlobWrap, styles.colorBlobTeal]}>
                <Svg width={scale(520)} height={scale(520)} viewBox="0 0 520 520">
                  <Defs>
                    <RadialGradient id="blobTeal" cx="260" cy="260" r="260" gradientUnits="userSpaceOnUse">
                      <Stop offset="0%" stopColor="#009BA9" stopOpacity={isDark ? 0.22 : 0.25} />
                      <Stop offset="100%" stopColor={baseBg} stopOpacity={0} />
                    </RadialGradient>
                  </Defs>
                  <Ellipse cx="260" cy="260" rx="260" ry="260" fill="url(#blobTeal)" />
                </Svg>
              </View>

              <View style={[styles.colorBlobWrap, styles.colorBlobCyan]}>
                <Svg width={scale(520)} height={scale(520)} viewBox="0 0 520 520">
                  <Defs>
                    <RadialGradient id="blobCyan" cx="260" cy="260" r="260" gradientUnits="userSpaceOnUse">
                      <Stop offset="0%" stopColor="#4B829B" stopOpacity={isDark ? 0.18 : 0.20} />
                      <Stop offset="100%" stopColor={baseBg} stopOpacity={0} />
                    </RadialGradient>
                  </Defs>
                  <Ellipse cx="260" cy="260" rx="260" ry="260" fill="url(#blobCyan)" />
                </Svg>
              </View>
            </Animated.View>
          </View>

          {/* Central Stylized Pharmacy Symbol */}
          <Svg width={scale(160)} height={scale(160)} viewBox="0 0 100 100" fill="none">
            <Circle cx="50" cy="50" r="46" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="1.5" strokeOpacity="0.4" />
            <Circle cx="50" cy="50" r="38" fill={isDark ? 'rgba(0, 155, 169, 0.12)' : 'rgba(0, 155, 169, 0.08)'} />
            <Path
              d="M50 28v44M28 50h44"
              stroke={colors.brand?.primary || '#009BA9'}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        {/* Middle Content Section */}
        <View style={styles.contentSection}>
          <AppWelcomeBadge text="WELCOME TO ONERETAIL" />

          {/* Headline Title */}
          <View style={styles.headlineTitle}>
            <AppText
              variant="displayLarge"
              colorType="primary"
              style={styles.heroTextBold}
            >
              Smarter Retail,
            </AppText>
            <AppText
              variant="displayLarge"
              colorType="primary"
              style={styles.heroTextLight}
            >
              Better Rewards
            </AppText>
          </View>

          <AppText
            variant="titleMedium"
            colorType="muted"
            style={styles.descriptionText}
          >
            Your pharmacy, your stock, and every{'\n'}prescription in one simple place.
          </AppText>
        </View>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          {/* Left: Sign In Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SignIn')}
            style={styles.signInPromptContainer}
            accessibilityRole="button"
            accessibilityLabel="Already have an account? Sign In"
          >
            <AppText variant="titleMedium" colorType="muted">
              Already have an
            </AppText>
            <View style={styles.signInRow}>
              <AppText variant="titleMedium" colorType="muted">
                account?{' '}
              </AppText>
              <View style={styles.signInLinkWrap}>
                <AppText variant="titleMedium" colorType="primary" style={styles.signInText}>
                  Sign In
                </AppText>
                <View
                  style={[
                    styles.underlineBar,
                    { backgroundColor: arcStrokeColor },
                  ]}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Right Action: Circular Action Button with SVG Arrow */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AccountSetup')}
            style={styles.actionButtonTouchArea}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
          >
            <Svg width={scale(96)} height={scale(96)} viewBox="268 694 124 124" fill="none">
              <Path
                d="M278.551 759C278.551 728.624 303.175 704 333.551 704"
                stroke={arcStrokeColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <Path
                d="M285.551 759C285.551 732.49 307.041 711 333.551 711C360.06 711 381.551 732.49 381.551 759C381.551 785.51 360.06 807 333.551 807C307.041 807 285.551 785.51 285.551 759Z"
                fill="#FFFFFF"
              />
              <Path
                d="M345.218 759L320.218 759"
                stroke="#020202"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M338.551 750.667L346.177 758.293C346.51 758.626 346.677 758.793 346.677 759C346.677 759.207 346.51 759.374 346.177 759.707L338.551 767.333"
                stroke="#020202"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    zIndex: 1,
  },
  graphicSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(36),
    position: 'relative',
    height: verticalScale(180),
  },
  iconAuraWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fanOrbit: {
    position: 'absolute',
    width: scale(470),
    height: scale(470),
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorBlobWrap: {
    position: 'absolute',
    width: scale(520),
    height: scale(520),
  },
  colorBlobPurple: {
    transform: [{ rotate: '0deg' }, { translateY: -scale(88) }],
  },
  colorBlobTeal: {
    transform: [{ rotate: '130deg' }, { translateY: -scale(88) }],
  },
  colorBlobCyan: {
    transform: [{ rotate: '250deg' }, { translateY: -scale(88) }],
  },
  contentSection: {
    marginTop: verticalScale(10),
  },
  headlineTitle: {
    marginBottom: verticalScale(12),
  },
  heroTextBold: {
    fontSize: scaleFont(48),
    lineHeight: scaleFont(54),
    fontWeight: '700',
    letterSpacing: -2,
  },
  heroTextLight: {
    fontSize: scaleFont(48),
    lineHeight: scaleFont(54),
    fontWeight: '300',
    letterSpacing: -2,
  },
  descriptionText: {
    letterSpacing: -0.2,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: verticalScale(16),
  },
  signInPromptContainer: {
    maxWidth: '65%',
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInLinkWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  signInText: {
    fontWeight: '600',
  },
  underlineBar: {
    position: 'absolute',
    bottom: verticalScale(-2),
    left: 0,
    right: 0,
    height: 1.5,
    borderRadius: 1,
  },
  actionButtonTouchArea: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

export default WelcomeScreen;
