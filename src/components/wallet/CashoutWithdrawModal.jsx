import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { AppModal, AppText, AppInput, AppButton, AppToast } from '../core/index.js';
import {
  BankOfficialIcon,
  MoneyOfficialIcon,
  WithdrawIcon,
} from '../../assets/vectors/index.js';

const PRESET_AMOUNTS = [5000, 10000, 25000, 48500];

/**
 * CashoutWithdrawModal - Multi-channel cashout with tax documentation
 * Features exact BankOfficialIcon and MoneyOfficialIcon vector assets.
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
  const { colors, spacing, isDark } = useTheme();
  const [cashoutChannel, setCashoutChannel] = useState('EASYPAISA'); // 'EASYPAISA' | 'JAZZCASH' | 'BANK'
  const [cashoutAmount, setCashoutAmount] = useState('10000');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [bankName, setBankName] = useState('Meezan Bank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickAmount = (amt) => {
    setCashoutAmount(String(amt));
  };

  const handleCashoutSubmit = () => {
    const amt = Number(cashoutAmount);
    if (!amt || amt <= 0 || amt > walletBalance) {
      AppToast.show({
        title: 'Invalid Amount',
        message: `Please enter an amount up to available balance PKR ${walletBalance.toLocaleString()}.`,
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
        <AppText variant="caption" colorType="muted" style={{ marginBottom: 12 }}>
          Withdraw earnings instantly with FBR-compliant Withholding Tax (WHT) documentation.
        </AppText>

        {/* Channel Selector: EasyPaisa | JazzCash | Bank */}
        <View style={styles.channelRow}>
          {[
            { id: 'EASYPAISA', label: 'EasyPaisa', icon: <MoneyOfficialIcon size={16} color={cashoutChannel === 'EASYPAISA' ? '#FFF' : colors.text?.primary} /> },
            { id: 'JAZZCASH', label: 'JazzCash', icon: <MoneyOfficialIcon size={16} color={cashoutChannel === 'JAZZCASH' ? '#FFF' : colors.text?.primary} /> },
            { id: 'BANK', label: 'Bank Transfer', icon: <BankOfficialIcon size={16} color={cashoutChannel === 'BANK' ? '#FFF' : colors.text?.primary} /> },
          ].map((ch) => (
            <TouchableOpacity
              key={ch.id}
              onPress={() => setCashoutChannel(ch.id)}
              style={[
                styles.channelTab,
                {
                  backgroundColor:
                    cashoutChannel === ch.id
                      ? colors.brand?.primary
                      : isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <View style={styles.channelTabContent}>
                {ch.icon}
                <AppText
                  variant="caption"
                  colorType={cashoutChannel === ch.id ? 'inverse' : 'primary'}
                  style={{ fontWeight: cashoutChannel === ch.id ? '700' : '400', marginLeft: 4 }}
                >
                  {ch.label}
                </AppText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Preset Amount Chips */}
        <AppText variant="caption" colorType="muted" style={{ marginTop: 10, marginBottom: 4 }}>
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
                  borderColor: cashoutAmount === String(amt) ? colors.brand?.accent : colors.border?.subtle,
                  backgroundColor: cashoutAmount === String(amt) ? 'rgba(251, 107, 3, 0.1)' : 'transparent',
                },
              ]}
            >
              <AppText variant="caption" colorType={cashoutAmount === String(amt) ? 'accent' : 'primary'}>
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
        />

        {/* Dynamic Fields Based on Channel */}
        {cashoutChannel === 'BANK' && (
          <AppInput
            label="Bank Name"
            placeholder="e.g. Meezan Bank / HBL"
            value={bankName}
            onChangeText={setBankName}
            iconTone="teal"
            iconLeft={<BankOfficialIcon size={18} color={colors.text?.primary} />}
          />
        )}

        <AppInput
          label={cashoutChannel === 'BANK' ? 'Account Number / 24-Digit IBAN' : 'Mobile Account Number'}
          placeholder={cashoutChannel === 'BANK' ? 'PK00MEZN0000000000000000' : '03001234567'}
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType={cashoutChannel === 'BANK' ? 'default' : 'phone-pad'}
        />

        <AppInput
          label="Account Title (Must Match CNIC / DSL)"
          placeholder="e.g. City Meds Pharmacy"
          value={accountTitle}
          onChangeText={setAccountTitle}
        />

        {/* Tax Documentation Notice */}
        <View style={[styles.taxNoticeBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
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
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  channelTab: {
    flex: 1,
    paddingVertical: verticalScale(8),
    alignItems: 'center',
    borderRadius: scale(8),
    marginHorizontal: scale(2),
  },
  channelTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: scale(8),
    marginRight: scale(6),
    marginBottom: verticalScale(6),
  },
  taxNoticeBox: {
    padding: scale(8),
    borderRadius: scale(8),
    marginTop: verticalScale(4),
  },
});

export default CashoutWithdrawModal;
