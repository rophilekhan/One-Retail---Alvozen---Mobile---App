import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import {
  AppScreenContainer,
  AppText,
  GlassCard,
  AppBadge,
  AppButton,
  MetricIconDisc,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { PermissionGuard } from '../../components/common/PermissionGuard.jsx';

const TOP_BRANDS_TERRITORY = [
  { rank: '#1', name: 'Panadol 500mg', category: 'Analgesic', share: '24.2%', progress: 0.95 },
  { rank: '#2', name: 'Augmentin 625mg', category: 'Antibiotic', share: '18.7%', progress: 0.76 },
  { rank: '#3', name: 'Risek 20mg', category: 'Anti-Ulcerant', share: '14.5%', progress: 0.58 },
  { rank: '#4', name: 'Arinac Forte', category: 'Anti-Histamine', share: '9.8%', progress: 0.39 },
  { rank: '#5', name: 'Nexum 40mg', category: 'PPI Gastro', share: '7.6%', progress: 0.30 },
];

const WEEKLY_SCAN_TREND = [
  { day: 'M', scans: 28 },
  { day: 'T', scans: 34 },
  { day: 'W', scans: 31 },
  { day: 'T', scans: 42 },
  { day: 'F', scans: 39 },
  { day: 'S', scans: 45 },
  { day: 'S', scans: 38 },
];

/**
 * HomeDashboardScreen - OneRetail Main Dashboard
 * Mandated by ONERETAIL_PRD.md:
 * - Territory header (Default Territory / Karachi South Central)
 * - Prescriptions per day analytics
 * - Top Brands in Territory & Sales Share
 * - Territory Benchmarking
 * - Quick Action Buttons (Scan Rx, Trade Schemes, Distributor Connect, Impact & Wallet)
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const HomeDashboardScreen = ({ navigation }) => {
  const { colors, spacing, isDark } = useTheme();
  const pharmacy = usePharmacyStore();
  const user = useAuthStore((s) => s.user);

  const pharmacyName = pharmacy.name || user?.name || 'City Meds Pharmacy';
  const territoryName = pharmacy.territory?.name || 'Karachi South Central';
  const piiTier = pharmacy.piiTier || 'Key Account';

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true} withBottomNavClearance={true}>
      {/* Territory & Pharmacy Header */}
      <View style={styles.screenHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PharmacyProfile')}
          style={{ flex: 1 }}
          accessibilityRole="button"
          accessibilityLabel="View Pharmacy Profile"
        >
          <AppText variant="headlineMedium" colorType="primary" numberOfLines={1}>
            {pharmacyName}
          </AppText>
          <View style={styles.territoryRow}>
            <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                stroke={colors.brand?.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx="12" cy="9" r="2.5" fill={colors.brand?.primary} />
            </Svg>
            <AppText variant="caption" colorType="muted" style={{ marginLeft: 4 }}>
              Territory: {territoryName} • <AppText variant="caption" colorType="brand">Profile &gt;</AppText>
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PharmacyProfile')}
        >
          <AppBadge label={piiTier} variant="brand" />
        </TouchableOpacity>
      </View>

      {/* Prescriptions Today Analytics Card */}
      <GlassCard style={styles.metricCard}>
        <View style={styles.metricRow}>
          <MetricIconDisc variant="teal" size={50} marginRight={12}>
            <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 11l3 3L22 4"
                stroke={colors.text.inverse || '#FFFFFF'}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                stroke={colors.text.inverse || '#FFFFFF'}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </MetricIconDisc>

          <View style={{ flex: 1 }}>
            <AppText variant="caption" colorType="muted">Prescriptions Per Day</AppText>
            <AppText variant="headlineMedium" colorType="primary">
              38 <AppText variant="bodyMedium" colorType="brand">Rx Scanned</AppText>
            </AppText>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <AppBadge label="+14% vs yesterday" variant="success" />
            <AppText variant="caption" colorType="muted" style={{ marginTop: 4 }}>
              94.7% Dispensed
            </AppText>
          </View>
        </View>

        {/* 7-Day Mini Bar Trend */}
        <View style={styles.trendRow}>
          {WEEKLY_SCAN_TREND.map((item, idx) => (
            <View key={idx} style={styles.trendCol}>
              <View
                style={[
                  styles.trendBarTrack,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                ]}
              >
                <View
                  style={[
                    styles.trendBarFill,
                    {
                      height: `${(item.scans / 50) * 100}%`,
                      backgroundColor: idx === 6 ? colors.brand?.primary : colors.brand?.secondary,
                    },
                  ]}
                />
              </View>
              <AppText variant="caption" colorType={idx === 6 ? 'brand' : 'muted'} style={{ marginTop: 4 }}>
                {item.day}
              </AppText>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Prescription Scanning Quick Trigger */}
      <PermissionGuard
        permission="SCAN_QR_DEVICE"
        fallback={
          <GlassCard style={styles.metricCard}>
            <AppText variant="caption" colorType="muted">
              Device QR Scanning restricted for your staff role. Contact your Pharmacy Admin.
            </AppText>
          </GlassCard>
        }
      >
        <GlassCard style={styles.metricCard}>
          <View style={{ width: '100%' }}>
            <View style={styles.cardHeaderWithBadge}>
              <AppText variant="titleMedium" colorType="primary">Digital Prescription Scanning</AppText>
              <AppBadge label="+10 PII Pts" variant="accent" />
            </View>
            <AppText variant="caption" colorType="muted" style={{ marginVertical: 6 }}>
              Scan patient Rx QR to confirm dispense, check nearby pharmacy stocks & view alternate brands.
            </AppText>
            <AppButton
              variant="primary"
              size="md"
              title="Open QR Scanner (Camera / Plug-in)"
              onPress={() => navigation.navigate('QRScanner')}
            />
          </View>
        </GlassCard>
      </PermissionGuard>

      {/* Top Brands in Territory & Share of Sales */}
      <GlassCard style={styles.metricCard}>
        <View style={{ width: '100%' }}>
          <View style={styles.cardHeaderWithBadge}>
            <View>
              <AppText variant="titleMedium" colorType="primary">Top Brands in Territory</AppText>
              <AppText variant="caption" colorType="muted">
                Territory Market Share & Prescribed Frequency
              </AppText>
            </View>
            <AppBadge label={territoryName} variant="brand" />
          </View>

          <View style={{ marginTop: verticalScale(8) }}>
            {TOP_BRANDS_TERRITORY.map((item, idx) => (
              <View key={idx} style={[styles.brandItem, { borderBottomColor: colors.border?.subtle }]}>
                <AppText variant="bodyMediumMedium" colorType="brand" style={{ width: scale(28) }}>
                  {item.rank}
                </AppText>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={styles.brandTitleRow}>
                    <AppText variant="bodyMediumMedium" colorType="primary">{item.name}</AppText>
                    <AppText variant="bodyMediumMedium" colorType="primary">{item.share}</AppText>
                  </View>
                  <AppText variant="caption" colorType="muted">{item.category}</AppText>
                  <View
                    style={[
                      styles.shareProgressTrack,
                      { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                    ]}
                  >
                    <View
                      style={[
                        styles.shareProgressFill,
                        {
                          width: `${item.progress * 100}%`,
                          backgroundColor: colors.brand?.primary,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </GlassCard>

      {/* Territory Benchmarking */}
      <GlassCard style={styles.metricCard}>
        <View style={{ width: '100%' }}>
          <AppText variant="titleMedium" colorType="primary">Territory Benchmarking</AppText>
          <AppText variant="caption" colorType="muted" style={{ marginBottom: 10 }}>
            Performance comparison against peer pharmacies in {territoryName}
          </AppText>

          <View style={styles.benchmarkGrid}>
            <View style={[styles.benchmarkBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: colors.border?.subtle }]}>
              <AppText variant="caption" colorType="muted">Fulfillment Velocity</AppText>
              <AppText variant="titleMedium" colorType="primary" style={{ marginTop: 2 }}>Top 8%</AppText>
              <AppBadge label="Leader" variant="success" size="sm" style={{ marginTop: 4 }} />
            </View>

            <View style={[styles.benchmarkBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: colors.border?.subtle }]}>
              <AppText variant="caption" colorType="muted">Generic Substitution</AppText>
              <AppText variant="titleMedium" colorType="primary" style={{ marginTop: 2 }}>78%</AppText>
              <AppText variant="caption" colorType="muted" style={{ marginTop: 4 }}>vs 62% avg</AppText>
            </View>

            <View style={[styles.benchmarkBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: colors.border?.subtle }]}>
              <AppText variant="caption" colorType="muted">Stock Availability</AppText>
              <AppText variant="titleMedium" colorType="primary" style={{ marginTop: 2 }}>96.4%</AppText>
              <AppBadge label="Optimal" variant="brand" size="sm" style={{ marginTop: 4 }} />
            </View>
          </View>
        </View>
      </GlassCard>

      {/* Ecosystem Quick Actions Grid */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionGridItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('TradeSchemes')}
        >
          <GlassCard style={styles.actionCardInner}>
            <MetricIconDisc variant="purple" size={38} marginRight={8}>
              <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
                <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </MetricIconDisc>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMediumMedium" colorType="primary">Trade Schemes</AppText>
              <AppText variant="caption" colorType="muted">Discount slabs</AppText>
            </View>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionGridItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('DistributorConnect')}
        >
          <GlassCard style={styles.actionCardInner}>
            <MetricIconDisc variant="teal" size={38} marginRight={8}>
              <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
                <Path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h11a2 2 0 012 2v1" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M18 8h4a1 1 0 011 1v7a1 1 0 01-1 1h-4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </MetricIconDisc>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMediumMedium" colorType="primary">Distributor</AppText>
              <AppText variant="caption" colorType="muted">PO & Expiry</AppText>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </View>

      <View style={{ height: verticalScale(16) }} />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },
  territoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metricCard: {
    width: '100%',
    marginVertical: verticalScale(6),
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: verticalScale(14),
    paddingTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  trendCol: {
    alignItems: 'center',
    flex: 1,
  },
  trendBarTrack: {
    width: scale(14),
    height: verticalScale(44),
    borderRadius: scale(7),
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: scale(7),
  },
  cardHeaderWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(7),
    borderBottomWidth: 1,
  },
  brandTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareProgressTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  shareProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  benchmarkGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  benchmarkBox: {
    flex: 1,
    borderRadius: scale(12),
    borderWidth: 1,
    padding: scale(8),
    marginHorizontal: scale(3),
    alignItems: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(4),
  },
  actionGridItem: {
    flex: 1,
    marginHorizontal: scale(3),
  },
  actionCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
  },
});

export default HomeDashboardScreen;