import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { fontFamilies } from '../../theme/typography.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppModal,
  AppText,
  AppButton,
  AppToast,
} from '../core/index.js';
import { CloseIcon, ChevronRightIcon, UserOutlineIcon } from '../../assets/vectors/AuthIcons.jsx';
import { BankOfficialIcon, CreditCardOfficialIcon } from '../../assets/vectors/ImpactIcons.jsx';

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
 * Tax Doc Icon
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

const POPULAR_BANKS = [
  'Meezan Bank',
  'Habib Bank Limited (HBL)',
  'Bank Alfalah',
  'Standard Chartered',
  'United Bank Limited (UBL)',
  'MCB Bank',
  'Allied Bank (ABL)',
  'Faysal Bank',
];

/**
 * WithdrawBankTransferModal
 *
 * Dedicated modal for pharmacy commercial bank account withdrawal details.
 * Contains:
 * - Bank Name (with dropdown)
 * - Account Title
 * - Account No. / IBAN
 * - NTN / STRN Tax ID
 * Followed by security guarantee shield and Continue button.
 *
 * @param {Object} props
 * @param {boolean} [props.visible]
 * @param {boolean} [props.isVisible]
 * @param {Function} props.onClose
 * @param {Function} [props.onBack]
 * @param {Function} [props.onContinue]
 */
