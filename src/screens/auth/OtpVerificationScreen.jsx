import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fontFamilies, useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppText,
  AppScreenContainer,
  RegistrationProgress,
  AppBackButton,
  AppToast,
} from '../../components/core/index.js';

const OTP_BOX = {
  width: scale(52),
  height: scale(64),
  radius: scale(14),
};

/**
 * OtpVerificationScreen - Step 2 of Onboarding
 * Exact 1:1 port from OneRx OtpVerificationScreen with 6-digit code entry
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} props.route
 */
export const OtpVerificationScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();

  const phoneNumber = route?.params?.phone || '03001234567';
  const email = route?.params?.email || 'pharmacy@alvozen.com';
  const userData = route?.params?.userData || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const inputs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2-minute countdown timer logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const submitOtp = (code) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      AppToast.show({
        title: 'Identity Verified',
        message: 'Your pharmacy identity has been verified.',
        type: 'success',
      });
      navigation.navigate('PharmacyLicenses', { userData });
    }, 600);
  };

  const handleChange = (text, index) => {
    const value = text.replace(/[^0-9]/g, '').slice(-1);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-submit when the 6th digit is typed
    if (value && index === 5) {
      Keyboard.dismiss();
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        submitOtp(fullOtp);
      }
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleResend = () => {
    if (timer === 0 && !isLoading) {
      setTimer(120);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
      AppToast.show({
        title: 'OTP Resent',
        message: 'A new 6-digit verification code has been dispatched.',
        type: 'info',
      });
    }
  };

  const getFillColors = (isFilled) =>
    isDark
      ? isFilled
        ? ['#060708', '#020203']
        : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.025)']
      : isFilled
        ? ['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.92)']
        : ['rgba(255,255,255,0.96)', 'rgba(255,255,255,0.92)'];

  const getBorderColor = (isFilled, isFocused) => {
    if (isFocused) return colors.border?.focused || (isDark ? '#FFFFFF' : '#009BA9');
    if (isDark) return isFilled ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)';
    return isFilled ? '#FFFFFF' : '#EDF0F1';
  };

  const getShadow = (isFilled) =>
    isDark
      ? null
      : {
          shadowColor: '#6FB4C2',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isFilled ? 0.16 : 0.1,
          shadowRadius: 10,
          elevation: 2,
        };

  return (
    <AppScreenContainer
      withAmbientGlow={true}
      keyboardAvoiding={true}
      scrollable={true}
      withHorizontalPadding={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.safeArea}>
        {/* Progress Bar Header: Step 2 of 4 */}
        <RegistrationProgress currentStep={2} totalSteps={4} />

        <View style={styles.content}>
          {/* Header & Title Section */}
          <View style={styles.headerRow}>
            <View style={styles.backButtonWrap}>
              <AppBackButton onPress={() => navigation.goBack()} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText
                variant="bodyLarge"
                style={[
                  styles.title,
                  {
                    color: colors.text?.primary,
                    marginBottom: verticalScale(10),
                    fontFamily: fontFamilies.primaryMedium,
                    letterSpacing: scale(-1),
                    fontSize: scaleFont(36),
                    lineHeight: scaleFont(42),
                  },
                ]}
              >
                Please verify your{'\n'}identity
              </AppText>
              <AppText
                variant="bodyLarge"
                style={[
                  styles.subtitle,
                  {
                    color: '#787878',
                    fontFamily: 'DMSans-Regular',
                    fontSize: scaleFont(14),
                    lineHeight: scaleFont(20),
                  },
                ]}
              >
                {email
                  ? `We've sent a 6-digit code to ${email}.${'\n'}Please also check your messages.`
                  : `We've sent a 6-digit code to your phone.${'\n'}Please check your messages.`}
              </AppText>
            </View>
          </View>

          {/* OTP Inputs (6 Boxes) */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => {
              const isFilled = digit !== undefined && digit !== null && String(digit).length > 0;
              const isFocused = focusedIndex === index;

              return (
                <View key={index} style={[styles.otpShadowWrap, getShadow(isFilled)]}>
                  <View
                    style={[
                      styles.otpBox,
                      { borderColor: getBorderColor(isFilled, isFocused) },
                    ]}
                  >
                    <LinearGradient
                      pointerEvents="none"
                      colors={getFillColors(isFilled)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />

                    <TextInput
                      ref={(ref) => (inputs.current[index] = ref)}
                      style={[
                        styles.otpTextInput,
                        { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202') },
                      ]}
                      value={digit}
                      onChangeText={(text) => handleChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />

                    {!isFilled && (
                      <View
                        pointerEvents="none"
                        style={{
                          position: 'absolute',
                          bottom: verticalScale(14),
                          width: scale(12),
                          height: verticalScale(2),
                          backgroundColor: isDark ? 'rgba(255,255,255,0.4)' : colors.text?.secondary,
                          borderRadius: scale(2),
                        }}
                      />
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {isLoading && (
            <ActivityIndicator
              size="small"
              color={colors.brand?.primary || '#009BA9'}
              style={{ marginBottom: verticalScale(16) }}
            />
          )}

          {/* Expiration and Resend */}
          <View style={styles.resendSection}>
            <AppText
              variant="bodyMedium"
              style={[
                styles.expireText,
                { color: colors.text?.secondary || '#787878', fontFamily: 'DMSans-Regular' },
              ]}
            >
              {timer > 0 ? (
                <>
                  {'Code expires in '}
                  <AppText
                    isMono
                    style={{ color: colors.text?.primary || (isDark ? '#FFFFFF' : '#0F4761') }}
                  >
                    {formatTime(timer)}
                  </AppText>
                </>
              ) : (
                'Code expired'
              )}
            </AppText>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleResend}
              disabled={timer > 0}
            >
              <AppText
                variant="bodyMedium"
                style={[
                  styles.resendText,
                  {
                    color: timer > 0 ? '#787878' : (colors.brand?.primary || '#009BA9'),
                    fontFamily: 'DMSans-Medium',
                    textDecorationLine: timer > 0 ? 'none' : 'underline',
                  },
                ]}
              >
                Resend Code
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: verticalScale(28),
  },
  backButtonWrap: {
    marginLeft: scale(-12),
    marginRight: scale(8),
    marginTop: verticalScale(4),
  },
  title: {},
  subtitle: {},
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  otpShadowWrap: {
    borderRadius: OTP_BOX.radius,
  },
  otpBox: {
    width: OTP_BOX.width,
    height: OTP_BOX.height,
    borderRadius: OTP_BOX.radius,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpTextInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: scaleFont(22),
    fontFamily: fontFamilies.monoMedium,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
    paddingVertical: 0,
  },
  resendSection: {
    alignItems: 'center',
    marginTop: verticalScale(12),
    gap: verticalScale(8),
  },
  expireText: {
    fontSize: scaleFont(14),
  },
  resendText: {
    fontSize: scaleFont(15),
  },
});

export default OtpVerificationScreen;
