import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  MetricIconDisc,
  AppToast,
} from '../../components/core/index.js';
import { usePharmacyStore, PII_TIERS } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * PharmacyProfileScreen - Comprehensive Pharmacy Profile & PII Intelligence
 * Mandated by ONERETAIL_PRD.md:
 * - DSL Number, Expiry, Document Picture status
 * - Further Licenses 1 & 2 Number, Expiry, Picture status
 * - Pharmacy Address + GPS Location Pin
 * - Pharmacy Façade preview
 * - Pharmacy Impact Index (PII) score + 3 Drivers breakdown
 * - Earnings Dashboard + Cashout CTA
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const PharmacyProfileScreen = ({ navigation }) => {
  const { colors, spacing, isDark } = useTheme();
  const pharmacy = usePharmacyStore();
  const user = useAuthStore((s) => s.user);

  const pharmacyName = pharmacy.name || user?.name || 'City Meds Pharmacy';
  const address = pharmacy.address || 'Plot 42-B, Commercial Area, Block 6, PECHS, Karachi';
  const piiScore = pharmacy.piiScore || 842;
  const piiTier = pharmacy.piiTier || PII_TIERS.KEY_ACCOUNT;
  const walletBalance = pharmacy.walletBalance || 48500;
  const pendingCashout = pharmacy.pendingCashout || 12000;

  const handleCashout = () => {
    AppToast.show({
      title: 'Cashout Request Submitted',
      message: `Withdrawal request for PKR ${walletBalance.toLocaleString()} initiated. Tax documentation generated.`,
      type: 'success',
    });
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true}>
      <AppHeader
        title="Pharmacy Profile"
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('StaffList')}
            style={styles.headerRightBtn}
            accessibilityRole="button"
            accessibilityLabel="Staff Management"
          >
            <AppBadge label="Staff" variant="brand" />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Top Summary Card */}
        <GlassCard style={styles.card}>
          <View style={styles.topInfoRow}>
            <MetricIconDisc variant="teal" size={54} marginRight={14}>
              <Svg width={scale(26)} height={scale(26)} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-4a1 1 0 011-1h2a1 1 0 011 1v4"
                  stroke={colors.text.inverse || '#FFFFFF'}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </MetricIconDisc>

            <View style={{ flex: 1 }}>
              <AppText variant="titleLarge" colorType="primary" numberOfLines={1}>
                {pharmacyName}
              </AppText>
              <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                Territory: {pharmacy.territory?.name || 'Karachi South Central'}
              </AppText>
              <View style={styles.badgeRow}>
                <AppBadge label={`Tier: ${piiTier}`} variant="brand" />
                <View style={{ width: 6 }} />
                <AppBadge
                  label={pharmacy.skuVisibilityEnabled ? 'SKU Visible' : 'SKU Private'}
                  variant={pharmacy.skuVisibilityEnabled ? 'success' : 'muted'}
                />
              </View>
            </View>
          </View>

          {/* Façade & Location Banner */}
          <View
            style={[
              styles.locationBanner,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.03)',
                borderColor: colors.border.subtle,
              },
            ]}
          >
            <View style={styles.bannerRow}>
              <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  stroke={colors.brand.primary}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle cx="12" cy="9" r="2.5" stroke={colors.brand.primary} strokeWidth="1.5" />
              </Svg>
              <View style={{ flex: 1, marginLeft: scale(8) }}>
                <AppText variant="bodySmall" colorType="primary" numberOfLines={2}>
                  {address}
                </AppText>
                <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                  GPS: 24.8607° N, 67.0011° E • Façade Photo Verified
                </AppText>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Pharmacy Impact Index (PII) Intelligence Card */}
        <GlassCard style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <AppText variant="titleMedium" colorType="primary">
                Pharmacy Impact Index (PII)
              </AppText>
              <AppText variant="caption" colorType="muted">
                Platform benchmarking score & performance tier
              </AppText>
            </View>
            <AppBadge label={piiTier} variant="accent" />
          </View>

          <View style={styles.scoreRow}>
            <MetricIconDisc variant="gold" size={48} marginRight={12}>
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
            <View>
              <AppText variant="headlineMedium" colorType="primary">
                {piiScore} <AppText variant="bodyMedium" colorType="brand">pts</AppText>
              </AppText>
              <AppText variant="caption" colorType="muted">
                Top 8% in Karachi South territory
              </AppText>
            </View>
          </View>

          {/* 3 PRD Mandated Score Drivers */}
          <View style={styles.driverList}>
            <View
              style={[
                styles.driverItem,
                { borderBottomColor: colors.border.subtle },
              ]}
            >
              <View style={{ flex: 1 }}>
                <AppText variant="bodyMediumMedium" colorType="primary">
                  Digital Prescription QR Scanning
                </AppText>
                <AppText variant="caption" colorType="muted">
                  Scanned Rx QR codes & confirmed dispenses
                </AppText>
              </View>
              <AppBadge label="+340 pts" variant="success" />
            </View>

            <View
              style={[
                styles.driverItem,
                { borderBottomColor: colors.border.subtle },
              ]}
            >
              <View style={{ flex: 1 }}>
                <AppText variant="bodyMediumMedium" colorType="primary">
                  Data Sharing with Pharma
                </AppText>
                <AppText variant="caption" colorType="muted">
                  Daily closing & stock availability sharing
                </AppText>
              </View>
              <AppBadge label="+280 pts" variant="success" />
            </View>

            <View style={styles.driverItem}>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyMediumMedium" colorType="primary">
                  Digital Pharma Engagement
                </AppText>
                <AppText variant="caption" colorType="muted">
                  Trade schemes participation & surveys
                </AppText>
              </View>
              <AppBadge label="+222 pts" variant="success" />
            </View>
          </View>
        </GlassCard>

        {/* Financial Incentive Dashboard & Cashout */}
        <GlassCard style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <AppText variant="titleMedium" colorType="primary">
                Earnings & Wallet
              </AppText>
              <AppText variant="caption" colorType="muted">
                Real-time financial incentives across all activities
              </AppText>
            </View>
            <MetricIconDisc variant="teal" size={36}>
              <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                  stroke={colors.text.inverse || '#FFFFFF'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </MetricIconDisc>
          </View>

          <View style={styles.walletRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="caption" colorType="muted">Available Balance</AppText>
              <AppText variant="titleLarge" colorType="primary">
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

          <View style={{ height: spacing.sm }} />
          <AppButton
            variant="accent"
            size="md"
            title="Cashout via EasyPaisa / Bank"
            onPress={handleCashout}
          />
        </GlassCard>

        {/* Regulatory Licenses Compliance Section */}
        <GlassCard style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <AppText variant="titleMedium" colorType="primary">
                Regulatory Licenses
              </AppText>
              <AppText variant="caption" colorType="muted">
                Drug Sale License (DSL) & Further Licenses
              </AppText>
            </View>
            <AppBadge label="Compliant" variant="success" />
          </View>

          {/* DSL License */}
          <View
            style={[
              styles.licenseBlock,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)',
                borderColor: colors.border.subtle,
              },
            ]}
          >
            <View style={styles.licenseRow}>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyMediumMedium" colorType="primary">
                  Drug Sale License (DSL)
                </AppText>
                <AppText variant="caption" colorType="brand">
                  {pharmacy.dslNumber || 'DSL-KHI-49201'}
                </AppText>
                <AppText variant="caption" colorType="muted">
                  Expiry: {pharmacy.dslExpiryDate || '2027-12-31'}
                </AppText>
              </View>
              <AppBadge label="Verified" variant="success" />
            </View>
          </View>

          {/* Further License 1 */}
          <View
            style={[
              styles.licenseBlock,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)',
                borderColor: colors.border.subtle,
              },
            ]}
          >
            <View style={styles.licenseRow}>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyMediumMedium" colorType="primary">
                  Further License 1
                </AppText>
                <AppText variant="caption" colorType="brand">
                  {pharmacy.furtherLicense1 || 'FL1-DRAP-8812'}
                </AppText>
                <AppText variant="caption" colorType="muted">
                  Expiry: {pharmacy.furtherLicense1ExpiryDate || '2028-06-30'}
                </AppText>
              </View>
              <AppBadge label="Active" variant="brand" />
            </View>
          </View>

          {/* Further License 2 */}
          <View
            style={[
              styles.licenseBlock,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)',
                borderColor: colors.border.subtle,
              },
            ]}
          >
            <View style={styles.licenseRow}>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyMediumMedium" colorType="primary">
                  Further License 2
                </AppText>
                <AppText variant="caption" colorType="muted">
                  {pharmacy.furtherLicense2 ? pharmacy.furtherLicense2 : 'Not registered (Optional)'}
                </AppText>
                {pharmacy.furtherLicense2ExpiryDate ? (
                  <AppText variant="caption" colorType="muted">
                    Expiry: {pharmacy.furtherLicense2ExpiryDate}
                  </AppText>
                ) : null}
              </View>
              <AppBadge
                label={pharmacy.furtherLicense2 ? 'Active' : 'Optional'}
                variant={pharmacy.furtherLicense2 ? 'brand' : 'muted'}
              />
            </View>
          </View>
        </GlassCard>

        {/* Staff Profiles Management CTA */}
        <GlassCard style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <AppText variant="titleMedium" colorType="primary">
                Staff Hierarchy & Permissions
              </AppText>
              <AppText variant="caption" colorType="muted">
                Admin controls for staff logins and RBAC access
              </AppText>
            </View>
          </View>

          <AppButton
            variant="secondary"
            size="md"
            title="Manage Staff Profiles"
            onPress={() => navigation.navigate('StaffList')}
          />
        </GlassCard>

        <View style={{ height: verticalScale(20) }} />
      </View>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: verticalScale(12),
  },
  headerRightBtn: {
    paddingHorizontal: scale(4),
  },
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(6),
  },
  locationBanner: {
    width: '100%',
    borderRadius: scale(12),
    borderWidth: 1,
    padding: scale(10),
    marginTop: verticalScale(12),
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  driverList: {
    width: '100%',
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: verticalScale(8),
  },
  licenseBlock: {
    width: '100%',
    borderRadius: scale(12),
    borderWidth: 1,
    padding: scale(10),
    marginVertical: verticalScale(4),
  },
  licenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default PharmacyProfileScreen;