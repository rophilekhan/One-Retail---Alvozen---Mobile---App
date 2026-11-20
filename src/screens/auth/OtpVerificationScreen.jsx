import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  AppButton,
  AppBadge,
  AppToast,
} from '../../components/core/index.js';

const OTP_LENGTH = 4;

/**
 * OtpVerificationScreen - Pharmacy Registration Step 2
 * 4-digit OTP Verification with auto-focus, backspace, and timer.
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} props.route
 */
export const OtpVerificationScreen = ({ navigation, route }) => {
  const { colors, isDark, spacing } = useTheme();

  const phone = route?.params?.phone || '03001234567';
  const email = route?.params?.email || 'pharmacy@example.com';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const submitOtp = (code) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      AppToast.show({
        title: 'Identity Verified',
        message: 'Phone number and email verified successfully.',
        type: 'success',
      });
      navigation.navigate('PharmacyLicenses', route?.params);
    }, 600);
  };

  const handleChange = (text, index) => {
    const val = text.replace(/[^0-9]/g, '').slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    if (val && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (val && index === OTP_LENGTH - 1) {
      const full = updated.join('');
      if (full.length === OTP_LENGTH) {
        Keyboard.dismiss();
        submitOtp(full);
      }
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputs.current[index - 1]?.focus();
        const updated = [...otp];
        updated[index - 1] = '';
        setOtp(updated);
      } else {
        const updated = [...otp];
        updated[index] = '';
        setOtp(updated);
      }
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(120);
      setOtp(['', '', '', '']);
      inputs.current[0]?.focus();
      AppToast.show({
        title: 'OTP Resent',
        message: 'A fresh 4-digit code has been sent.',
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
    if (isFocused) return colors.brand?.primary || '#009BA9';
    if (isDark) return isFilled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)';
    return isFilled ? '#FFFFFF' : '#EDF0F1';
  };

  return (
    <AppScreenContainer keyboardAvoiding={true} scrollable={true} withAmbientGlow={true}>
      <AppHeader title="Verify Identity" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.stepHeader}>
          <AppBadge label="Step 2 of 4" variant="brand" />
          <AppText variant="headlineMedium" colorType="primary" style={styles.title}>
            Enter 4-Digit OTP
          </AppText>
          <AppText variant="bodyMedium" colorType="muted">
            Code sent to {phone} and {email}. Please also check your spam folder.
          </AppText>
        </View>

        {/* 4 Digit Boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => {
            const isFilled = Boolean(digit);
            const isFocused = focusedIndex === index;

            return (
              <View key={index} style={styles.otpBoxWrapper}>
                <View
                  style={[
                    styles.otpBox,
                    {
                      borderColor: getBorderColor(isFilled, isFocused),
                      borderRadius: scale(18),
                    },
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
                    ref={(el) => (inputs.current[index] = el)}
                    style={[styles.otpInput, { color: colors.text?.primary || '#FFFFFF' }]}
                    value={digit}
                    onChangeText={(txt) => handleChange(txt, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Timer & Resend */}
        <View style={styles.timerSection}>
          <AppText variant="bodyMedium" colorType="muted">
            {timer > 0 ? `Code expires in ${formatTime(timer)}` : 'Code expired'}
          </AppText>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleResend}
            disabled={timer > 0}
            style={styles.resendBtn}
          >
            <AppText
              variant="bodyLarge"
              colorType={timer > 0 ? 'muted' : 'brand'}
              style={{ fontWeight: '600' }}
            >
              Resend Code
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={{ height: spacing.xl }} />

        <AppButton
          variant="primary"
          title="Verify & Continue"
          loading={isVerifying}
          onPress={() => submitOtp(otp.join(''))}
        />
      </View>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: verticalScale(12),
  },
  stepHeader: {
    marginBottom: verticalScale(24),
  },
  title: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(4),
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(16),
  },
  otpBoxWrapper: {
    width: scale(72),
    height: scale(80),
  },
  otpBox: {
    width: '100%',
    height: '100%',
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: scaleFont(28),
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  timerSection: {
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  resendBtn: {
    marginTop: verticalScale(8),
    padding: 8,
  },
});

export default OtpVerificationScreen;
