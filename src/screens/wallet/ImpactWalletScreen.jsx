import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import {
  AppText,
  AppButton,
  AppBadge,
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
import { WithdrawIcon } from '../../assets/vectors/ImpactIcons.jsx';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Dynamic Screen Background Gradients across tiers matching OneRx Figma screens
 */
const TIER_BACKGROUND_GRADIENTS = {
  general_trade: {
    light: ['#B0E7E1', '#99E1D6', '#C4EDE7', '#DBF4F1', '#D6F3EF', '#FFFFFF'],
    dark: ['#181E1E', '#141D1C', '#1C1D1F', '#212524', '#161616', '#010101'],
  },
  emerging: {
    light: ['#B0E7E1', '#99E1D6', '#C4EDE7', '#DBF4F1', '#D6F3EF', '#FFFFFF'],
    dark: ['#181E1E', '#141D1C', '#1C1D1F', '#212524', '#161616', '#010101'],
  },
  established: {
    light: ['#FEBA8B', '#FAA96A', '#FDAE75', '#FBDFCA', '#FEDCC3', '#FFFFFF'],
    dark: ['#211813', '#20150F', '#221B13', '#26221F', '#161616', '#010101'],
  },
  key_account: {
    light: ['#B0D7E8', '#9CCAE1', '#C6E2F0', '#D9EDF6', '#D6EAF3', '#FFFFFF'],
    dark: ['#181C1F', '#151A1E', '#191D1C', '#202425', '#161616', '#010101'],
  },
  senior: {
    light: ['#B0D7E8', '#9CCAE1', '#C6E2F0', '#D9EDF6', '#D6EAF3', '#FFFFFF'],
    dark: ['#181C1F', '#151A1E', '#191D1C', '#202425', '#161616', '#010101'],
  },
  flagship: {
    light: ['#F2DDFE', '#EFD2FE', '#EFDFF9', '#FAEDFF', '#FAEDFF', '#FFFFFF'],
    dark: ['#1F1D20', '#1D1B20', '#1F1D20', '#262427', '#161616', '#010101'],
  },
  distinguished: {
    light: ['#F2DDFE', '#EFD2FE', '#EFDFF9', '#FAEDFF', '#FAEDFF', '#FFFFFF'],
    dark: ['#1F1D20', '#1D1B20', '#1F1D20', '#262427', '#161616', '#010101'],
  },
};

/**
 * ImpactWalletScreen
 *
 * Pharmacy Impact Index (PII) & Financial Rewards screen:
 * - Dynamic tier background radiant glow
 * - ImpactHeroSection arc gauge
 * - Points & Earnings stat cards
 * - 3 Activity Pillars breakdown
 * - Complete payout withdrawal workflow
 */
export const ImpactWalletScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const pharmacy = usePharmacyStore();

  const currentTier = pharmacy.piiTier || 'key_account';
  const piiScore = pharmacy.piiScore || 620;

  // Background Gradient
  const bgGradients = useMemo(() => {
    const raw = String(currentTier).toLowerCase().replace(' ', '_');
    const tierMap = TIER_BACKGROUND_GRADIENTS[raw] || TIER_BACKGROUND_GRADIENTS.key_account;
    return isDark ? tierMap.dark : tierMap.light;
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
    <View style={styles.container}>
      <LinearGradient
        colors={bgGradients}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.95 }}
        style={styles.gradientBg}
      >
        {/* Top Header */}
        <View style={[styles.headerRow, { paddingTop: insets.top + verticalScale(8) }]}>
          <View>
            <AppText style={[styles.headerTitle, { color: colors.text.primary }]}>
              Impact Index & Wallet
            </AppText>
            <AppText style={[styles.headerSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Verified Pharmacy Performance
            </AppText>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PharmacyProfile')}
            style={styles.profileBadgeBtn}
          >
            <AppBadge label="Profile &gt;" variant="brand" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: verticalScale(100) }]}
        >
          {/* 1. Arc Gauge Hero Section */}
          <ImpactHeroSection
            tier={currentTier}
            score={piiScore}
            onPressScore={() => setIsScoreModalVisible(true)}
            onPressMilestone={() => setIsLevelUpModalVisible(true)}
          />

          {/* 2. Stat Cards Row: Points & Earnings */}
          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <ImpactStatCard
                title="POINTS EARNED"
                amount="12,450"
                suffix="pts"
                icon="points"
                onPress={() => navigation.navigate('PointsEarned')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ImpactStatCard
                title="TOTAL EARNINGS"
                amount="48,500"
                suffix="PKR"
                icon="earnings"
                onPress={() => navigation.navigate('Earnings')}
              />
            </View>
          </View>

          {/* 3. Withdraw Action Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsWithdrawModalVisible(true)}
            style={[
              styles.withdrawActionBtn,
              {
                backgroundColor: isDark
                  ? (colors.brand?.primary || '#009BA9')
                  : (colors.brand?.primaryDark || '#0F4761'),
              },
            ]}
          >
            <WithdrawIcon size={scale(18)} color="#FFFFFF" />
            <AppText style={styles.withdrawActionBtnText}>
              Withdraw Earnings Payout
            </AppText>
          </TouchableOpacity>

          {/* 4. 3 Activity Pillars */}
          <View style={styles.activitiesWrapper}>
            <PiiActivitiesCard piiScore={piiScore} />
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Modals Flow */}
      <ImpactScoreModal
        visible={isScoreModalVisible}
        onClose={() => setIsScoreModalVisible(false)}
        tier={currentTier}
        score={piiScore}
      />

      <TierLevelUpModal
        visible={isLevelUpModalVisible}
        onClose={() => setIsLevelUpModalVisible(false)}
        tier={currentTier}
      />

      <SelectWithdrawMethodModal
        visible={isWithdrawModalVisible}
        onClose={() => setIsWithdrawModalVisible(false)}
        onSelectMethod={handleSelectMethod}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBg: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(12),
  },
  headerTitle: {
    fontSize: scaleFont(20),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: scaleFont(12.5),
    fontFamily: fontFamilies.primaryRegular,
    marginTop: verticalScale(2),
  },
  profileBadgeBtn: {
    paddingVertical: verticalScale(4),
  },
  scrollContent: {
    paddingHorizontal: scale(20),
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
