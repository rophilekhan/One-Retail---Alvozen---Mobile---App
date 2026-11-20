import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppModal,
  AppText,
  AppButton,
  AppToast,
} from '../core/index.js';
import { CloseIcon } from '../../assets/vectors/AuthIcons.jsx';

/**
 * ChevronLeft Vector
 */
const ChevronLeftIcon = ({ size = 20, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * EnterOTPModal
 *
 * Dedicated bottom-sheet modal for 5-digit OTP verification during withdrawal.
 * Features auto-advancing 5-digit inputs with dashed empty state & filled/focused active states,
 * dynamic expiry countdown, interactive resend action, and full-width continue button.
 *
 * @param {Object} props
 * @param {boolean} [props.visible]
 * @param {boolean} [props.isVisible]
 * @param {Function} props.onClose
 * @param {Function} [props.onBack]
 * @param {Function} [props.onVerify]
 * @param {string} [props.phoneNumber='••••••••901']
 */
export const EnterOTPModal = ({
  visible,
  isVisible,
  onClose,
  onBack,
  onVerify,
  phoneNumber = '••••••••901',
}) => {
  const { colors, isDark } = useTheme();
  const isModalVisible = visible !== undefined ? visible : isVisible;

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(119); // 1:59 countdown

  const inputRefs = useRef([]);
  if (inputRefs.current.length !== 5) {
    inputRefs.current = Array(5)
      .fill(0)
      .map((_, i) => inputRefs.current[i] || React.createRef());
  }

  useEffect(() => {
    if (!isModalVisible) {
      setTimerSeconds(119);
      setOtp(['', '', '', '', '']);
      setFocusedIndex(0);
      return;
    }

    const t = setTimeout(() => {
      inputRefs.current[0]?.current?.focus();
    }, 250);

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, [isModalVisible]);

  const formattedTime = `${Math.floor(timerSeconds / 60)}:${String(
    timerSeconds % 60
  ).padStart(2, '0')}`;

  const handleOtpChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, '');

    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 5).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      const targetFocus = Math.min(digits.length, 4);
      setFocusedIndex(targetFocus);
      inputRefs.current[targetFocus]?.current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    if (cleanValue && index < 4) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        setFocusedIndex(index - 1);
        inputRefs.current[index - 1]?.current?.focus();
      }
    }
  };

  const handleVerify = () => {
    const entered = otp.join('');
    if (entered.length < 5) {
      AppToast.show({
        title: 'Incomplete OTP',
        message: 'Please enter all 5 digits received on your phone.',
        type: 'warning',
      });
      return;
    }

    if (onVerify) {
      onVerify(entered);
    }
  };

  return (
    <AppModal
      visible={Boolean(isModalVisible)}
      onClose={onClose}
      type="bottomSheet"
      style={[
        styles.modalContainer,
        {
          backgroundColor: isDark ? '#141416' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      {/* 1. Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={onBack || onClose}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.iconBtn}
        >
          <ChevronLeftIcon size={scale(20)} color={colors.text.primary} />
        </TouchableOpacity>

        <AppText
          style={[
            styles.title,
            { color: colors.text.primary },
          ]}
        >
          Enter OTP
        </AppText>

        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.iconBtn}
        >
          <CloseIcon size={scale(16)} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <AppText
        style={[
          styles.subtitle,
          { color: isDark ? '#94A3B8' : '#64748B' },
        ]}
      >
        {`We sent a 5-digit verification code to ${phoneNumber}`}
      </AppText>

      {/* 2. 5-digit OTP inputs */}
      <View style={styles.otpRow}>
        {otp.map((digit, idx) => {
          const isFocused = focusedIndex === idx;
          const isFilled = digit !== '';

          return (
            <TextInput
              key={idx}
              ref={inputRefs.current[idx]}
              value={digit}
              onChangeText={(val) => handleOtpChange(val, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              onFocus={() => setFocusedIndex(idx)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              style={[
                styles.otpBox,
                {
                  backgroundColor: isDark ? '#1C1C20' : '#F8FAFC',
                  borderColor: isFocused
                    ? (isDark ? '#009BA9' : '#0F4761')
                    : isFilled
                      ? (isDark ? '#38BDF8' : '#009BA9')
                      : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'),
                  borderWidth: isFocused ? 2 : 1,
                  color: colors.text.primary,
                },
              ]}
            />
          );
        })}
      </View>

      {/* 3. Timer & Resend */}
      <View style={styles.timerRow}>
        <AppText
          style={[
            styles.timerText,
            { color: isDark ? '#94A3B8' : '#64748B' },
          ]}
        >
          {`Code expires in `}
          <AppText style={{ color: isDark ? '#38BDF8' : '#0F4761', fontWeight: '700' }}>
            {formattedTime}
          </AppText>
        </AppText>

        <TouchableOpacity
          onPress={() => {
            setTimerSeconds(119);
            AppToast.show({
              title: 'OTP Resent',
              message: 'A new verification code has been dispatched.',
              type: 'info',
            });
          }}
          disabled={timerSeconds > 0}
        >
          <AppText
            style={[
              styles.resendText,
              {
                color: timerSeconds > 0
                  ? (isDark ? '#64748B' : '#94A3B8')
                  : (isDark ? '#38BDF8' : '#009BA9'),
              },
            ]}
          >
            Resend Code
          </AppText>
        </TouchableOpacity>
      </View>

      {/* 4. Continue Button */}
      <AppButton
        variant="primary"
        size="lg"
        title="Verify & Continue"
        onPress={handleVerify}
        style={[
          styles.continueButton,
          {
            backgroundColor: isDark ? '#009BA9' : '#0B3B4B',
          },
        ]}
        textStyle={styles.continueButtonText}
      />
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(28),
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  iconBtn: {
    width: scale(36),
    height: scale(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleFont(18),
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: scaleFont(13.5),
    fontFamily: 'DMSans-Regular',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
    paddingHorizontal: scale(8),
  },
  otpBox: {
    width: scale(52),
    height: verticalScale(56),
    borderRadius: scale(16),
    textAlign: 'center',
    fontSize: scaleFont(22),
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
    paddingHorizontal: scale(8),
  },
  timerText: {
    fontSize: scaleFont(13),
    fontFamily: 'DMSans-Regular',
  },
  resendText: {
    fontSize: scaleFont(13),
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
  },
  continueButton: {
    width: '100%',
    borderRadius: scale(999),
    height: verticalScale(50),
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    fontSize: scaleFont(15.5),
  },
});

export default EnterOTPModal;
