import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  AppModal,
  AppInput,
  AppToast,
  MetricIconDisc,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { usePharmacyStore, PII_TIERS } from '../../store/usePharmacyStore.js';

const TIER_THRESHOLDS = [
  { tier: 'General Trade', min: 0, max: 299, badge: 'muted' },
  { tier: 'Established', min: 300, max: 599, badge: 'brand' },
  { tier: 'Key Account', min: 600, max: 899, badge: 'accent' },
  { tier: 'Flagship', min: 900, max: 1500, badge: 'success' },
];

const PRESET_AMOUNTS = [5000, 10000, 25000, 48500];

/**
 * ImpactWalletScreen - Pharmacy Impact Index & Financial Incentives
 * Mandated by ONERETAIL_PRD.md:
 * - Tiers: General Trade, Established, Key Account, Flagship
 * - PII points & real-time earnings split across QR Scans, Pharma Data Sharing & Digital Engagement
 * - Cashout modal for EasyPaisa, JazzCash, and Bank with tax documentation
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const ImpactWalletScreen = ({ navigation }) => {
  const { colors, spacing, isDark } = useTheme();
  const pharmacy = usePharmacyStore();

  const piiScore = pharmacy.piiScore || 842;
  const piiTier = pharmacy.piiTier || 'Key Account';
  const walletBalance = pharmacy.walletBalance || 48500;
  const pendingCashout = pharmacy.pendingCashout || 12000;

  // Cashout Modal State
  const [cashoutModalVisible, setCashoutModalVisible] = useState(false);
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
      setCashoutModalVisible(false);
      AppToast.show({
        title: 'Cashout Request Submitted',
        message: `PKR ${amt.toLocaleString()} withdrawal queued via ${cashoutChannel}. Tax documentation generated.`,
        type: 'success',
      });
    }, 700);
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true} withBottomNavClearance={true}>
      <AppHeader
        title="Impact Index & Wallet"
        onBack={() => navigation.goBack()}
        showBack={true}
        rightElement={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PharmacyProfile')}
          >
            <AppBadge label="Profile &gt;" variant="brand" />
          </TouchableOpacity>
        }
      />

      {/* 1. PII Tier Status Card */}
      <GlassCard style={styles.card}>
        <View style={styles.tierHeaderRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" colorType="muted">Current Tier Status</AppText>
            <AppText variant="headlineMedium" colorType="primary">
              {piiTier}
            </AppText>
          </View>
          <MetricIconDisc variant="gold" size={48}>
            <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke={colors.text.inverse || '#FFFFFF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </MetricIconDisc>
        </View>

        {/* Tier Hierarchy Progress */}
        <View style={styles.tierBarWrap}>
          {TIER_THRESHOLDS.map((t, idx) => {
            const isCurrent = piiScore >= t.min && piiScore <= t.max;
            const isPassed = piiScore > t.max;

            return (
              <View key={idx} style={styles.tierSegment}>
                <View
                  style={[
                    styles.segmentLine,
                    {
                      backgroundColor: isPassed
                        ? colors.brand?.primary
                        : isCurrent
                        ? colors.brand?.accent
                        : isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  ]}
                />
                <AppText
                  variant="caption"
                  colorType={isCurrent ? 'accent' : isPassed ? 'brand' : 'muted'}
                  style={{ marginTop: 4, fontWeight: isCurrent ? '700' : '400', fontSize: scale(10) }}
                  numberOfLines={1}
                >
                  {t.tier}
                </AppText>
              </View>
            );
          })}
        </View>
      </GlassCard>

      {/* 2. PII Points Breakdown (PRD 3 Activities) */}
      <GlassCard style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <AppText variant="titleMedium" colorType="primary">
              PII Points System ({piiScore} pts)
            </AppText>
            <AppText variant="caption" colorType="muted">
              Composite platform score earned across 3 core activities
            </AppText>
          </View>
          <AppBadge label="Top 8% Peer Tier" variant="success" />
        </View>

        {/* Driver 1: Digital Prescription QR Scans */}
        <View style={[styles.activityRow, { borderBottomColor: colors.border?.subtle }]}>
          <MetricIconDisc variant="teal" size={36} marginRight={10}>
            <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
              <Path d="M9 11l3 3L22 4" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </MetricIconDisc>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyMediumMedium" colorType="primary">Digital Prescription QR Scans</AppText>
            <AppText variant="caption" colorType="muted">34 Scans confirmed this month</AppText>
          </View>
          <AppBadge label="+340 Pts" variant="brand" />
        </View>

        {/* Driver 2: Data Sharing with Pharma */}
        <View style={[styles.activityRow, { borderBottomColor: colors.border?.subtle }]}>
          <MetricIconDisc variant="purple" size={36} marginRight={10}>
            <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
              <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M16 6l-4-4-4 4" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 2v13" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </MetricIconDisc>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyMediumMedium" colorType="primary">Data Sharing with Pharma</AppText>
            <AppText variant="caption" colorType="muted">28 Consecutive days closing sync</AppText>
          </View>
          <AppBadge label="+280 Pts" variant="brand" />
        </View>

        {/* Driver 3: Digital Pharma Engagement */}
        <View style={styles.activityRow}>
          <MetricIconDisc variant="gold" size={36} marginRight={10}>
            <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </MetricIconDisc>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyMediumMedium" colorType="primary">Digital Pharma Engagement</AppText>
            <AppText variant="caption" colorType="muted">8 Surveys & clinical modules completed</AppText>
          </View>
          <AppBadge label="+222 Pts" variant="brand" />
        </View>
      </GlassCard>

      {/* 3. Real-Time Earnings Dashboard (Financial Incentive System) */}
      <GlassCard style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <AppText variant="titleMedium" colorType="primary">
              Financial Incentive Earnings
            </AppText>
            <AppText variant="caption" colorType="muted">
              Live accrued rewards with tax documentation
            </AppText>
          </View>
        </View>

        {/* Total Wallet & Pending */}
        <View style={styles.walletMetricsRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" colorType="muted">Available to Cashout</AppText>
            <AppText variant="headlineMedium" colorType="primary">
              PKR {walletBalance.toLocaleString()}
            </AppText>
          </View>

          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <AppText variant="caption" colorType="muted">Pending Clearance</AppText>
            <AppText variant="titleLarge" colorType="accent">
              PKR {pendingCashout.toLocaleString()}
            </AppText>
          </View>
        </View>

        {/* Earnings Split Across 3 Activities (PRD Mandated) */}
        <View style={[styles.earningsSplitBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)' }]}>
          <View style={styles.splitRow}>
            <AppText variant="bodySmall" colorType="muted">Rx Scans Earnings:</AppText>
            <AppText variant="bodySmallMedium" colorType="primary">PKR 24,500</AppText>
          </View>
          <View style={styles.splitRow}>
            <AppText variant="bodySmall" colorType="muted">Pharma Data Sharing:</AppText>
            <AppText variant="bodySmallMedium" colorType="primary">PKR 14,000</AppText>
          </View>
          <View style={styles.splitRow}>
            <AppText variant="bodySmall" colorType="muted">Pharma Engagement:</AppText>
            <AppText variant="bodySmallMedium" colorType="primary">PKR 10,000</AppText>
          </View>
        </View>

        <View style={{ height: spacing.sm }} />

        {/* Cashout CTA Button */}
        <AppButton
          variant="accent"
          title="Cashout via EasyPaisa / Bank"
          onPress={() => setCashoutModalVisible(true)}
        />
      </GlassCard>

      <View style={{ height: verticalScale(20) }} />

      {/* 4. Cashout Redemption Modal */}
      <AppModal
        visible={cashoutModalVisible}
        type="bottomSheet"
        title="Redeem Earnings"
        scrollable={true}
        onClose={() => setCashoutModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <AppText variant="caption" colorType="muted" style={{ marginBottom: 12 }}>
            Withdraw earnings instantly with FBR-compliant Withholding Tax (WHT) documentation.
          </AppText>

          {/* Channel Selector: EasyPaisa | JazzCash | Bank */}
          <View style={styles.channelRow}>
            {[
              { id: 'EASYPAISA', label: 'EasyPaisa' },
              { id: 'JAZZCASH', label: 'JazzCash' },
              { id: 'BANK', label: 'Bank Transfer' },
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
                <AppText
                  variant="caption"
                  colorType={cashoutChannel === ch.id ? 'inverse' : 'primary'}
                  style={{ fontWeight: cashoutChannel === ch.id ? '700' : '400' }}
                >
                  {ch.label}
                </AppText>
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
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  tierHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  tierBarWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(6),
  },
  tierSegment: {
    flex: 1,
    marginHorizontal: scale(2),
    alignItems: 'center',
  },
  segmentLine: {
    width: '100%',
    height: 6,
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
  },
  walletMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(6),
  },
  earningsSplitBox: {
    padding: scale(10),
    borderRadius: scale(10),
    marginVertical: verticalScale(8),
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
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

export default ImpactWalletScreen;