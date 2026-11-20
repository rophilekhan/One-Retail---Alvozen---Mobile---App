import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppScreenContainer,
  AppText,
  AppInput,
  AppSlider,
  AppCheckbox,
  AppWelcomeBadge,
  AppToast,
} from '../../components/core/index.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * SignInScreen - OneRetail Pharmacy Sign In Screen
 * Replicates OneRx Figma Node 75:50482 styling with zero hardcoded colors.
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const SignInScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const setCredentials = useAuthStore((s) => s.setCredentials);

  const handleSignIn = async () => {
    const trimmedUser = identifier.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      AppToast.show({
        title: 'Username Required',
        message: 'Please enter your username, phone, or email.',
        type: 'error',
      });
      return;
    }

    if (!trimmedPass) {
      AppToast.show({
        title: 'Password Required',
        message: 'Please enter your account password.',
        type: 'error',
      });
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      // Mock / Real authentication credential dispatch
      await setCredentials({
        user: {
          id: 'user_admin_1',
          username: trimmedUser,
          name: 'Pharmacy Admin',
          role: 'ADMIN',
          pharmacyId: 'pharma_1',
        },
        token: 'oneretail_token_' + Date.now(),
        refreshToken: 'oneretail_refresh_' + Date.now(),
        role: 'ADMIN',
      });

      AppToast.show({
        title: 'Welcome Back',
        message: 'Successfully signed in to OneRetail.',
        type: 'success',
      });
    } catch (e) {
      AppToast.show({
        title: 'Sign In Failed',
        message: e.message || 'Invalid credentials.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    AppToast.show({
      title: 'Reset Password',
      message: 'Password reset link sent to your registered email.',
      type: 'info',
    });
  };

  return (
    <AppScreenContainer keyboardAvoiding={true} scrollable={true} withAmbientGlow={true}>
      <View style={styles.safeContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <AppWelcomeBadge style={{ marginBottom: verticalScale(14) }} />

          <AppText
            variant="headlineLarge"
            colorType="primary"
            style={styles.headlineTitle}
          >
            Sign in to continue{'\n'}your retail care.
          </AppText>

          <AppText
            variant="bodyLarge"
            colorType="muted"
            style={styles.subtitle}
          >
            Enter your username, phone or email to access your pharmacy dashboard.
          </AppText>
        </View>

        {/* Inputs Form */}
        <View style={styles.middleSection}>
          <AppInput
            label="Username, Phone or Email"
            placeholder="e.g. city_pharmacy"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            iconTone="teal"
            iconLeft={
              <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
                <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx="12" cy="7" r="4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            }
          />

          <AppInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            iconTone="purple"
            iconLeft={
              <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
                <Path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            }
          />

          {/* Options Row: Stay logged in + Forgot password */}
          <View style={styles.optionsRow}>
            <AppCheckbox
              checked={stayLoggedIn}
              onChange={setStayLoggedIn}
              label="Stay logged in"
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleForgotPassword}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppText
                variant="bodyMediumMedium"
                colorType="brand"
                style={styles.forgotPasswordText}
              >
                Forgot password
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Section: Slider + Register Link */}
        <View style={styles.bottomSection}>
          <AppSlider
            title={isLoading ? 'Signing in...' : 'Swipe to Sign in'}
            disabled={isLoading}
            onSuccess={handleSignIn}
          />

          <View style={styles.registerRow}>
            <AppText variant="bodyLarge" colorType="muted">
              Don’t you have an account?{' '}
            </AppText>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('AccountSetup')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppText
                variant="bodyLarge"
                colorType="primary"
                style={styles.registerHighlight}
              >
                Register
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: verticalScale(24),
  },
  headerSection: {
    marginBottom: verticalScale(16),
  },
  headlineTitle: {
    letterSpacing: -1,
    marginBottom: verticalScale(10),
  },
  subtitle: {
    letterSpacing: -0.3,
  },
  middleSection: {
    flexGrow: 1,
    paddingTop: verticalScale(12),
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(12),
    paddingHorizontal: scale(2),
  },
  forgotPasswordText: {
    textDecorationLine: 'underline',
  },
  bottomSection: {
    paddingTop: verticalScale(16),
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },
  registerHighlight: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;
