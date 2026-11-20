import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Image } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { AppText } from '../../components/core/index.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * SplashScreen - Initial Application Entry Screen
 * Displays Alvozen OneRetail branding, hydrates encrypted session,
 * and seamlessly routes to MainTabs or Welcome.
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const SplashScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    let isMounted = true;

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
        console.warn('[SplashScreen] Hydration warning:', err.message);
        targetScreen = 'Welcome';
      } finally {
        setTimeout(() => {
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
    };
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background?.primary || (isDark ? '#020202' : '#ffffff') }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Center Brand Emblem */}
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
          variant="headlineMedium"
          colorType="brand"
          style={styles.brandSubtitle}
        >
          OneRetail
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppText
          variant="monoSmall"
          colorType="muted"
          style={styles.footerText}
        >
          ALVOZEN • PHARMACY PLATFORM
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
    width: scale(190),
    height: scale(84),
    resizeMode: 'contain',
  },
  brandSubtitle: {
    marginTop: verticalScale(6),
    letterSpacing: -0.5,
  },
  footer: {
    position: 'absolute',
    bottom: verticalScale(36),
    alignSelf: 'center',
  },
  footerText: {
    letterSpacing: 1.2,
  },
});

export default SplashScreen;
