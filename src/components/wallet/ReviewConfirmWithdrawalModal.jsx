import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { fontFamilies } from '../../theme/typography.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppModal,
  AppText,
  GlassCard,
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
 * Double Right Chevron Vector for Confirm Button
 */
const DoubleChevronRightIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 17L11 12L6 7"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 17L18 12L13 7"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Dollar in Circle Vector for "You will receive"
 */
const DollarReceiveIcon = ({ size = 22, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path
      d="M12 6.5V17.5M14.5 9C14.5 7.8 13.4 7 12 7C10.6 7 9.5 7.8 9.5 9C9.5 11.5 14.5 10.5 14.5 13C14.5 14.2 13.4 15 12 15C10.6 15 9.5 14.2 9.5 13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * ReviewConfirmWithdrawalModal
 *
 * Dedicated bottom-sheet modal for final payout confirmation.
 * Dynamically switches breakdown rows:
 * - Bank Transfer: 7 rows (Payment Method, Bank Name, Account Title, Account No., Pharmacy NTN, Amount, Tax Withholding)
 * - Mobile Wallet: 5 rows (Payment Method, Account Details, Pharmacy NTN, Amount, Tax Withholding)
 * With dashed dividers between every row, net receive highlight card, and double-chevron Confirm button.
 *
 * @param {Object} props
 * @param {boolean} [props.visible]
 * @param {boolean} [props.isVisible]
 * @param {Function} props.onClose
 * @param {Function} [props.onBack]
 * @param {Function} [props.onConfirm]
 * @param {string|Object} [props.selectedMethod]
 * @param {Object} [props.withdrawalData]
 */
export const ReviewConfirmWithdrawalModal = ({
  visible,
  isVisible,
  onClose,
  onBack,
  onConfirm,
  selectedMethod,
  withdrawalData = {},
}) => {
  const { colors, isDark } = useTheme();
  const isModalVisible = visible !== undefined ? visible : isVisible;

  const methodName =
    withdrawalData.methodName ||
    (typeof selectedMethod === 'string'
      ? selectedMethod
      : selectedMethod?.name) ||
    'JazzCash';

  const isBankTransfer =
    Boolean(withdrawalData.isBankTransfer) ||
    methodName.toLowerCase().includes('bank') ||
    selectedMethod === 'bank' ||
    selectedMethod?.id === 'bank';

  const bankName = withdrawalData.bankName || 'Meezan Bank';
  const accountTitle = withdrawalData.accountTitle || 'Al-Shifa Medicos';
  const accountNo = withdrawalData.accountNumber || withdrawalData.accountNo || '02040104819201';
  const walletAccountDetails = withdrawalData.accountNumber || '0345-2102014';
  const ntnNumber = withdrawalData.ntnNumber || '7819204-5';

  const amountStr = withdrawalData.amount || '15,000';
  const rawNum = parseInt(String(amountStr).replace(/[^0-9]/g, ''), 10) || 15000;
  // FBR Active Filer 5% tax withholding on B2B pharmacy commissions/incentives
  const taxFee = withdrawalData.taxFee !== undefined ? withdrawalData.taxFee : Math.round(rawNum * 0.05);
  const netReceive = rawNum - taxFee;

  const handleProceed = () => {
    AppToast.show({
      title: 'Withdrawal Dispatched',
      message: `Rs ${netReceive.toLocaleString()} successfully sent via ${methodName}.`,
      type: 'success',
    });

    if (onConfirm) {
      onConfirm({
        methodName,
        isBankTransfer,
        bankName,
        accountTitle,
        accountNumber: isBankTransfer ? accountNo : walletAccountDetails,
        ntnNumber,
        amount: rawNum,
        taxFee,
        netReceive,
      });
    }
    onClose?.();
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
          Review & confirm
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

      {/* 2. Details Breakdown Table with Dashed Dividers */}
      <View style={styles.breakdownTable}>
        {/* Row 1: Payment Method */}
        <View style={styles.detailRow}>
          <AppText
            style={[
              styles.detailLabel,
              { color: isDark ? '#94A3B8' : '#787878' },
            ]}
          >
            PAYMENT METHOD
          </AppText>
          <AppText
            style={[
              styles.detailValue,
              { color: colors.text.primary },
            ]}
          >
            {isBankTransfer ? 'Bank Transfer' : methodName}
          </AppText>
        </View>

        <View
          style={[
            styles.dashedDivider,
            {
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
        />

        {isBankTransfer ? (
          <>
            {/* Row 2: Bank Name */}
            <View style={styles.detailRow}>
              <AppText
                style={[
                  styles.detailLabel,
                  { color: isDark ? '#94A3B8' : '#787878' },
                ]}
              >
                BANK NAME
              </AppText>
              <AppText
                style={[
                  styles.detailValue,
                  { color: colors.text.primary },
                ]}
              >
                {bankName}
              </AppText>
            </View>

            <View
              style={[
                styles.dashedDivider,
                {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.08)',
                },
              ]}
            />

            {/* Row 3: Account Title */}
            <View style={styles.detailRow}>
              <AppText
                style={[
                  styles.detailLabel,
                  { color: isDark ? '#94A3B8' : '#787878' },
                ]}
              >
                ACCOUNT TITLE
              </AppText>
              <AppText
                style={[
                  styles.detailValue,
                  { color: colors.text.primary },
                ]}
              >
                {accountTitle}
              </AppText>
            </View>

            <View
              style={[
                styles.dashedDivider,
                {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.08)',
                },
              ]}
            />

            {/* Row 4: Account No. */}
            <View style={styles.detailRow}>
              <AppText
                style={[
                  styles.detailLabel,
                  { color: isDark ? '#94A3B8' : '#787878' },
                ]}
              >
                ACCOUNT NO.
              </AppText>
              <AppText
                isMono
                style={[
                  styles.detailValueMono,
                  { color: colors.text.primary },
                ]}
              >
                {accountNo}
              </AppText>
            </View>

            <View
              style={[
                styles.dashedDivider,
                {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.08)',
                },
              ]}
            />
          </>
        ) : (
          <>
            {/* Mobile Wallet: Account Details */}
            <View style={styles.detailRow}>
              <AppText
                style={[
                  styles.detailLabel,
                  { color: isDark ? '#94A3B8' : '#787878' },
                ]}
              >
                ACCOUNT DETAILS
              </AppText>
              <AppText
                style={[
                  styles.detailValue,
                  { color: colors.text.primary },
                ]}
              >
                {walletAccountDetails}
              </AppText>
            </View>

            <View
              style={[
                styles.dashedDivider,
                {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.08)',
                },
              ]}
            />
          </>
        )}

        {/* Row: Pharmacy NTN / Tax ID */}
        <View style={styles.detailRow}>
          <AppText
            style={[
              styles.detailLabel,
              { color: isDark ? '#94A3B8' : '#787878' },
            ]}
          >
            PHARMACY NTN
          </AppText>
          <AppText
            isMono
            style={[
              styles.detailValueMono,
              { color: colors.text.primary },
            ]}
          >
            {ntnNumber}
          </AppText>
        </View>

        <View
          style={[
            styles.dashedDivider,
            {
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
        />

        {/* Amount Row */}
        <View style={styles.detailRow}>
          <AppText
            style={[
              styles.detailLabel,
              { color: isDark ? '#94A3B8' : '#787878' },
            ]}
          >
            AMOUNT
          </AppText>
          <AppText
            isMono
            style={[
              styles.detailValueMono,
              { color: colors.text.primary },
            ]}
          >
            {`Rs ${rawNum.toLocaleString()}`}
          </AppText>
        </View>

        <View
          style={[
            styles.dashedDivider,
            {
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
        />

        {/* Tax Fee Row */}
        <View style={styles.detailRow}>
          <AppText
            style={[
              styles.detailLabel,
              { color: isDark ? '#94A3B8' : '#787878' },
            ]}
          >
            TAX WITHHOLDING (5%)
          </AppText>
          <AppText
            isMono
            style={[
              styles.detailValueMono,
              { color: isDark ? '#F87171' : '#DC2626' },
            ]}
          >
            {`- Rs ${taxFee.toLocaleString()}`}
          </AppText>
        </View>
      </View>

      {/* 3. Highlighted Net Payout Card */}
      <View
        style={[
          styles.receiveCard,
          {
            backgroundColor: isDark
              ? 'rgba(0, 155, 169, 0.12)'
              : 'rgba(15, 71, 97, 0.06)',
            borderColor: isDark
              ? 'rgba(56, 189, 248, 0.3)'
              : 'rgba(15, 71, 97, 0.15)',
          },
        ]}
      >
        <View style={styles.receiveLeft}>
          <View
            style={[
              styles.receiveIconCircle,
              {
                backgroundColor: isDark
                  ? 'rgba(56, 189, 248, 0.2)'
                  : 'rgba(15, 71, 97, 0.1)',
              },
            ]}
          >
            <DollarReceiveIcon
              size={scale(20)}
              color={isDark ? '#38BDF8' : '#0F4761'}
            />
          </View>
          <AppText
            style={[
              styles.receiveLabel,
              { color: colors.text.primary },
            ]}
          >
            You will receive
          </AppText>
        </View>

        <AppText
          style={[
            styles.receiveAmount,
            { color: isDark ? '#38BDF8' : '#0F4761' },
          ]}
        >
          {`Rs ${netReceive.toLocaleString()}`}
        </AppText>
      </View>

      {/* 4. Action Button with Double Chevron */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleProceed}
        style={[
          styles.confirmButton,
          {
            backgroundColor: isDark ? '#009BA9' : '#0B3B4B',
          },
        ]}
      >
        <AppText style={styles.confirmButtonText}>
          Confirm & Dispatch Payout
        </AppText>
        <DoubleChevronRightIcon size={scale(16)} color="#FFFFFF" />
      </TouchableOpacity>
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
  breakdownTable: {
    marginBottom: verticalScale(16),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },
  detailLabel: {
    fontSize: scaleFont(12),
    fontFamily: 'DMSans-Medium',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: scaleFont(14),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  detailValueMono: {
    fontSize: scaleFont(14),
    fontFamily: fontFamilies.monoMedium,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    width: '100%',
  },
  receiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderRadius: scale(18),
    borderWidth: 1,
    marginBottom: verticalScale(20),
  },
  receiveLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiveIconCircle: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  receiveLabel: {
    fontSize: scaleFont(14.5),
    fontFamily: 'DMSans-Medium',
    fontWeight: '600',
  },
  receiveAmount: {
    fontSize: scaleFont(18),
    fontFamily: fontFamilies.monoMedium,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  confirmButton: {
    width: '100%',
    borderRadius: scale(999),
    height: verticalScale(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    fontSize: scaleFont(15.5),
  },
});

export default ReviewConfirmWithdrawalModal;
