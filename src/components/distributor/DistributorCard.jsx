import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { GlassCard, AppText, AppBadge, AppButton, MetricIconDisc, DetailsChevronButton } from '../core/index.js';
import { PermissionGuard } from '../common/PermissionGuard.jsx';
import { PERMISSIONS } from '../../store/useStaffStore.js';

/**
 * DistributorTruckIcon - Clean Logistics/Truck SVG Icon
 */
const DistributorTruckIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 3h15v13H1V3z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 8h4l3 3v5h-7V8z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth="1.8" />
    <Circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth="1.8" />
  </Svg>
);

/**
 * DistributorCard - Linked Authorized Pharma Distributor Card
 *
 * Modeled on OneRx AppointmentCard / TradeSchemeCard architecture:
 * - Zone 1: Truck Icon + Distributor Name & Territory + "Authorized" Badge
 * - Zone 2: 3-Column Metrics Strip (CREDIT LIMIT | OPEN POs | EXPIRY CLAIMS)
 * - Zone 3: 2-Button Action Row (Initiate PO + Expiry Claim) with RBAC permissions
 *
 * @param {Object} props
 * @param {Object} props.distributor
 * @param {Function} [props.onInitiatePO]
 * @param {Function} [props.onExpiryClaim]
 * @param {Object} [props.style]
 */
export const DistributorCard = ({
  distributor,
  onInitiatePO,
  onExpiryClaim,
  onDetails,
  style,
}) => {
  const { colors, isDark, spacing, shadows } = useTheme();

  if (!distributor) return null;

  const iconColor = isDark ? '#FFFFFF' : (colors.brand?.primaryDark || '#0F4761');

  return (
    <GlassCard
      style={[
        styles.card,
        {
          borderRadius: radii?.card || scale(20),
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : (colors.border?.card || '#F5F5F5'),
          gap: spacing?.md || verticalScale(12),
        },
        !isDark && (shadows?.card || shadows?.light?.card),
        style,
      ]}
    >
      {/* ── ZONE 1: Header Row ────────────────────────────────────────── */}
      <View style={styles.zone1Header}>
        {/* Left: MetricIconDisc with Truck Icon */}
        <MetricIconDisc size={40} isDark={isDark} variant="first_visit">
          <DistributorTruckIcon color={iconColor} size={20} />
        </MetricIconDisc>

        {/* Middle: Distributor Name & Territory / Rep */}
        <View style={[styles.zone1Middle, { marginHorizontal: spacing?.sm || scale(8) }]}>
          <AppText
            style={[
              styles.distributorName,
              typography?.bodyLarge,
              {
                color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                fontFamilies: fontFamilies.primaryMedium || 'DMSans-Medium',
              },
            ]}
            numberOfLines={1}
          >
            {distributor.name}
          </AppText>
          <AppText
            style={[
              styles.distributorSub,
              typography?.caption,
              {
                color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular',
              },
            ]}
            numberOfLines={1}
          >
            {distributor.territory} • {distributor.contactPerson?.split('(')[0]?.trim() || 'Authorized Rep'}
          </AppText>
        </View>

        {/* Right: Authorized Status Badge & Details */}
        <View style={styles.zone1Right}>
          <AppBadge
            label={distributor.status || 'Authorized'}
            variant="success"
            size="md"
          />
          {onDetails && (
            <DetailsChevronButton
              label="Details"
              onPress={() => onDetails(distributor)}
              style={{ marginTop: verticalScale(4) }}
            />
          )}
        </View>
      </View>

      {/* ── ZONE 2: 3-Column Metrics Strip ────────────────────────────── */}
      <View
        style={[
          styles.zone2Strip,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.04)'
              : (colors.background?.secondary || '#F8FAFC'),
            borderRadius: radii?.md || scale(12),
            paddingVertical: spacing?.sm || verticalScale(8),
            paddingHorizontal: spacing?.md || scale(12),
          },
        ]}
      >
        {/* Column 1: Credit Limit */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            CREDIT LIMIT
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.brand?.primary || '#009BA9', fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
            ]}
            numberOfLines={1}
          >
            {distributor.creditLimit || 'PKR 2.5M'}
          </AppText>
        </View>

        {/* Divider 1 */}
        <View
          style={[
            styles.colDivider,
            { backgroundColor: colors.border?.divider || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') },
          ]}
        />

        {/* Column 2: Open POs */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            OPEN POs
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'), fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
            ]}
            numberOfLines={1}
          >
            {distributor.openPOsCount || 0} Open
          </AppText>
        </View>

        {/* Divider 2 */}
        <View
          style={[
            styles.colDivider,
            { backgroundColor: colors.border?.divider || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') },
          ]}
        />

        {/* Column 3: Expiry Claims */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            EXPIRY CLAIMS
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'), fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
            ]}
            numberOfLines={1}
          >
            {distributor.expiryClaimsCount || 0} Claims
          </AppText>
        </View>
      </View>

      {/* ── ZONE 3: Clean 2-Button Action Row ────────────────────────── */}
      <View style={[styles.zone3ActionRow, { gap: spacing?.sm || scale(8) }]}>
        {/* Left Action: Initiate PO */}
        <View style={styles.actionBtnCol}>
          <PermissionGuard permission={PERMISSIONS.PO_INITIATOR} mode="lock">
            <AppButton
              variant="primary"
              size="sm"
              title="Initiate PO"
              onPress={() => onInitiatePO && onInitiatePO(distributor)}
              style={styles.actionBtn}
            />
          </PermissionGuard>
        </View>

        {/* Right Action: Expiry Claim */}
        <View style={styles.actionBtnCol}>
          <PermissionGuard permission={PERMISSIONS.EXPIRY_INITIATOR} mode="lock">
            <AppButton
              variant="secondary"
              size="sm"
              title="Expiry Claim"
              onPress={() => onExpiryClaim && onExpiryClaim(distributor)}
              style={styles.actionBtn}
            />
          </PermissionGuard>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'column',
    borderWidth: 1,
  },
  zone1Header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  zone1Middle: {
    flex: 1,
    justifyContent: 'center',
  },
  distributorName: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  distributorSub: {
    fontSize: scaleFont(11.5),
    marginTop: verticalScale(2),
  },
  zone1Right: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  zone2Strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: scaleFont(10),
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: verticalScale(2),
  },
  metricValue: {
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  colDivider: {
    width: 1,
    height: verticalScale(22),
  },
  zone3ActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  actionBtnCol: {
    flex: 1,
  },
  actionBtn: {
    height: verticalScale(42),
    width: '100%',
    paddingHorizontal: scale(8),
  },
});

export default DistributorCard;
