import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppButton } from '../core/index.js';

/**
 * WalletEarningsCard - Financial Incentives & Cashout Trigger
 *
 * @param {Object} props
 * @param {number} props.walletBalance
 * @param {number} props.pendingCashout
 * @param {Function} props.onOpenCashout
 */
export const WalletEarningsCard = ({
  walletBalance = 48500,
  pendingCashout = 12000,
  onOpenCashout,
}) => {
  const { isDark, spacing } = useTheme();

  return (
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
          <AppText variant="headlineMedium" isMono colorType="primary">
            PKR {walletBalance.toLocaleString()}
          </AppText>
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <AppText variant="caption" colorType="muted">Pending Clearance</AppText>
          <AppText variant="titleLarge" isMono colorType="accent">
            PKR {pendingCashout.toLocaleString()}
          </AppText>
        </View>
      </View>

      {/* Earnings Split Across 3 Activities (PRD Mandated) */}
      <View style={[styles.earningsSplitBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)' }]}>
        <View style={styles.splitRow}>
          <AppText variant="bodySmall" colorType="muted">Rx Scans Earnings:</AppText>
          <AppText variant="bodySmallMedium" isMono colorType="primary">PKR 24,500</AppText>
        </View>
        <View style={styles.splitRow}>
          <AppText variant="bodySmall" colorType="muted">Pharma Data Sharing:</AppText>
          <AppText variant="bodySmallMedium" isMono colorType="primary">PKR 14,000</AppText>
        </View>
        <View style={styles.splitRow}>
          <AppText variant="bodySmall" colorType="muted">Pharma Engagement:</AppText>
          <AppText variant="bodySmallMedium" isMono colorType="primary">PKR 10,000</AppText>
        </View>
      </View>

      <View style={{ height: spacing.sm }} />

      {/* Cashout CTA Button */}
      <AppButton
        variant="accent"
        title="Cashout via EasyPaisa / Bank"
        onPress={onOpenCashout}
      />
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
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
});

export default WalletEarningsCard;
