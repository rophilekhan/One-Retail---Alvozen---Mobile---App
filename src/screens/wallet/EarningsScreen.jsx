import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import {
  AppScreenContainer,
  AppText,
  AppBackButton,
} from '../../components/core/index.js';
import {
  EarningsSummaryCard,
  EarningTransactionCard,
  SelectWithdrawMethodModal,
  WithdrawAccountDetailsModal,
  WithdrawBankTransferModal,
  EnterOTPModal,
  EnterWithdrawalAmountModal,
  ReviewConfirmWithdrawalModal,
  FilterTabs,
} from '../../components/wallet/index.js';
import { WithdrawIcon } from '../../assets/vectors/ImpactIcons.jsx';

/**
 * Mock Earnings Payout & Transfer Transactions
 */
const MOCK_EARNING_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'bank',
    title: 'Bank Transfer (Meezan)',
    status: 'Pending',
    date: 'Today',
    amount: '15,000 Rs',
  },
  {
    id: 'tx-2',
    type: 'jazzcash',
    title: 'JazzCash Transfer',
    status: 'Paid',
    date: '14 Nov',
    amount: '8,500 Rs',
  },
  {
    id: 'tx-3',
    type: 'easypaisa',
    title: 'Easypaisa Payout',
    status: 'Paid',
    date: '02 Nov',
    amount: '12,000 Rs',
  },
  {
    id: 'tx-4',
    type: 'bank',
    title: 'Bank Transfer (HBL)',
    status: 'Paid',
    date: '28 Oct',
    amount: '25,000 Rs',
  },
  {
    id: 'tx-5',
    type: 'bank',
    title: 'Trade Scheme Rebate',
    status: 'Paid',
    date: '15 Oct',
    amount: '18,500 Rs',
  },
];

const FILTER_PERIODS = ['This Month', 'Last Month', 'Last 3 Months', 'All Time'];

/**
 * EarningsScreen - Dedicated pharmacy earnings & payout history screen
 */
