import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Image } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { AppText } from '../../components/core/index.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * SplashScreen - Initial App Entry Screen
 * Exact 1:1 port from OneRx SplashScreen with OneRetail by Alvozen branding.
 *
 * @param {Object} props
 * @param {Object} props.navigation - React Navigation prop
 */
export const SplashScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    let isMounted = true;
    let timerId = null;

    const initializeSession = async () => {
      let targetScreen = 'Welcome';

      try {
        await useAuthStore.getState().hydrate();
        const state = useAuthStore.getState();

        if (state.isAuthenticated && state.token) {
          targetScreen = 'MainTabs';
        } else {
          targetScreen = 'Welcome';
        }
      } catch (err) {
        console.warn('[SplashScreen] Hydration error:', err.message);
        targetScreen = 'Welcome';
      } finally {
        timerId = setTimeout(() => {
          if (!isMounted) return;
          if (navigation?.replace) {
            navigation.replace(targetScreen);
          } else if (navigation?.navigate) {
            navigation.navigate(targetScreen);
          }
        }, 1500);
      }
    };

    initializeSession();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface?.background || colors.background?.primary }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Center Logo */}
      <View style={styles.emblemWrapper}>
        <Image
          source={
            isDark
              ? require('../../assets/images/Alvozen - White.png')
              : require('../../assets/images/Alvozen - Colored.png')
          }
          style={styles.logo}
        />
        <AppText
          variant="headlineLarge"
          style={[
            styles.brandTitle,
            { color: colors.text?.primary },
          ]}
        >
          One<AppText variant="headlineLarge" style={{ color: colors.brand?.primary || '#009BA9' }}>Retail</AppText>
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppText
          variant="monoSmall"
          style={[styles.footerText, { color: colors.text?.secondary || '#787878' }]}
        >
          ONERETAIL • BY ALVOZEN
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
  emblemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: scale(180),
    height: scale(70),
    resizeMode: 'contain',
    marginBottom: verticalScale(10),
  },
  brandTitle: {
    fontSize: scaleFont(32),
    lineHeight: scaleFont(38),
    fontFamily: 'DMSans-Medium',
    letterSpacing: -0.8,
  },
  footer: {
    position: 'absolute',
    bottom: verticalScale(36),
    alignSelf: 'center',
  },
  footerText: {
    fontSize: scaleFont(11),
    letterSpacing: 1.4,
  },
});

export default SplashScreen;
