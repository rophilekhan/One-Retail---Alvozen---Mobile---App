import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  MetricIconDisc,
} from '../../components/core/index.js';
import { PiiScoreBreakdownCard } from '../../components/profile/index.js';
import { IdCardOutlineIcon } from '../../assets/vectors/index.js';
import { usePharmacyStore, PII_TIERS } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * PharmacyProfileScreen - De-Cluttered, Structured Pharmacy Intelligence & Identity Profile
 * 4 Mandated Cards:
 * 1. Storefront & Identity Card (Façade 64x64, titleLarge, Territory pill, 2-col metadata strip)
 * 2. Composite PII Breakdown Card (Score in DMMono-Medium, active Tier badge + Tier Gem SVG, 3 vertical progress rows)
 * 3. Regulatory Drug Licenses Card (Title, Edit pill, 3 rows: DSL, Further License 1, Further License 2 with MetricIconDisc + IdCardOutlineIcon)
 * 4. Store Location & Coordinates Card (Street address numberOfLines={3}, DMMono GPS coordinates, View on Map row)
 */
export const PharmacyProfileScreen = ({ navigation }) => {
  const { colors, isDark, radii, spacing } = useTheme();
  const pharmacy = usePharmacyStore();
  const user = useAuthStore((s) => s.user);

  const pharmacyName = pharmacy.name || user?.name || 'City Meds Pharmacy';
  const address = pharmacy.address || 'Plot 42-B, Commercial Area, Block 6, PECHS, Karachi';
  const territoryName = pharmacy.territory?.name || 'PECHS / Tariq Road, Karachi';
  const ownerUsername = user?.username || pharmacy.ownerUsername || 'dr.shahzad_rx';

  // License data
  const dslNumber = pharmacy.dsl?.number || pharmacy.dslNumber || '05-42-01992';
  const dslExpiry = pharmacy.dsl?.expiryDate || pharmacy.dslExpiryDate || '31 Dec 2027';

  const lic1Number = pharmacy.furtherLicense1?.number || pharmacy.furtherLicense1Number || 'FL1-8841-KHI';
  const lic1Expiry = pharmacy.furtherLicense1?.expiryDate || pharmacy.furtherLicense1ExpiryDate || '15 Oct 2026';

  const lic2Number = pharmacy.furtherLicense2?.number || pharmacy.furtherLicense2Number || 'FL2-9902-KHI';
  const lic2Expiry = pharmacy.furtherLicense2?.expiryDate || pharmacy.furtherLicense2ExpiryDate || '28 Feb 2027';

  // Coordinates
  const lat = pharmacy.locationPin?.latitude ?? '24.8615° N';
  const lng = pharmacy.locationPin?.longitude ?? '67.0734° E';
  const coordsFormatted = typeof lat === 'number'
    ? `${lat.toFixed(4)}° N, ${Number(lng).toFixed(4)}° E`
    : `${lat}, ${lng}`;

  const piiScore = pharmacy.piiPoints || pharmacy.piiScore || 842;
  const piiTier = pharmacy.piiTierKey || pharmacy.piiTier || PII_TIERS.KEY_ACCOUNT;

  return (
    <AppScreenContainer
      scrollable={true}
      withAmbientGlow={true}
      contentContainerStyle={styles.containerContent}
    >
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
        {/* ── CARD 1: Storefront & Identity Card ────────────────────── */}
        <GlassCard style={styles.card}>
          <View style={styles.topIdentityRow}>
            {pharmacy.facadePhotoUri ? (
              <Image
                source={{ uri: pharmacy.facadePhotoUri }}
                style={[styles.facadeThumb, { borderRadius: radii?.lg || scale(14) }]}
              />
            ) : (
              <View
                style={[
                  styles.facadeThumbPlaceholder,
                  {
                    borderRadius: radii?.lg || scale(14),
                    backgroundColor: isDark ? 'rgba(0, 155, 169, 0.12)' : 'rgba(0, 155, 169, 0.08)',
                  },
                ]}
              >
                <Svg width={scale(28)} height={scale(28)} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"
                    stroke={colors.brand?.primary || '#009BA9'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M9 10h1M9 14h1M9 18h1"
                    stroke={colors.brand?.primary || '#009BA9'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </Svg>
              </View>
            )}

            <View style={styles.identityDetails}>
              <AppText
                variant="titleLarge"
                colorType="primary"
                numberOfLines={2}
                style={styles.pharmacyName}
              >
                {pharmacyName}
              </AppText>
              <View style={styles.territoryPillRow}>
                <AppBadge label={territoryName} variant="brand" size="sm" />
              </View>
            </View>
          </View>

          {/* 2-Column Metadata Strip */}
          <View
            style={[
              styles.metaStrip,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.025)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              },
            ]}
          >
            <View style={styles.metaCol}>
              <AppText variant="caption" colorType="muted" style={styles.metaLabel}>
                ADMIN / OWNER
              </AppText>
              <AppText
                style={[
                  styles.metaValue,
                  { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                ]}
                numberOfLines={1}
              >
                {ownerUsername.startsWith('@') ? ownerUsername : `@${ownerUsername}`}
              </AppText>
            </View>

            <View style={[styles.metaDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }]} />

            <View style={styles.metaCol}>
              <AppText variant="caption" colorType="muted" style={styles.metaLabel}>
                SYSTEM STATUS
              </AppText>
              <View style={styles.statusPillWrap}>
                <View style={styles.greenStatusDot} />
                <AppText
                  style={[
                    styles.metaValue,
                    { color: colors.brand?.primary || '#009BA9', fontFamily: fontFamilies.primaryBold },
                  ]}
                >
                  Verified POS
                </AppText>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* ── CARD 2: Composite PII Score Breakdown Card ────────────── */}
        <PiiScoreBreakdownCard score={piiScore} tier={piiTier} />

        {/* ── CARD 3: Regulatory Drug Licenses Card ─────────────────── */}
        <GlassCard style={styles.card}>
          <View style={styles.licenseHeaderRow}>
            <View>
              <AppText variant="caption" colorType="brand" style={styles.overline}>
                STATUTORY COMPLIANCE
              </AppText>
              <AppText variant="titleMedium" colorType="primary" style={styles.sectionTitle}>
                Regulatory Drug Licenses
              </AppText>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('PharmacyLicenses')}
              style={styles.editPillBtn}
              accessibilityRole="button"
              accessibilityLabel="Edit Drug Licenses"
            >
              <AppBadge label="Edit" variant="brand" size="sm" />
            </TouchableOpacity>
          </View>

          {/* 3 Vertical License Rows */}
          <View style={styles.licensesList}>
            {/* 1. DSL Row */}
            <View style={styles.licenseRow}>
              <MetricIconDisc size={36} isDark={isDark} variant="teal" style={styles.licenseIconDisc}>
                <IdCardOutlineIcon size={scale(18)} color={colors.brand?.primary || '#009BA9'} />
              </MetricIconDisc>

              <View style={styles.licenseTextCol}>
                <View style={styles.licenseTitleBadgeRow}>
                  <AppText
                    style={[
                      styles.licenseTitle,
                      { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                    ]}
                  >
                    Drug Sale License (DSL)
                  </AppText>
                  <AppBadge label="Valid" variant="success" size="sm" />
                </View>
                <AppText
                  style={[
                    styles.licenseNumber,
                    { color: colors.text.primary, fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
                  ]}
                >
                  {dslNumber}
                </AppText>
                <AppText
                  style={[
                    styles.licenseExpiry,
                    { color: isDark ? '#94A3B8' : '#64748B', fontFamily: fontFamilies.monoRegular || 'DMMono-Regular' },
                  ]}
                >
                  Expires: {dslExpiry}
                </AppText>
              </View>
            </View>

            <View style={[styles.rowDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }]} />

            {/* 2. Further License 1 Row */}
            <View style={styles.licenseRow}>
              <MetricIconDisc size={36} isDark={isDark} variant="purple" style={styles.licenseIconDisc}>
                <IdCardOutlineIcon size={scale(18)} color="#A855F7" />
              </MetricIconDisc>

              <View style={styles.licenseTextCol}>
                <View style={styles.licenseTitleBadgeRow}>
                  <AppText
                    style={[
                      styles.licenseTitle,
                      { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                    ]}
                  >
                    Further License – 1 (Biologicals)
                  </AppText>
                  <AppBadge label="Valid" variant="success" size="sm" />
                </View>
                <AppText
                  style={[
                    styles.licenseNumber,
                    { color: colors.text.primary, fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
                  ]}
                >
                  {lic1Number}
                </AppText>
                <AppText
                  style={[
                    styles.licenseExpiry,
                    { color: isDark ? '#94A3B8' : '#64748B', fontFamily: fontFamilies.monoRegular || 'DMMono-Regular' },
                  ]}
                >
                  Expires: {lic1Expiry}
                </AppText>
              </View>
            </View>

            <View style={[styles.rowDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }]} />

            {/* 3. Further License 2 Row */}
            <View style={styles.licenseRow}>
              <MetricIconDisc size={36} isDark={isDark} variant="gold" style={styles.licenseIconDisc}>
                <IdCardOutlineIcon size={scale(18)} color="#F59E0B" />
              </MetricIconDisc>

              <View style={styles.licenseTextCol}>
                <View style={styles.licenseTitleBadgeRow}>
                  <AppText
                    style={[
                      styles.licenseTitle,
                      { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                    ]}
                  >
                    Further License – 2 (Narcotics)
                  </AppText>
                  <AppBadge label="Valid" variant="success" size="sm" />
                </View>
                <AppText
                  style={[
                    styles.licenseNumber,
                    { color: colors.text.primary, fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
                  ]}
                >
                  {lic2Number}
                </AppText>
                <AppText
                  style={[
                    styles.licenseExpiry,
                    { color: isDark ? '#94A3B8' : '#64748B', fontFamily: fontFamilies.monoRegular || 'DMMono-Regular' },
                  ]}
                >
                  Expires: {lic2Expiry}
                </AppText>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* ── CARD 4: Address & Map Location Card ───────────────────── */}
        <GlassCard style={styles.card}>
          <View style={styles.locationHeader}>
            <View>
              <AppText variant="caption" colorType="brand" style={styles.overline}>
                PHYSICAL STOREFRONT
              </AppText>
              <AppText variant="titleMedium" colorType="primary" style={styles.sectionTitle}>
                Store Location & GPS
              </AppText>
            </View>
          </View>

          <AppText
            variant="bodyMedium"
            colorType="primary"
            numberOfLines={3}
            style={styles.streetAddress}
          >
            {address}
          </AppText>

          <View style={styles.coordsRow}>
            <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="3" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="2" />
              <Path
                d="M12 2v3M12 19v3M2 12h3M19 12h3"
                stroke={colors.brand?.primary || '#009BA9'}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
            <AppText
              style={[
                styles.coordsText,
                {
                  color: isDark ? '#94A3B8' : '#64748B',
                  fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                },
              ]}
            >
              GPS: {coordsFormatted}
            </AppText>
          </View>

          {/* Clean View on Map Action Row */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate('PharmacyLocation')}
            style={[
              styles.viewMapBtn,
              {
                backgroundColor: isDark ? 'rgba(0, 155, 169, 0.12)' : 'rgba(0, 155, 169, 0.08)',
                borderColor: isDark ? 'rgba(0, 155, 169, 0.3)' : 'rgba(0, 155, 169, 0.2)',
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="View Store on Google Maps"
          >
            <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                stroke={colors.brand?.primary || '#009BA9'}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx="12" cy="9" r="2.5" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="1.8" />
            </Svg>
            <AppText
              style={[
                styles.viewMapText,
                { color: colors.brand?.primary || '#009BA9', fontFamily: fontFamilies.primaryBold },
              ]}
            >
              View on Map
            </AppText>
            <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18l6-6-6-6"
                stroke={colors.brand?.primary || '#009BA9'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </GlassCard>

        {/* Staff Management CTA */}
        <View style={styles.footerWrap}>
          <AppButton
            variant="secondary"
            title="Manage Staff Hierarchy & Permissions"
            onPress={() => navigation.navigate('StaffList')}
          />
        </View>
      </View>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  containerContent: {
    paddingBottom: verticalScale(32),
  },
  contentWrap: {
    paddingHorizontal: scale(20),
    gap: verticalScale(14),
  },
  headerRightBtn: {
    padding: scale(4),
  },
  card: {
    flexDirection: 'column',
    width: '100%',
  },
  topIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  facadeThumb: {
    width: scale(64),
    height: scale(64),
    marginRight: scale(14),
  },
  facadeThumbPlaceholder: {
    width: scale(64),
    height: scale(64),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(14),
  },
  identityDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  pharmacyName: {
    letterSpacing: -0.4,
    lineHeight: scaleFont(22),
  },
  territoryPillRow: {
    flexDirection: 'row',
    marginTop: verticalScale(6),
  },
  metaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderRadius: scale(12),
    borderWidth: 1,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: scaleFont(9),
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: scaleFont(12.5),
    marginTop: verticalScale(2),
  },
  metaDivider: {
    width: 1,
    height: verticalScale(24),
    marginHorizontal: scale(10),
  },
  statusPillWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(2),
  },
  greenStatusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#10B981',
    marginRight: scale(6),
  },
  overline: {
    letterSpacing: 0.8,
    fontSize: scaleFont(9.5),
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: verticalScale(2),
    letterSpacing: -0.2,
  },
  licenseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  editPillBtn: {
    paddingVertical: verticalScale(2),
  },
  licensesList: {
    gap: verticalScale(10),
  },
  licenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(4),
  },
  licenseIconDisc: {
    marginRight: scale(12),
  },
  licenseTextCol: {
    flex: 1,
  },
  licenseTitleBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  licenseTitle: {
    fontSize: scaleFont(13),
    fontWeight: '600',
    flex: 1,
    marginRight: scale(6),
  },
  licenseNumber: {
    fontSize: scaleFont(12.5),
    marginTop: verticalScale(2),
  },
  licenseExpiry: {
    fontSize: scaleFont(11),
    marginTop: verticalScale(1),
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  locationHeader: {
    marginBottom: verticalScale(8),
  },
  streetAddress: {
    lineHeight: scaleFont(19),
    marginBottom: verticalScale(8),
  },
  coordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: verticalScale(12),
  },
  coordsText: {
    fontSize: scaleFont(12),
  },
  viewMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(42),
    borderRadius: scale(10),
    borderWidth: 1,
    gap: scale(8),
  },
  viewMapText: {
    fontSize: scaleFont(13),
  },
  footerWrap: {
    marginTop: verticalScale(6),
    marginBottom: verticalScale(14),
  },
});

export default PharmacyProfileScreen;
