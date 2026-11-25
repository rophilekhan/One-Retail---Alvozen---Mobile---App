import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { fontFamilies } from '../../theme/typography.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { AppModal, AppText, AppInput, AppButton, AppToast } from '../core/index.js';
import { BankOfficialIcon } from '../../assets/vectors/index.js';
import {
  WithdrawMethodOptionCard,
  WITHDRAW_OPTIONS,
} from './WithdrawMethodOptionCard.jsx';

const PRESET_AMOUNTS = [5000, 10000, 25000, 48500];

/**
 * CashoutWithdrawModal - Multi-channel cashout with tax documentation
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {number} props.walletBalance
 * @param {Function} props.onClose
 */
export const CashoutWithdrawModal = ({
  visible,
  walletBalance = 48500,
  onClose,
}) => {
  const { colors, spacing, radii, isDark } = useTheme();
  const [cashoutChannel, setCashoutChannel] = useState('EASYPAISA'); // 'EASYPAISA' | 'JAZZCASH' | 'BANK'
  const [cashoutAmount, setCashoutAmount] = useState('10000');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [bankName, setBankName] = useState('Meezan Bank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minRequired = cashoutChannel === 'BANK' ? 2500 : 500;

  const handleQuickAmount = (amt) => {
    setCashoutAmount(String(amt));
  };

  const handleCashoutSubmit = () => {
    const amt = Number(cashoutAmount);
    if (!amt || amt < minRequired || amt > walletBalance) {
      AppToast.show({
        title: 'Invalid Amount',
        message: `Please enter an amount between PKR ${minRequired.toLocaleString()} and PKR ${walletBalance.toLocaleString()}.`,
        type: 'warning',
      });
      return;
    }

    if (!accountNumber.trim() || !accountTitle.trim()) {
      AppToast.show({
        title: 'Missing Account Details',
        message: 'Please provide account title and number/IBAN.',
        type: 'warning',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      AppToast.show({
        title: 'Cashout Request Submitted',
        message: `PKR ${amt.toLocaleString()} withdrawal queued via ${cashoutChannel}. Tax documentation generated.`,
        type: 'success',
      });
    }, 700);
  };

  return (
    <AppModal
      visible={visible}
      type="bottomSheet"
      title="Redeem Earnings"
      scrollable={true}
      onClose={onClose}
    >
      <View style={styles.modalContent}>
        <AppText variant="caption" colorType="muted" style={{ marginBottom: spacing.md }}>
          Withdraw earnings instantly (Min:{' '}
          <AppText variant="monoSmall" colorType="brand" style={styles.monoMediumText}>
            PKR {minRequired.toLocaleString()}
          </AppText>
          ) with FBR WHT documentation.
        </AppText>

        {/* Channel Cards: JazzCash | Easypaisa | Bank Transfer */}
        <View style={[styles.channelsStack, { gap: spacing.sm }]}>
          {WITHDRAW_OPTIONS.map((option) => (
            <WithdrawMethodOptionCard
              key={option.id}
              option={option}
              isSelected={cashoutChannel === option.channelKey}
              onPress={(opt) => setCashoutChannel(opt.channelKey)}
            />
          ))}
        </View>

        {/* Quick Preset Amount Chips */}
        <AppText variant="caption" colorType="muted" style={{ marginTop: spacing.md, marginBottom: spacing.xs }}>
          Preset Withdrawal Amount:
        </AppText>
        <View style={styles.presetsRow}>
          {PRESET_AMOUNTS.map((amt) => (
            <TouchableOpacity
              key={amt}
              onPress={() => handleQuickAmount(amt)}
              style={[
                styles.presetChip,
                {
                  borderRadius: radii.md,
                  borderColor: cashoutAmount === String(amt) ? colors.brand.accent : colors.border.subtle,
                  backgroundColor: cashoutAmount === String(amt) ? colors.status.accentBg : colors.surface.inputSecondary,
                },
              ]}
            >
              <AppText
                variant="monoSmall"
                colorType={cashoutAmount === String(amt) ? 'accent' : 'primary'}
                style={styles.monoMediumText}
              >
                PKR {amt.toLocaleString()}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount Input */}
        <AppInput
          label="Withdrawal Amount (PKR)"
          placeholder="e.g. 10000"
          value={cashoutAmount}
          onChangeText={setCashoutAmount}
          keyboardType="number-pad"
          isMono={true}
        />

        {/* Dynamic Fields Based on Channel */}
        {cashoutChannel === 'BANK' && (
          <AppInput
            label="Bank Name"
            placeholder="e.g. Meezan Bank / HBL"
            value={bankName}
            onChangeText={setBankName}
            iconTone="teal"
            iconLeft={
              <BankOfficialIcon
                size={scale(18)}
                color={isDark ? colors.text.primary : colors.brand.primaryDark}
              />
            }
          />
        )}

        <AppInput
          label={cashoutChannel === 'BANK' ? 'Account Number / 24-Digit IBAN' : 'Mobile Account Number'}
          placeholder={cashoutChannel === 'BANK' ? 'PK00MEZN0000000000000000' : '03001234567'}
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType={cashoutChannel === 'BANK' ? 'default' : 'phone-pad'}
          isMono={true}
        />

        <AppInput
          label="Account Title (Must Match CNIC / DSL)"
          placeholder="e.g. City Meds Pharmacy"
          value={accountTitle}
          onChangeText={setAccountTitle}
        />

        {/* Tax Documentation Notice */}
        <View style={[styles.taxNoticeBox, { backgroundColor: colors.surface.inputSecondary }]}>
          <AppText variant="caption" colorType="muted">
            Tax Document: An electronic Section 236H WHT tax deduction certificate will be generated and logged under your DSL tax profile.
          </AppText>
        </View>

        <View style={{ height: spacing.md }} />
        <AppButton
          variant="primary"
          title="Submit Cashout Request"
          loading={isSubmitting}
          onPress={handleCashoutSubmit}
        />
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    paddingBottom: verticalScale(16),
  },
  channelsStack: {
    marginBottom: verticalScale(4),
  },
  monoMediumText: {
    fontFamily: fontFamilies.monoMedium,
    fontVariant: ['tabular-nums'],
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(6),
  },
  presetChip: {
    borderWidth: 1,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    marginRight: scale(6),
    marginBottom: verticalScale(6),
  },
  taxNoticeBox: {
    padding: scale(10),
    borderRadius: scale(10),
    marginTop: verticalScale(4),
  },
});

export default CashoutWithdrawModal;
