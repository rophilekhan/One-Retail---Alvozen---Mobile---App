import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import {
  AppText,
  AppBadge,
  AppScreenContainer,
  MetricIconDisc,
} from '../../components/core/index.js';
import {
  ImpactHeroSection,
  ImpactStatCard,
  ImpactScoreModal,
  TierLevelUpModal,
  SelectWithdrawMethodModal,
  WithdrawAccountDetailsModal,
  WithdrawBankTransferModal,
  EnterOTPModal,
  EnterWithdrawalAmountModal,
  ReviewConfirmWithdrawalModal,
  PiiActivitiesCard,
} from '../../components/wallet/index.js';
import { WithdrawIcon, TierGemIcon } from '../../assets/vectors/ImpactIcons.jsx';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { getPharmacyTierTheme, normalizePharmacyTier } from '../../theme/tierThemes.js';

/**
 * ImpactWalletScreen - Pharmacy Impact Index (PII) & Financial Rewards screen
 * Single unified scroll container with generous bottom nav clearance.
 */
export const ImpactWalletScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const pharmacy = usePharmacyStore();

  const currentTier = pharmacy.piiTierKey || normalizePharmacyTier(pharmacy.piiTier);
  const piiScore = pharmacy.piiScore || pharmacy.piiPoints || 842;
  const pharmacyName = pharmacy.name || 'City Meds Pharmacy';

  const tierTheme = useMemo(() => {
    return getPharmacyTierTheme(currentTier, isDark);
  }, [currentTier, isDark]);

  // Modal States
  const [isScoreModalVisible, setIsScoreModalVisible] = useState(false);
  const [isLevelUpModalVisible, setIsLevelUpModalVisible] = useState(false);
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

  useEffect(() => {
    if (pharmacy.levelUpNotification) setIsLevelUpModalVisible(true);
  }, [pharmacy.levelUpNotification]);

  const handleSelectTier = (newTierKey) => {
    pharmacy.setPiiTier?.(newTierKey);
    setIsScoreModalVisible(false);
    setTimeout(() => setIsLevelUpModalVisible(true), 250);
  };

  const handleSelectMethod = (method) => {
    setSelectedWithdrawMethod(method);
    setIsWithdrawModalVisible(false);
    if (method.id === 'bank') setIsBankTransferModalVisible(true);
    else setIsAccountDetailsModalVisible(true);
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

  return (
    <AppScreenContainer
      scrollable={true}
      withAmbientGlow={true}
      withBottomNavClearance={true}
      withHorizontalPadding={false}
      contentContainerStyle={{
        paddingHorizontal: scale(20),
      }}
    >
      {/* 1. Single-row Impact Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeftCol}>
          <AppText style={[styles.headerTitle, { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202') }]}>
            Impact Index & Wallet
          </AppText>
          <View style={styles.headerPillRow}>
            <TierGemIcon tier={currentTier} size={scale(16)} isApex={true} />
            <AppBadge
              label={tierTheme.label}
              style={{
                backgroundColor: tierTheme.badgeBg,
                borderColor: tierTheme.badgeBorder,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('PharmacyProfile')}
              style={styles.profileBadgeBtn}
              accessibilityRole="button"
              accessibilityLabel="View Pharmacy Profile"
            >
              <AppBadge label="Profile >" variant="neutral" size="sm" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Info Icon Button (Opens Tier Roadmap & Score Modal) */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setIsScoreModalVisible(true)}
          style={styles.infoBtn}
          accessibilityRole="button"
          accessibilityLabel="PII Score Breakdown and Tier Roadmap"
        >
          <MetricIconDisc size={40} isDark={isDark} variant={currentTier}>
            <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
              <Circle
                cx="12"
                cy="12"
                r="9.5"
                stroke={tierTheme.accentColor}
                strokeWidth="1.8"
              />
              <Path
                d="M12 16.5V11M12 7.75h.01"
                stroke={tierTheme.accentColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </MetricIconDisc>
        </TouchableOpacity>
      </View>

      {/* 2. Dynamic Arc Gauge Hero Section */}
      <ImpactHeroSection
        tier={currentTier}
        score={piiScore}
        onScorePress={() => setIsScoreModalVisible(true)}
        onTierPillPress={() => setIsScoreModalVisible(true)}
      />

      {/* 3. Stat Cards Row: Points & Earnings */}
      <View style={styles.statsRow}>
        <View style={{ flex: 1 }}>
          <ImpactStatCard
            title="POINTS EARNED"
            amount="12,450"
            suffix="pts"
            icon="points"
            tier={currentTier}
            onPress={() => navigation.navigate('PointsEarned')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ImpactStatCard
            title="TOTAL EARNINGS"
            amount="48,500"
            suffix="PKR"
            icon="earnings"
            tier={currentTier}
            onPress={() => navigation.navigate('Earnings')}
          />
        </View>
      </View>

      {/* 4. Withdraw Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsWithdrawModalVisible(true)}
        style={[
          styles.withdrawActionBtn,
          { backgroundColor: tierTheme.withdrawBg || tierTheme.accentColor },
        ]}
      >
        <WithdrawIcon size={scale(18)} color="#FFFFFF" />
        <AppText style={styles.withdrawActionBtnText}>
          Withdraw Earnings Payout
        </AppText>
      </TouchableOpacity>

      {/* 5. 3 Activity Pillars */}
      <View style={styles.activitiesWrapper}>
        <PiiActivitiesCard piiScore={piiScore} tier={currentTier} />
      </View>

      {/* Modals Flow */}
      <ImpactScoreModal
        visible={isScoreModalVisible}
        onClose={() => setIsScoreModalVisible(false)}
        tier={currentTier}
        score={piiScore}
        onSelectTier={handleSelectTier}
      />
      <TierLevelUpModal
        visible={isLevelUpModalVisible}
        onClose={() => {
          setIsLevelUpModalVisible(false);
          pharmacy.clearLevelUpNotification?.();
        }}
        tier={currentTier}
      />
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
          selectedWithdrawMethod?.id === 'bank'
            ? setIsBankTransferModalVisible(true)
            : setIsAccountDetailsModalVisible(true);
        }}
        onVerify={() => {
          setIsOtpModalVisible(false);
          setIsAmountModalVisible(true);
        }}
      />
      <EnterWithdrawalAmountModal
        visible={isAmountModalVisible}
        onClose={() => setIsAmountModalVisible(false)}
        onBack={() => {
          setIsAmountModalVisible(false);
          setIsOtpModalVisible(true);
        }}
        onContinue={(amount) => {
          setWithdrawalAmount(amount);
          setIsAmountModalVisible(false);
          setIsReviewModalVisible(true);
        }}
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
        onConfirm={() => setIsReviewModalVisible(false)}
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
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(8),
  },
  headerLeftCol: {
    flex: 1,
    paddingRight: scale(12),
  },
  headerTitle: {
    fontSize: scaleFont(20),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginTop: verticalScale(6),
  },
  profileBadgeBtn: {
    marginLeft: scale(2),
  },
  infoBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(14),
  },
  withdrawActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(50),
    borderRadius: scale(999),
    gap: scale(8),
    marginBottom: verticalScale(16),
  },
  withdrawActionBtnText: {
    color: '#FFFFFF',
    fontSize: scaleFont(15),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  activitiesWrapper: {
    marginBottom: verticalScale(20),
  },
});

export default ImpactWalletScreen;
