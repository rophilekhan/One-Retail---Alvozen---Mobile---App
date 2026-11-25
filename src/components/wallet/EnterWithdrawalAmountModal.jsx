import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { fontFamilies } from '../../theme/typography.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppModal,
  AppText,
  AppButton,
  AppToast,
} from '../core/index.js';
import { CloseIcon } from '../../assets/vectors/AuthIcons.jsx';
import { MoneyOfficialIcon } from '../../assets/vectors/ImpactIcons.jsx';

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
 * EnterWithdrawalAmountModal
 *
 * Dedicated bottom-sheet modal for specifying the withdrawal payout amount.
 * Features a large styled amount input with coin disc and fixed PKR currency badge,
 * dynamic Available Balance readout, active border highlight on focus/fill, and Continue button.
 *
 * @param {Object} props
 * @param {boolean} [props.visible]
 * @param {boolean} [props.isVisible]
 * @param {Function} props.onClose
 * @param {Function} [props.onBack]
 * @param {Function} [props.onContinue]
 * @param {number|string} [props.availableBalance='48,500']
 */
export const EnterWithdrawalAmountModal = ({
  visible,
  isVisible,
  onClose,
  onBack,
  onContinue,
  availableBalance = '48,500',
  minAmount = '500',
}) => {
  const { colors, isDark } = useTheme();
  const isModalVisible = visible !== undefined ? visible : isVisible;

  const [amount, setAmount] = useState('15,000');
  const [isFocused, setIsFocused] = useState(false);

  const isFilledOrFocused = isFocused || (amount !== '' && amount !== '0');
  const activeBorderColor = isDark
    ? colors.brand.primary
    : colors.brand.primaryDark;
  const minNum = parseInt(String(minAmount).replace(/[^0-9]/g, ''), 10) || 500;

  const handleContinue = () => {
    const rawVal = String(amount).replace(/[^0-9]/g, '');
    const num = parseInt(rawVal, 10);

    if (!num || num < minNum) {
      AppToast.show({
        title: 'Minimum Limit',
        message: `Please enter at least PKR ${minAmount} to withdraw.`,
        type: 'warning',
      });
      return;
    }

    if (onContinue) {
      onContinue(amount);
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
          backgroundColor: isDark ? colors.surface.sheetElevated : colors.surface.sheet,
          borderColor: colors.border.card,
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
          Enter amount
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

      {/* 2. Amount Input Box */}
      <View
        style={[
          styles.amountInputContainer,
          {
            backgroundColor: isDark ? colors.surface.inputSecondary : colors.background.secondary,
            borderColor: isFilledOrFocused
              ? activeBorderColor
              : colors.border.card,
            borderWidth: isFilledOrFocused ? 1.5 : 1,
          },
        ]}
      >
        <View style={styles.inputLeft}>
          <View
            style={[
              styles.coinDisc,
              {
                backgroundColor: isDark
                  ? colors.pastel.teal
                  : colors.surface.iconBg,
              },
            ]}
          >
            <MoneyOfficialIcon
              size={scale(22)}
              color={isDark ? colors.brand.primary : colors.brand.primaryDark}
            />
          </View>

          <TextInput
            value={amount}
            onChangeText={(txt) => {
              const clean = txt.replace(/[^0-9]/g, '');
              if (!clean) {
                setAmount('');
              } else {
                setAmount(parseInt(clean, 10).toLocaleString());
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0"
            placeholderTextColor={colors.text.inputPlaceholder}
            keyboardType="numeric"
            style={[
              styles.amountTextInput,
              { color: colors.text.primary },
            ]}
          />
        </View>

        <View
          style={[
            styles.currencyBadge,
            {
              backgroundColor: colors.surface.pillSecondary,
            },
          ]}
        >
          <AppText
            style={[
              styles.currencyBadgeText,
              { color: colors.text.primary },
            ]}
          >
            PKR
          </AppText>
        </View>
      </View>

      {/* 3. Available Balance & Min Limit Readout */}
      <View style={styles.balanceRow}>
        <View style={styles.balanceMetaLeft}>
          <AppText
            style={[
              styles.balanceLabel,
              { color: colors.text.secondary },
            ]}
          >
            Available:
          </AppText>
          <AppText
            style={[
              styles.balanceValue,
              { color: isDark ? colors.brand.primary : colors.brand.primaryDark },
            ]}
          >
            {` Rs ${availableBalance}`}
          </AppText>
        </View>

        <View style={styles.balanceMetaRight}>
          <AppText
            style={[
              styles.balanceLabel,
              { color: colors.text.secondary },
            ]}
          >
            Min:{' '}
          </AppText>
          <AppText
            style={[
              styles.minLimitValue,
              { color: colors.text.primary },
            ]}
          >
            {`PKR ${minAmount}`}
          </AppText>
        </View>
      </View>

      {/* 4. Continue Button */}
      <AppButton
        variant="primary"
        size="lg"
        title="Continue"
        onPress={handleContinue}
        style={[
          styles.continueButton,
          {
            backgroundColor: isDark ? colors.brand.primary : colors.brand.primaryDark,
          },
        ]}
        textStyle={[
          styles.continueButtonText,
          { color: isDark ? colors.text.primary : colors.text.inverse },
        ]}
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
    fontFamily: fontFamilies.primaryMedium,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: scale(22),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
  },
  inputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinDisc: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  amountTextInput: {
    fontSize: scaleFont(24),
    fontFamily: fontFamilies.monoMedium,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    flex: 1,
    paddingVertical: 0,
  },
  currencyBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(12),
  },
  currencyBadgeText: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.monoMedium,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(24),
    paddingHorizontal: scale(4),
  },
  balanceMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.primaryRegular,
  },
  balanceValue: {
    fontSize: scaleFont(13.5),
    fontFamily: fontFamilies.monoMedium,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  minLimitValue: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.monoMedium,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  continueButton: {
    width: '100%',
    borderRadius: scale(999),
    height: verticalScale(50),
  },
  continueButtonText: {
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(15.5),
  },
});

export default EnterWithdrawalAmountModal;
