import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppText,
  AppSlider,
  AuthScreenContainer,
  AppWelcomeBadge,
  AppToast,
  AppCheckbox,
} from '../../components/core/index.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { PERMISSIONS } from '../../store/useStaffStore.js';
import {
  UserOutlineIcon,
  LockOutlineIcon,
  EyeOffIcon,
  EyeOpenIcon,
  CheckboxIcon,
} from '../../assets/vectors/index.js';

const PALETTE = {
  light: {
    title: '#000000',
    subtitle: '#777777',
    placeholder: '#B2B2B2',
    inputText: '#000000',
    icon: '#000000',
    capsuleBg: '#FFFFFF',
    capsuleBorder: 'rgba(255,255,255,0.9)',
    userBadge: ['#ecfcffff', '#FFFFFF'],
    lockBadge: ['#faf5ffff', '#FFFFFF'],
    checkboxBorder: '#AAAAAA',
    label: '#000000',
    forgot: '#009BA9',
    prompt: '#777777',
    link: '#020202',
  },
  dark: {
    title: '#FFFFFF',
    subtitle: '#ACACAE',
    placeholder: '#797979',
    inputText: '#FFFFFF',
    icon: '#FFFFFF',
    capsuleBg: 'rgba(255,255,255,0.05)',
    capsuleBorder: 'rgba(255,255,255,0.14)',
    userBadge: ['#315257ff', '#0000003d'],
    lockBadge: ['#3e3f49ff', '#0b1313ff'],
    checkboxBorder: '#797979',
    label: '#FFFFFF',
    forgot: '#009BA9',
    prompt: '#ACACAE',
    link: '#FFFFFF',
  },
};

const IconBadge = ({ id, colors: [top, bottom], children }) => (
  <View style={styles.iconBadge}>
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={top} stopOpacity={1} />
          <Stop offset="100%" stopColor={bottom} stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Circle cx={scale(20)} cy={scale(20)} r={scale(20)} fill={`url(#${id})`} />
      <Circle cx={scale(20)} cy={scale(20)} r={scale(20) - 0.5} stroke="rgba(255,255,255,0.06)" strokeWidth={1} fill="none" />
    </Svg>
    <View style={{ zIndex: 1 }}>{children}</View>
  </View>
);