export const EarningsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('This Month');

  // Withdrawal Modal State Machine
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState(null);
  const [isAccountDetailsModalVisible, setIsAccountDetailsModalVisible] = useState(false);
  const [isBankTransferModalVisible, setIsBankTransferModalVisible] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [isAmountModalVisible, setIsAmountModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  const [enteredAccountNumber, setEnteredAccountNumber] = useState('0345-2102014');
  const [withdrawalAmount, setWithdrawalAmount] = useState('15,000');
  const [taxNtn, setTaxNtn] = useState('7819204-5');
  const [bankDetails, setBankDetails] = useState({
    bankName: 'Meezan Bank',
    accountTitle: 'Al-Shifa Medicos',
    accountNumber: '02040104819201',
    ntnNumber: '7819204-5',
  });

  const handleSelectMethod = (method) => {
    setSelectedWithdrawMethod(method);
    setIsWithdrawModalVisible(false);

    if (method.id === 'bank') {
      setIsBankTransferModalVisible(true);
    } else {
      setIsAccountDetailsModalVisible(true);
    }
  };

  const handleAccountContinue = (accountNumber, ntnNumber) => {
    setEnteredAccountNumber(accountNumber);
    if (ntnNumber) setTaxNtn(ntnNumber);
    setIsAccountDetailsModalVisible(false);
    setIsOtpModalVisible(true);
  };

  const handleBankContinue = ({ bankName, accountTitle, accountNumber, ntnNumber }) => {
    setBankDetails({ bankName, accountTitle, accountNumber, ntnNumber });
    setEnteredAccountNumber(accountNumber);
    if (ntnNumber) setTaxNtn(ntnNumber);
    setIsBankTransferModalVisible(false);
    setIsOtpModalVisible(true);
  };

  const handleOtpVerify = () => {
    setIsOtpModalVisible(false);
    setIsAmountModalVisible(true);
  };

  const handleAmountContinue = (amount) => {
    setWithdrawalAmount(amount);
    setIsAmountModalVisible(false);
    setIsReviewModalVisible(true);
  };

  const handleFinalConfirm = () => {
    setIsReviewModalVisible(false);
  };

  return (
    <AppScreenContainer
      withAmbientGlow={true}
      keyboardAvoiding={false}
      withHorizontalPadding={false}
    >
      {/* 1. Header with AppBackButton, Title & Withdraw Button */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <AppBackButton onPress={() => navigation.goBack()} size={scale(40)} />
          <AppText style={[styles.headerTitle, { color: colors.text.primary }]}>
            Earnings
          </AppText>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsWithdrawModalVisible(true)}
          style={[
            styles.withdrawPillBtn,
            {
              backgroundColor: isDark
                ? (colors.brand?.primary || '#009BA9')
                : (colors.brand?.primaryDark || '#0F4761'),
            },
          ]}
        >
          <WithdrawIcon size={scale(16)} color="#FFFFFF" />
          <AppText style={styles.withdrawPillText}>Withdraw</AppText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_EARNING_TRANSACTIONS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* 2. Hero Credit/Debit Card */}
            <View style={styles.heroWrapper}>
              <EarningsSummaryCard
                balance="48,500"
                availableBalance="48,500"
                pendingBalance="12,000"
                paidBalance="125,000"
              />
            </View>

            {/* 3. Section Filter Header */}
            <View style={styles.sectionHeader}>
              <AppText style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Payout History
              </AppText>
              <FilterTabs
                tabs={FILTER_PERIODS}
                activeTab={selectedFilter}
                onTabChange={setSelectedFilter}
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <EarningTransactionCard
            type={item.type}
            title={item.title}
            status={item.status}
            date={item.date}
            amount={item.amount}
          />
        )}
      />

      {/* Modals Flow */}
      <SelectWithdrawMethodModal
        visible={isWithdrawModalVisible}
        onClose={() => setIsWithdrawModalVisible(false)}
        onSelectMethod={handleSelectMethod}
        selectedMethod={selectedWithdrawMethod}
        linkedAccounts={{
          jazzcash: enteredAccountNumber,
          bank: bankDetails.accountNumber,
        }}
      />

      <WithdrawAccountDetailsModal
        visible={isAccountDetailsModalVisible}
        onClose={() => setIsAccountDetailsModalVisible(false)}
        onBack={() => {
          setIsAccountDetailsModalVisible(false);
          setIsWithdrawModalVisible(true);
        }}
        onContinue={handleAccountContinue}
        selectedMethod={selectedWithdrawMethod}
      />

      <WithdrawBankTransferModal
        visible={isBankTransferModalVisible}
        onClose={() => setIsBankTransferModalVisible(false)}
        onBack={() => {
          setIsBankTransferModalVisible(false);
          setIsWithdrawModalVisible(true);
        }}
        onContinue={handleBankContinue}
      />

      <EnterOTPModal
        visible={isOtpModalVisible}
        onClose={() => setIsOtpModalVisible(false)}
        onBack={() => {
          setIsOtpModalVisible(false);
          if (selectedWithdrawMethod?.id === 'bank') {
            setIsBankTransferModalVisible(true);
          } else {
            setIsAccountDetailsModalVisible(true);
          }
        }}
        onVerify={handleOtpVerify}
      />

      <EnterWithdrawalAmountModal
        visible={isAmountModalVisible}
        onClose={() => setIsAmountModalVisible(false)}
        onBack={() => {
          setIsAmountModalVisible(false);
          setIsOtpModalVisible(true);
        }}
        onContinue={handleAmountContinue}
        availableBalance="48,500"
        minAmount={selectedWithdrawMethod?.id === 'bank' ? '2,500' : '500'}
      />

      <ReviewConfirmWithdrawalModal
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        onBack={() => {
          setIsReviewModalVisible(false);
          setIsAmountModalVisible(true);
        }}
        onConfirm={handleFinalConfirm}
        selectedMethod={selectedWithdrawMethod}
        withdrawalData={{
          methodName: selectedWithdrawMethod?.name,
          isBankTransfer: selectedWithdrawMethod?.id === 'bank',
          bankName: bankDetails.bankName,
          accountTitle: bankDetails.accountTitle,
          accountNumber: enteredAccountNumber,
          ntnNumber: taxNtn,
          amount: withdrawalAmount,
        }}
      />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  headerTitle: {
    fontSize: scaleFont(22),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  withdrawPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: scale(999),
    gap: scale(6),
  },
  withdrawPillText: {
    color: '#FFFFFF',
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(32),
  },
  heroWrapper: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(20),
  },
  sectionHeader: {
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
});

export default EarningsScreen;