export const WithdrawBankTransferModal = ({
  visible,
  isVisible,
  onClose,
  onBack,
  onContinue,
}) => {
  const { colors, isDark } = useTheme();
  const isModalVisible = visible !== undefined ? visible : isVisible;

  const [bankName, setBankName] = useState('Meezan Bank');
  const [accountTitle, setAccountTitle] = useState('Al-Shifa Medicos');
  const [accountNumber, setAccountNumber] = useState('02040104819201');
  const [ntnNumber, setNtnNumber] = useState('7819204-5');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleContinue = () => {
    if (!accountNumber.trim()) {
      AppToast.show({
        title: 'Account Required',
        message: 'Please enter your Account Number or IBAN.',
        type: 'warning',
      });
      return;
    }

    if (onContinue) {
      onContinue({
        bankName,
        accountTitle,
        accountNumber,
        ntnNumber,
      });
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
          Bank transfer details
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

      {/* 2. Unified Card Container */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: verticalScale(400) }}>
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
          {/* Field 1: Bank Name with Chevron */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowBankDropdown((prev) => !prev)}
            style={[
              styles.fieldRow,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : '#FFFFFF',
                borderColor: showBankDropdown
                  ? (isDark ? '#009BA9' : '#0F4761')
                  : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
              },
            ]}
          >
            <View style={styles.fieldLeft}>
              <View
                style={[
                  styles.iconDisc,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(6, 182, 212, 0.08)',
                  },
                ]}
              >
                <BankOfficialIcon
                  size={scale(18)}
                  color={isDark ? colors.text.primary : colors.brand.primaryDark}
                />
              </View>
              <AppText
                style={[
                  styles.fieldText,
                  { color: bankName ? colors.text.primary : (isDark ? '#94A3B8' : '#9CA3AF') },
                ]}
              >
                {bankName || 'Bank Name'}
              </AppText>
            </View>

            <ChevronRightIcon
              size={scale(16)}
              color={isDark ? '#94A3B8' : '#787878'}
            />
          </TouchableOpacity>

          {/* Bank Dropdown Accordion */}
          {showBankDropdown && (
            <View
              style={[
                styles.dropdownBox,
                {
                  backgroundColor: isDark ? '#1C1C20' : '#F9FAFB',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                },
              ]}
            >
              {POPULAR_BANKS.map((b) => (
                <TouchableOpacity
                  key={b}
                  activeOpacity={0.7}
                  onPress={() => {
                    setBankName(b);
                    setShowBankDropdown(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    b === bankName && {
                      backgroundColor: isDark
                        ? 'rgba(0, 155, 169, 0.15)'
                        : 'rgba(15, 71, 97, 0.08)',
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.dropdownItemText,
                      {
                        color: b === bankName
                          ? (isDark ? '#38BDF8' : '#0F4761')
                          : colors.text.primary,
                        fontWeight: b === bankName ? '700' : '400',
                      },
                    ]}
                  >
                    {b}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Field 2: Account Title */}
          <View
            style={[
              styles.fieldRow,
              {
                marginTop: verticalScale(10),
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : '#FFFFFF',
                borderColor: activeField === 'title'
                  ? (isDark ? '#009BA9' : '#0F4761')
                  : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
              },
            ]}
          >
            <View style={styles.fieldLeft}>
              <View
                style={[
                  styles.iconDisc,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(6, 182, 212, 0.08)',
                  },
                ]}
              >
                <UserOutlineIcon
                  size={scale(18)}
                  color={isDark ? '#FFFFFF' : '#020202'}
                />
              </View>
              <TextInput
                value={accountTitle}
                onChangeText={setAccountTitle}
                onFocus={() => setActiveField('title')}
                onBlur={() => setActiveField(null)}
                placeholder="Account Title"
                placeholderTextColor={isDark ? '#94A3B8' : '#9CA3AF'}
                style={[
                  styles.textInput,
                  { color: colors.text.primary },
                ]}
              />
            </View>
          </View>

          {/* Field 3: Account Number / IBAN */}
          <View
            style={[
              styles.fieldRow,
              {
                marginTop: verticalScale(10),
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : '#FFFFFF',
                borderColor: activeField === 'num'
                  ? (isDark ? '#009BA9' : '#0F4761')
                  : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
              },
            ]}
          >
            <View style={styles.fieldLeft}>
              <View
                style={[
                  styles.iconDisc,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(6, 182, 212, 0.08)',
                  },
                ]}
              >
                <CreditCardOfficialIcon
                  size={scale(18)}
                  color={isDark ? '#FFFFFF' : '#020202'}
                />
              </View>
              <TextInput
                value={accountNumber}
                onChangeText={setAccountNumber}
                onFocus={() => setActiveField('num')}
                onBlur={() => setActiveField(null)}
                placeholder="Account No. / IBAN"
                placeholderTextColor={colors.text.inputPlaceholder}
                style={[
                  styles.textInput,
                  {
                    color: colors.text.primary,
                    fontFamily: accountNumber.length > 0 ? fontFamilies.monoMedium : fontFamilies.primaryRegular,
                    ...(accountNumber.length > 0 ? { fontVariant: ['tabular-nums'] } : null),
                  },
                ]}
              />
            </View>
          </View>

          {/* Field 4: Pharmacy NTN / Tax ID */}
          <View
            style={[
              styles.fieldRow,
              {
                marginTop: verticalScale(10),
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : '#FFFFFF',
                borderColor: activeField === 'ntn'
                  ? (isDark ? '#009BA9' : '#0F4761')
                  : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
              },
            ]}
          >
            <View style={styles.fieldLeft}>
              <View
                style={[
                  styles.iconDisc,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(6, 182, 212, 0.08)',
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
                onFocus={() => setActiveField('ntn')}
                onBlur={() => setActiveField(null)}
                placeholder="Pharmacy NTN (e.g. 7819204-5)"
                placeholderTextColor={colors.text.inputPlaceholder}
                style={[
                  styles.textInput,
                  {
                    color: colors.text.primary,
                    fontFamily: ntnNumber.length > 0 ? fontFamilies.monoMedium : fontFamilies.primaryRegular,
                    ...(ntnNumber.length > 0 ? { fontVariant: ['tabular-nums'] } : null),
                  },
                ]}
              />
            </View>
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
              FBR NTN verified for wholesale pharmaceutical trade & compliant payouts.
            </AppText>
          </View>
        </View>
      </ScrollView>

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
    marginBottom: verticalScale(16),
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
    marginBottom: verticalScale(20),
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: scale(18),
    borderWidth: 1,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconDisc: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  fieldText: {
    fontSize: scaleFont(15),
    fontFamily: 'DMSans-Medium',
  },
  textInput: {
    flex: 1,
    fontSize: scaleFont(15),
    fontFamily: 'DMSans-Regular',
    paddingVertical: verticalScale(8),
  },
  dropdownBox: {
    borderRadius: scale(14),
    borderWidth: 1,
    marginTop: verticalScale(6),
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
  },
  dropdownItemText: {
    fontSize: scaleFont(14),
    fontFamily: 'DMSans-Regular',
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

export default WithdrawBankTransferModal;
