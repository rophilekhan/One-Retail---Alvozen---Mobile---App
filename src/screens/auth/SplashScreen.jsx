import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Animated,
  Easing,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
} from 'react-native-svg';
import { useTheme, fontFamilies } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { AppText, GlassSurface } from '../../components/core/index.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';

const LOGO_WHITE = require('../../assets/images/Alvozen - White.png');
const LOGO_COLORED = require('../../assets/images/Alvozen - Colored.png');
const SPLASH_DURATION_MS = 1800;

/**
 * SplashScreen - OneRetail Glassmorphic Brand Entry
 * Replicates OneRx's layered atmospheric SVG glows, centered glass emblem lockup,
 * theme-aware Light/Dark styling (strictly via useTheme), and encrypted hydration handoff.
 */
export const SplashScreen = ({ navigation, autoNavigate = true }) => {
  const { colors, radii, spacing, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const translateYAnim = useRef(new Animated.Value(18)).current;
  const dotAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const entranceAnimRef = useRef(null);
  const pulseAnimRef = useRef(null);

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 48,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    entranceAnimRef.current = entrance;
    entrance.start();

    const dotPulses = dotAnims.map((anim) =>
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 380,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 380,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(240),
      ])
    );

    const pulseLoop = Animated.loop(Animated.stagger(160, dotPulses));
    pulseAnimRef.current = pulseLoop;
    pulseLoop.start();

    return () => {
      entranceAnimRef.current?.stop?.();
      pulseAnimRef.current?.stop?.();
    };
  }, [fadeAnim, scaleAnim, translateYAnim, dotAnims]);

  useEffect(() => {
    if (!autoNavigate) return undefined;

    let isMounted = true;
    let timerId = null;

    const initializeSession = async () => {
      let targetScreen = 'Welcome';

      try {
        await useAuthStore.getState().hydrate();
        const authState = useAuthStore.getState();
        const pharmacyState = usePharmacyStore.getState();

        if (authState.isAuthenticated && authState.token) {
          targetScreen =
            pharmacyState.isOnboarded === false ? 'PharmacyLicenses' : 'MainTabs';
        } else {
          targetScreen = 'Welcome';
        }
      } catch (err) {
        console.warn('[SplashScreen] Hydration error:', err.message);
        targetScreen = 'Welcome';
      } finally {
        timerId = setTimeout(() => {
          if (!isMounted) return;
          const routeNames = navigation?.getState?.()?.routeNames;
          if (Array.isArray(routeNames) && !routeNames.includes(targetScreen)) {
            return;
          }
          if (navigation?.replace) {
            navigation.replace(targetScreen);
          } else if (navigation?.navigate) {
            navigation.navigate(targetScreen);
          }
        }, SPLASH_DURATION_MS);
      }
    };

    initializeSession();

    return () => {
      isMounted = false;
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [autoNavigate, navigation]);

  const footerBottom =
    Math.max(insets.bottom, verticalScale(16)) + verticalScale(24);
  const logoSource = isDark ? LOGO_WHITE : LOGO_COLORED;

  return (
    <View
      testID="splash-screen-root"
      style={[styles.container, { backgroundColor: colors.background.canvas }]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      {/* Ambient OneRx/OneRetail Layered Radial Glow Backdrop */}
      <Svg
        width={width}
        height={height}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="splashVeil" x1="0" y1="0" x2="0" y2="1">
            <Stop
              offset="0"
              stopColor={colors.background.ambientGradient}
              stopOpacity={isDark ? 0.6 : 0.85}
            />
            <Stop
              offset="0.55"
              stopColor={colors.background.canvas}
              stopOpacity={0}
            />
          </LinearGradient>

          <RadialGradient id="splashTopRightGlow" cx="50%" cy="50%" r="50%">
            <Stop
              offset="0"
              stopColor={colors.brand.primary}
              stopOpacity={isDark ? 0.26 : 0.16}
            />
            <Stop
              offset="0.55"
              stopColor={colors.pastel.teal}
              stopOpacity={isDark ? 0.1 : 0.2}
            />
            <Stop
              offset="1"
              stopColor={colors.background.canvas}
              stopOpacity={0}
            />
          </RadialGradient>

          <RadialGradient id="splashBottomLeftGlow" cx="50%" cy="50%" r="50%">
            <Stop
              offset="0"
              stopColor={isDark ? colors.brand.primaryDark : colors.pastel.purple}
              stopOpacity={isDark ? 0.35 : 0.42}
            />
            <Stop
              offset="0.6"
              stopColor={colors.brand.primary}
              stopOpacity={isDark ? 0.08 : 0.06}
            />
            <Stop
              offset="1"
              stopColor={colors.background.canvas}
              stopOpacity={0}
            />
          </RadialGradient>

          <RadialGradient id="splashCenterHalo" cx="50%" cy="50%" r="50%">
            <Stop
              offset="0"
              stopColor={colors.brand.primary}
              stopOpacity={isDark ? 0.24 : 0.14}
            />
            <Stop
              offset="0.6"
              stopColor={colors.pastel.teal}
              stopOpacity={isDark ? 0.06 : 0.12}
            />
            <Stop
              offset="1"
              stopColor={colors.background.canvas}
              stopOpacity={0}
            />
          </RadialGradient>
        </Defs>

        <Rect width={width} height={height} fill="url(#splashVeil)" />
        <Circle
          cx={width * 0.86}
          cy={height * 0.14}
          r={width * 0.65}
          fill="url(#splashTopRightGlow)"
        />
        <Circle
          cx={width * 0.14}
          cy={height * 0.86}
          r={width * 0.7}
          fill="url(#splashBottomLeftGlow)"
        />
        <Circle
          cx={width * 0.5}
          cy={height * 0.44}
          r={scale(130)}
          fill="url(#splashCenterHalo)"
        />
      </Svg>

      {/* Center Animated Brand Lockup */}
      <Animated.View
        style={[
          styles.heroWrap,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.haloRing,
            {
              borderColor: colors.border.card,
              backgroundColor: colors.glass.secondary,
            },
          ]}
        >
          <GlassSurface
            width={scale(108)}
            height={scale(108)}
            borderRadius={radii.hero || scale(28)}
            blurAmount={16}
          >
            <View
              style={[
                styles.emblemInner,
                {
                  borderRadius: radii.hero || scale(28),
                  backgroundColor: colors.glass.primary,
                },
              ]}
            >
              <Image
                source={logoSource}
                style={styles.logoImage}
                resizeMode="contain"
                accessibilityLabel="OneRetail Alvozen Logo"
              />
            </View>
          </GlassSurface>
        </View>

        <View style={styles.wordmarkRow}>
          <AppText style={[styles.wordmarkPrimary, { color: colors.text.primary }]}>
            One
          </AppText>
          <AppText style={[styles.wordmarkAccent, { color: colors.brand.primary }]}>
            Retail
          </AppText>
        </View>

        <AppText
          align="center"
          style={[styles.subtitle, { color: colors.text.secondary }]}
        >
          Smart Pharmacy &amp; Retail Ecosystem
        </AppText>

        <View
          style={[
            styles.networkPill,
            {
              backgroundColor: colors.glass.secondary,
              borderColor: colors.border.subtle,
              borderRadius: radii.pill,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <View
            style={[
              styles.pillDot,
              { backgroundColor: colors.brand.primary },
            ]}
          />
          <AppText style={[styles.networkText, { color: colors.brand.primary }]}>
            ALVOZEN • CLINICAL RETAIL
          </AppText>
        </View>
      </Animated.View>

      {/* Bottom Animated Loading Indicator + Powered By Caption */}
      <View style={[styles.footerWrap, { bottom: footerBottom }]}>
        <View style={styles.dotsRow}>
          {dotAnims.map((anim, index) => {
            const dotScale = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1.25],
            });
            const dotOpacity = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            });
            return (
              <Animated.View
                key={`splash-dot-${index}`}
                style={[
                  styles.loadingDot,
                  {
                    backgroundColor: colors.brand.primary,
                    opacity: dotOpacity,
                    transform: [{ scale: dotScale }],
                  },
                ]}
              />
            );
          })}
        </View>

        <AppText
          align="center"
          style={[styles.poweredBy, { color: colors.text.tertiary }]}
        >
          Powered by Alvozen
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(24),
  },
  haloRing: {
    width: scale(132),
    height: scale(132),
    borderRadius: scale(36),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: scale(70),
    height: scale(70),
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: verticalScale(24),
  },
  wordmarkPrimary: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(36),
    lineHeight: scaleFont(42),
    letterSpacing: -0.8,
  },
  wordmarkAccent: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(36),
    lineHeight: scaleFont(42),
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: verticalScale(6),
    fontFamily: fontFamilies.primaryRegular,
    fontSize: scaleFont(14),
    lineHeight: scaleFont(20),
    letterSpacing: 0.2,
  },
  networkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginTop: verticalScale(16),
    paddingVertical: verticalScale(6),
    borderWidth: 1,
  },
  pillDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  networkText: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: scaleFont(10),
    lineHeight: scaleFont(14),
    letterSpacing: 1.3,
  },
  footerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  loadingDot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(3.5),
  },
  poweredBy: {
    marginTop: verticalScale(12),
    fontFamily: fontFamilies.primaryRegular,
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    letterSpacing: 0.3,
  },
});

export default SplashScreen;
