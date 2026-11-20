import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
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
import { CreditCardOfficialIcon } from '../../assets/vectors/ImpactIcons.jsx';

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
 * Tax Document Icon
 */
const TaxDocIcon = ({ size = 20, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M14 2V8H20" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * WithdrawAccountDetailsModal
 *
 * Dedicated bottom-sheet modal for entering destination wallet/account number and Pharmacy NTN.
 *
 * @param {Object} props
 * @param {boolean} [props.visible]
 * @param {boolean} [props.isVisible]
 * @param {Function} props.onClose
 * @param {Function} [props.onBack]
 * @param {Function} [props.onContinue]
 * @param {Object} [props.selectedMethod]
 */
export const WithdrawAccountDetailsModal = ({
  visible,
  isVisible,
  onClose,
  onBack,
  onContinue,
  selectedMethod,
}) => {
  const { colors, isDark } = useTheme();
  const isModalVisible = visible !== undefined ? visible : isVisible;

  const [accountNumber, setAccountNumber] = useState('');
  const [ntnNumber, setNtnNumber] = useState('7819204-5');
  const [focusedField, setFocusedField] = useState(null);

  const handleContinue = () => {
    if (!accountNumber.trim()) {
      AppToast.show({
        title: 'Account Required',
        message: 'Please enter your mobile wallet / account number.',
        type: 'warning',
      });
      return;
    }

    if (onContinue) {
      onContinue(accountNumber, ntnNumber);
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
          Account details
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

      {/* 2. Unified Card: Input Fields & Protected Info Box */}
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.04)'
              : '#FFFFFF',
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.06)',
          },
        ]}
      >
        {/* Input Field 1: Account / Mobile Wallet */}
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.04)'
                : '#FFFFFF',
              borderColor: focusedField === 'acc'
                ? (isDark ? '#009BA9' : '#0F4761')
                : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
            },
          ]}
        >
          <View
            style={[
              styles.iconDisc,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(6, 182, 212, 0.12)',
              },
            ]}
          >
            <CreditCardOfficialIcon
              size={scale(20)}
              color={isDark ? '#FFFFFF' : '#020202'}
            />
          </View>

          <TextInput
            value={accountNumber}
            onChangeText={setAccountNumber}
            onFocus={() => setFocusedField('acc')}
            onBlur={() => setFocusedField(null)}
            placeholder="Account / Mobile Wallet Number"
            placeholderTextColor={isDark ? '#94A3B8' : '#9CA3AF'}
            keyboardType="phone-pad"
            style={[
              styles.textInput,
              { color: colors.text.primary },
            ]}
          />
        </View>

        {/* Input Field 2: Pharmacy NTN / Tax ID */}
        <View
          style={[
            styles.inputWrapper,
            {
              marginTop: verticalScale(12),
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.04)'
                : '#FFFFFF',
              borderColor: focusedField === 'ntn'
                ? (isDark ? '#009BA9' : '#0F4761')
                : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
            },
          ]}
        >
          <View
            style={[
              styles.iconDisc,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(6, 182, 212, 0.12)',
              },
            ]}
          >
            <TaxDocIcon
              size={scale(18)}
              color={isDark ? '#FFFFFF' : '#020202'}
            />
          </View>

          <TextInput
            value={ntnNumber}
            onChangeText={setNtnNumber}
            onFocus={() => setFocusedField('ntn')}
            onBlur={() => setFocusedField(null)}
            placeholder="Pharmacy NTN / STRN (e.g. 7819204-5)"
            placeholderTextColor={isDark ? '#94A3B8' : '#9CA3AF'}
            style={[
              styles.textInput,
              { color: colors.text.primary },
            ]}
          />
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)',
            },
          ]}
        />

        {/* Info Row */}
        <View style={styles.infoRow}>
          <Image
            source={require('../../assets/images/verified shield.png')}
            style={{ width: scale(28), height: scale(28) }}
            resizeMode="contain"
          />
          <AppText
            style={[
              styles.infoText,
              { color: colors.text.primary },
            ]}
          >
            Your pharmacy payout details & tax documentation are verified and protected.
          </AppText>
        </View>
      </View>

      {/* 3. Continue Button */}
      <AppButton
        variant="primary"
        size="lg"
        title="Continue"
        onPress={handleContinue}
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
    marginBottom: verticalScale(20),
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
  cardContainer: {
    borderRadius: scale(20),
    borderWidth: 1,
    padding: scale(16),
    marginBottom: verticalScale(24),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(18),
    borderWidth: 1,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
  },
  iconDisc: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  textInput: {
    flex: 1,
    fontSize: scaleFont(15),
    fontFamily: 'DMSans-Regular',
    paddingVertical: verticalScale(8),
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: verticalScale(16),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(2),
  },
  infoText: {
    fontSize: scaleFont(13),
    lineHeight: scaleFont(18),
    fontFamily: 'DMSans-Regular',
    marginLeft: scale(12),
    flex: 1,
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

export default WithdrawAccountDetailsModal;
