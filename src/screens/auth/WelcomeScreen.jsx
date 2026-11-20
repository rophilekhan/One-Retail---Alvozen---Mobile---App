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
import { fontFamilies, useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { AppText, AppWelcomeBadge } from '../../components/core/index.js';
import { WelcomeCenterGraphic } from '../../assets/vectors/index.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * WelcomeScreen - 1:1 Port from OneRx WelcomeScreen
 * Updated text copy: OneRetail by Alvozen
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const WelcomeScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const state = useAuthStore.getState();
    if (state.isAuthenticated && state.token) {
      if (navigation?.replace) {
        navigation.replace('MainTabs');
      } else if (navigation?.navigate) {
        navigation.navigate('MainTabs');
      }
    }
  }, [navigation]);

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
    outputRange: ['-10deg', '350deg'],
  });

  const handleNavigateToLogin = () => {
    navigation.navigate('SignIn');
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('AccountSetup');
  };

  const baseBg = colors.background?.primary || (isDark ? '#020202' : '#FFFFFF');

  return (
    <View style={[styles.root, { backgroundColor: baseBg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* AMBIENT GLOW WASH */}
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
              <Stop stopColor={isDark ? '#8A5AA8' : '#A28DDC'} stopOpacity={isDark ? 0.40 : 0.42} />
              <Stop offset="30%" stopColor={isDark ? '#663680' : '#C0AEE4'} stopOpacity={isDark ? 0.24 : 0.26} />
              <Stop offset="100%" stopColor={baseBg} stopOpacity={0} />
            </RadialGradient>

            <RadialGradient
              id="upperBlueGlow"
              cx="8%"
              cy="24%"
              rx="58%"
              ry="34%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#009BA9" stopOpacity={isDark ? 0.16 : 0.22} />
              <Stop offset="42%" stopColor={isDark ? '#3D7488' : '#BCE3EB'} stopOpacity={isDark ? 0.08 : 0.12} />
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
              <Stop stopColor="#009BA9" stopOpacity={isDark ? 0.28 : 0.42} />
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
        {/* Top Section: Central Graphic & Floating Badges */}
        <View style={styles.graphicSection}>
          <View style={styles.iconAuraWrap} pointerEvents="none">
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.fanOrbit,
                { transform: [{ rotate: fanRotate }] },
              ]}
            >
              {/* Purple blob */}
              <View style={[styles.colorBlobWrap, styles.colorBlobPurple]}>
                <Svg width={scale(520)} height={scale(520)} viewBox="0 0 520 520">
                  <Defs>
                    <RadialGradient id="blobPurple" cx="260" cy="260" r="260" gradientUnits="userSpaceOnUse">
                      <Stop offset="0%" stopColor={isDark ? '#8A5AA8' : '#B39DDB'} stopOpacity={isDark ? 0.34 : 0.34} />
                      <Stop offset="40%" stopColor={isDark ? '#6B4A8F' : '#C7B8E8'} stopOpacity={isDark ? 0.20 : 0.20} />
                      <Stop offset="100%" stopColor={baseBg} stopOpacity={0} />
                    </RadialGradient>
                  </Defs>
                  <Ellipse cx="260" cy="260" rx="260" ry="260" fill="url(#blobPurple)" />
                </Svg>
              </View>

              {/* Teal blob */}
              <View style={[styles.colorBlobWrap, styles.colorBlobTeal]}>
                <Svg width={scale(520)} height={scale(520)} viewBox="0 0 520 520">
                  <Defs>
                    <RadialGradient id="blobTeal" cx="260" cy="260" r="260" gradientUnits="userSpaceOnUse">
                      <Stop offset="0%" stopColor="#009BA9" stopOpacity={isDark ? 0.22 : 0.24} />
                      <Stop offset="40%" stopColor={isDark ? '#2E7484' : '#7FD1DC'} stopOpacity={isDark ? 0.12 : 0.14} />
                      <Stop offset="100%" stopColor={baseBg} stopOpacity={0} />
                    </RadialGradient>
                  </Defs>
                  <Ellipse cx="260" cy="260" rx="260" ry="260" fill="url(#blobTeal)" />
                </Svg>
              </View>
            </Animated.View>
          </View>

          <WelcomeCenterGraphic
            width={scale(360)}
            height={verticalScale(210)}
            style={{ marginTop: verticalScale(35) }}
          />
        </View>

        {/* Middle Content Section */}
        <View style={styles.contentSection}>
          <AppWelcomeBadge text="WELCOME TO ONERETAIL BY ALVOZEN" />

          {/* Headline Title */}
          <View style={styles.headlineTitle}>
            <AppText
              style={{
                fontFamily: fontFamilies.primaryMedium,
                fontSize: scaleFont(48),
                lineHeight: scaleFont(54),
                letterSpacing: -2,
                color: colors.text?.primary,
              }}
            >
              Direct Connect,
            </AppText>
            <AppText
              style={{
                fontFamily: fontFamilies.primaryLight,
                fontSize: scaleFont(48),
                lineHeight: scaleFont(54),
                letterSpacing: -2,
                color: colors.text?.primary,
              }}
            >
              Precision Retail
            </AppText>
          </View>

          {/* Description */}
          <AppText
            variant="titleMedium"
            style={[
              styles.descriptionText,
              {
                fontFamily: 'DMSans-Regular',
                color: '#787878',
                fontSize: scaleFont(16),
                lineHeight: scaleFont(22),
                letterSpacing: -0.2,
              },
            ]}
          >
            Your pharmacy, digital prescriptions, and trade schemes in one simple place.
          </AppText>
        </View>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNavigateToLogin}
            style={styles.signInPromptContainer}
            accessibilityRole="button"
            accessibilityLabel="Already have an account? Sign In"
          >
            <AppText
              style={[
                styles.alreadyHaveText,
                {
                  fontFamily: 'DMSans-Regular',
                  color: isDark ? '#9CA3AF' : '#787878',
                  fontSize: scaleFont(16),
                  lineHeight: scaleFont(22),
                },
              ]}
            >
              Already have an
            </AppText>
            <View style={styles.signInRow}>
              <AppText
                style={[
                  styles.alreadyHaveText,
                  {
                    fontFamily: 'DMSans-Regular',
                    color: isDark ? '#9CA3AF' : '#787878',
                    fontSize: scaleFont(16),
                    lineHeight: scaleFont(22),
                  },
                ]}
              >
                account?{' '}
              </AppText>
              <AppText
                style={[
                  styles.signInHighlight,
                  {
                    color: colors.brand?.primary || '#009BA9',
                    fontFamily: 'DMSans-Medium',
                    fontSize: scaleFont(16),
                    lineHeight: scaleFont(22),
                    textDecorationLine: 'underline',
                  },
                ]}
              >
                Sign In
              </AppText>
            </View>
          </TouchableOpacity>

          {/* Circular CTA Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNavigateToRegister}
            style={[
              styles.ctaCircleBtn,
              {
                backgroundColor: colors.brand?.primary || '#009BA9',
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)',
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Get Started with OneRetail"
          >
            <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="#FFFFFF"
                strokeWidth="2.4"
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
  },
  graphicSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAuraWrap: {
    position: 'absolute',
    width: scale(360),
    height: verticalScale(260),
    alignItems: 'center',
    justifyContent: 'center',
  },
  fanOrbit: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorBlobWrap: {
    position: 'absolute',
  },
  colorBlobPurple: {
    top: -scale(100),
    left: -scale(70),
  },
  colorBlobTeal: {
    bottom: -scale(100),
    right: -scale(70),
  },
  contentSection: {
    paddingHorizontal: scale(4),
  },
  headlineTitle: {
    marginBottom: verticalScale(12),
  },
  descriptionText: {
    marginTop: verticalScale(4),
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: verticalScale(10),
  },
  signInPromptContainer: {
    justifyContent: 'center',
  },
  alreadyHaveText: {},
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInHighlight: {},
  ctaCircleBtn: {
    width: scale(58),
    height: scale(58),
    borderRadius: scale(29),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#009BA9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
});

export default WelcomeScreen;
