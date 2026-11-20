import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  AppToast,
} from '../../components/core/index.js';
import { PiiScoreBreakdownCard } from '../../components/profile/index.js';
import { ImpactHeroSection, ImpactStatCard } from '../../components/wallet/index.js';
import { usePharmacyStore, PII_TIERS } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * PharmacyProfileScreen - Comprehensive Pharmacy Identity & Intelligence Profile
 * Mandated by ONERETAIL_PRD.md:
 * - Pharmacy Identity & Territory Badge
 * - Verified License cards with Expiry Alerts
 * - Façade Photo & Location Preview
 * - Composite PII Score Breakdown Card
 * - Staff Management Shortcut
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const PharmacyProfileScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const pharmacy = usePharmacyStore();
  const user = useAuthStore((s) => s.user);

  const pharmacyName = pharmacy.name || user?.name || 'City Meds Pharmacy';
  const address = pharmacy.address || 'Plot 42-B, Commercial Area, Block 6, PECHS, Karachi';
  const territoryName = pharmacy.territory?.name || 'PECHS / Tariq Road, Karachi';

  const dslNumber = pharmacy.dsl?.number || pharmacy.dslNumber || '05-42-01992';
  const dslExpiry = pharmacy.dsl?.expiryDate || pharmacy.dslExpiryDate || '2027-12-31';

  const lic1Number = pharmacy.furtherLicense1?.number || pharmacy.furtherLicense1Number || 'FL1-8841-KHI';
  const lic1Expiry = pharmacy.furtherLicense1?.expiryDate || pharmacy.furtherLicense1ExpiryDate || '2026-10-15';

  const piiScore = pharmacy.piiScore || 842;
  const piiTier = pharmacy.piiTier || PII_TIERS.KEY_ACCOUNT;

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
            <AppBadge label="Manage Staff" variant="brand" size="sm" />
          </TouchableOpacity>
        }
      />

      <View style={styles.contentWrap}>
        {/* 1. Identity & Territory Card */}
        <GlassCard style={styles.card}>
          <View style={styles.topIdentityRow}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.brand?.primary }]}>
              <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            <View style={styles.identityTextWrap}>
              <View style={styles.titleBadgeRow}>
                <AppText variant="headlineSmall" colorType="primary" style={styles.pharmacyTitle}>
                  {pharmacyName}
                </AppText>
              </View>
              <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                Retail Licensee ID: DRAP-PK-2024-911
              </AppText>
            </View>
          </View>

          {/* Territory Badge & Address */}
          <View style={[styles.territoryRow, { borderTopColor: colors.border?.subtle }]}>
            <View style={styles.territoryItem}>
              <AppText variant="caption" colorType="muted">
                COMMERCIAL TERRITORY
              </AppText>
              <AppText variant="bodySmallMedium" colorType="brand" style={{ marginTop: 2 }}>
                {territoryName}
              </AppText>
            </View>
            <AppBadge label="Verified Trade" variant="success" size="sm" />
          </View>

          <View style={styles.addressBox}>
            <AppText variant="caption" colorType="muted">
              STORE LOCATION
            </AppText>
            <AppText variant="bodySmall" colorType="primary" style={{ marginTop: 2 }}>
              {address}
            </AppText>
          </View>
        </GlassCard>

        {/* 2. Pharmacy Impact Index (PII) Arc Gauge & Stats */}
        <ImpactHeroSection
          tier={piiTier}
          score={piiScore}
          onPressScore={() => navigation.navigate('ImpactWallet')}
          onPressMilestone={() => navigation.navigate('ImpactWallet')}
        />

        <View style={styles.profileStatsRow}>
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

        {/* 3. Pharmacy Impact Index (PII) Drivers Breakdown */}
        <PiiScoreBreakdownCard score={piiScore} tier={piiTier} />

        {/* 3. Verified Regulatory Licenses */}
        <GlassCard style={styles.card}>
          <View style={styles.licenseHeaderRow}>
            <AppText variant="titleMedium" colorType="primary">
              Regulatory Licenses
            </AppText>
            <AppBadge label="DRAP Verified" variant="brand" size="sm" />
          </View>

          {/* DSL Item */}
          <View style={[styles.licenseItem, { borderColor: colors.border?.subtle }]}>
            <View style={styles.licenseLeft}>
              <AppText variant="bodyMediumMedium" colorType="primary">
                Drug Sale License (DSL)
              </AppText>
              <AppText variant="caption" colorType="muted">
                No: {dslNumber} • Expires: {dslExpiry}
              </AppText>
            </View>
            <AppBadge label="Valid" variant="success" size="sm" />
          </View>

          {/* Further License 1 Item */}
          <View style={[styles.licenseItem, { borderColor: colors.border?.subtle }]}>
            <View style={styles.licenseLeft}>
              <AppText variant="bodyMediumMedium" colorType="primary">
                Further License – 1 (Biologicals)
              </AppText>
              <AppText variant="caption" colorType="muted">
                No: {lic1Number} • Expires: {lic1Expiry}
              </AppText>
            </View>
            <AppBadge label="Valid" variant="success" size="sm" />
          </View>
        </GlassCard>

        {/* 4. Façade Picture & Shopfront Preview */}
        <GlassCard style={styles.card}>
          <View style={styles.facadeHeader}>
            <AppText variant="titleMedium" colorType="primary">
              Store Façade
            </AppText>
            <AppBadge label="Active Shopfront" variant="brand" size="sm" />
          </View>

          <View
            style={[
              styles.facadePreview,
              {
                backgroundColor: isDark ? 'rgba(0, 155, 169, 0.08)' : 'rgba(0, 155, 169, 0.04)',
                borderColor: colors.border?.subtle,
              },
            ]}
          >
            <Svg width={scale(32)} height={scale(32)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                stroke={colors.brand?.primary || '#009BA9'}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <Path d="M9 22V12h6v10" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="1.8" />
            </Svg>
            <AppText variant="bodySmallMedium" colorType="primary" style={{ marginTop: 8 }}>
              Storefront Verification Approved
            </AppText>
            <AppText variant="caption" colorType="muted">
              Attached: facade_pechs_main.jpg
            </AppText>
          </View>
        </GlassCard>

        <View style={{ height: verticalScale(14) }} />

        {/* Staff Management CTA */}
        <AppButton
          variant="secondary"
          title="Manage Staff Hierarchy & Permissions"
          onPress={() => navigation.navigate('StaffList')}
        />
      </View>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentWrap: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(36),
  },
  headerRightBtn: {
    padding: scale(4),
  },
  card: {
    padding: scale(16),
    marginBottom: verticalScale(14),
  },
  profileStatsRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginVertical: verticalScale(10),
  },
  topIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  avatarCircle: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  identityTextWrap: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pharmacyTitle: {
    letterSpacing: -0.5,
  },
  territoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  territoryItem: {
    flex: 1,
  },
  addressBox: {
    marginTop: verticalScale(2),
  },
  licenseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  licenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(10),
    borderRadius: scale(10),
    borderWidth: 1,
    marginBottom: verticalScale(8),
  },
  licenseLeft: {
    flex: 1,
    paddingRight: scale(8),
  },
  facadeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  facadePreview: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(20),
    borderRadius: scale(12),
    borderWidth: 1,
  },
});

export default PharmacyProfileScreen;