export const SignInScreen = ({ navigation }) => {
  const { isDark, colors } = useTheme();
  const c = isDark ? PALETTE.dark : PALETTE.light;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const usernameRef = useRef(username);
  const passwordRef = useRef(password);
  usernameRef.current = username;
  passwordRef.current = password;

  const setCredentials = useAuthStore((s) => s.setCredentials);

  const handleSignIn = async () => {
    const trimmedUser = (usernameRef.current || username || '').trim();
    const trimmedPass = (passwordRef.current || password || '').trim();

    if (!trimmedUser) {
      AppToast.show({
        title: 'Username Required',
        message: 'Please enter your pharmacy username or email.',
        type: 'error',
      });
      return;
    }

    if (!trimmedPass) {
      AppToast.show({
        title: 'Password Required',
        message: 'Please enter your password.',
        type: 'error',
      });
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const isStaffLogin = trimmedUser.toLowerCase().includes('staff');
      const resolvedRole = isStaffLogin ? 'STAFF' : 'PHARMACY_ADMIN';

      const mockUser = {
        id: isStaffLogin ? 'staff_user_101' : 'pharma_admin_1',
        username: trimmedUser,
        name: isStaffLogin ? 'Pharmacy Staff' : 'City Meds Pharmacy',
        role: resolvedRole,
        pharmacyId: 'pharma_42',
        permissions: isStaffLogin
          ? [
              PERMISSIONS.SCAN_QR_DEVICE,
              PERMISSIONS.PO_INITIATOR,
              PERMISSIONS.UPLOAD_CLOSING_DATA,
            ]
          : [],
      };

      await setCredentials({
        user: mockUser,
        token: 'oneretail_token_' + Date.now(),
        refreshToken: 'oneretail_refresh_' + Date.now(),
        role: resolvedRole,
      });

      AppToast.show({
        title: 'Welcome Back',
        message: `Signed in as ${isStaffLogin ? 'Staff Member' : 'Pharmacy Admin'}.`,
        type: 'success',
      });

      if (navigation?.replace) {
        navigation.replace('MainTabs');
      } else if (navigation?.navigate) {
        navigation.navigate('MainTabs');
      }
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

  const handleRegister = () => {
    navigation.navigate('AccountSetup');
  };

  const handleForgotPassword = () => {
    AppToast.show({
      title: 'Reset Password',
      message: 'Password reset link sent to your registered contact.',
      type: 'info',
    });
  };

  const capsuleStyle = [
    styles.inputCapsule,
    !isDark && styles.capsuleShadowLight,
    { backgroundColor: c.capsuleBg, borderColor: c.capsuleBorder },
  ];

  return (
    <AuthScreenContainer keyboardAvoiding>
      <View style={styles.safeContainer}>
        {/* Header: badge + title + subtitle */}
        <View style={styles.headerSection}>
          <AppWelcomeBadge
            text="WELCOME TO ONERETAIL BY ALVOZEN"
            style={{ marginBottom: verticalScale(12) }}
          />

          <AppText
            variant="headlineLarge"
            style={[
              styles.title,
              {
                color: colors.text?.primary,
                marginBottom: verticalScale(12),
                fontFamily: 'DMSans-Medium',
                fontSize: scaleFont(38),
                lineHeight: scaleFont(44),
              },
            ]}
          >
            Sign in to continue{'\n'}your pharmacy.
          </AppText>

          <AppText
            variant="bodyLarge"
            style={[
              styles.subtitle,
              {
                color: '#787878',
                fontFamily: 'DMSans-Regular',
              },
            ]}
          >
            Enter your credentials to access your retail inventory, scanner, and wallet.
          </AppText>
        </View>

        {/* Form: inputs + options row */}
        <View style={styles.middleSection}>
          {/* Username */}
          <View style={capsuleStyle}>
            <IconBadge id="userBadgeGrad" colors={c.userBadge}>
              <UserOutlineIcon size={24} color={c.icon} />
            </IconBadge>
            <TextInput
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                usernameRef.current = text;
              }}
              placeholder="Username or email"
              placeholderTextColor={c.placeholder}
              style={[styles.inputField, { color: c.inputText }]}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Password */}
          <View style={[capsuleStyle, styles.lastCapsule]}>
            <IconBadge id="lockBadgeGrad" colors={c.lockBadge}>
              <LockOutlineIcon size={28} color={c.icon} />
            </IconBadge>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                passwordRef.current = text;
              }}
              placeholder="Password"
              placeholderTextColor={c.placeholder}
              secureTextEntry={!isPasswordVisible}
              style={[styles.inputField, { color: c.inputText }]}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.inputIconRight}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isPasswordVisible ? (
                <EyeOpenIcon size={24} color={c.icon} />
              ) : (
                <EyeOffIcon size={24} color={c.icon} />
              )}
            </TouchableOpacity>
          </View>

          {/* Stay logged in + Forgot password */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setStayLoggedIn(!stayLoggedIn)}
              style={styles.checkboxRow}
            >
              <CheckboxIcon
                checked={stayLoggedIn}
                size={20}
                color={c.label}
                borderColor={c.checkboxBorder}
              />
              <AppText
                variant="bodyMedium"
                style={[styles.checkboxLabel, { color: c.label }]}
              >
                Stay logged in
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleForgotPassword}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppText
                variant="bodyMedium"
                style={[
                  styles.forgotPasswordText,
                  { color: c.forgot, textDecorationColor: c.forgot },
                ]}
              >
                Forgot password
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom: slider + register link */}
        <View style={styles.bottomSection}>
          <AppSlider
            title={isLoading ? 'Signing in...' : 'Swipe to Sign in'}
            disabled={isLoading}
            onSuccess={handleSignIn}
          />

          <View style={styles.registerRow}>
            <AppText
              variant="bodyLarge"
              style={[
                styles.registerPrompt,
                { color: c.prompt, fontSize: scaleFont(14) },
              ]}
            >
              Don’t you have an account?{' '}
            </AppText>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleRegister}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppText
                variant="bodyLarge"
                style={[
                  styles.registerHighlight,
                  { color: c.link, fontSize: scaleFont(14) },
                ]}
              >
                Register
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AuthScreenContainer>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(32),
  },
  headerSection: {},
  title: {
    fontFamily: 'DMSans-Medium',
    letterSpacing: -1,
    marginBottom: verticalScale(10),
  },
  subtitle: {
    fontSize: scaleFont(14),
    lineHeight: scaleFont(20),
    letterSpacing: -0.2,
  },
  middleSection: {
    flexGrow: 1,
    paddingTop: verticalScale(28),
  },
  inputCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(64),
    borderRadius: scale(20),
    borderWidth: 1,
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
  },
  lastCapsule: {
    marginBottom: 0,
  },
  capsuleShadowLight: {
    shadowColor: '#2B7A8C',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  iconBadge: {
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  inputField: {
    flex: 1,
    fontSize: scaleFont(16),
    fontFamily: 'DMSans-Medium',
    paddingVertical: 0,
    includeFontPadding: false,
  },
  inputIconRight: {
    padding: scale(3),
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(20),
    paddingHorizontal: scale(2),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: scale(10),
    fontSize: scaleFont(14),
    fontFamily: 'DMSans-Regular',
  },
  forgotPasswordText: {
    fontSize: scaleFont(14),
    fontFamily: 'DMSans-Medium',
    textDecorationLine: 'underline',
  },
  bottomSection: {
    marginTop: verticalScale(16),
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  registerPrompt: {
    fontFamily: 'DMSans-Regular',
  },
  registerHighlight: {
    fontFamily: 'DMSans-Medium',
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;
