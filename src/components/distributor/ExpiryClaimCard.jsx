import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { GlassCard, AppText, AppBadge, AppButton, DetailsChevronButton } from '../core/index.js';
import { PermissionGuard } from '../common/PermissionGuard.jsx';
import { PERMISSIONS } from '../../store/useStaffStore.js';

/**
 * ExpiryClaimCard - Near-expiry item return claim with RBAC approval
 *
 * @param {Object} props
 * @param {Object} props.claim
 * @param {Function} props.onApprove
 * @param {Object} [props.style]
 */
export const ExpiryClaimCard = ({ claim, onApprove, onDetails, style }) => {
  const { colors, isDark, spacing, shadows } = useTheme();

  if (!claim) return null;

  const isPending = claim.status === 'PENDING_APPROVAL' || claim.status === 'Ready for Return Authorization';
  const isApproved = claim.status === 'APPROVED' || claim.status === 'Credit Note Authorized';
  const isSettled = claim.status === 'SETTLED' || claim.status === 'Credit Note Issued';

  const badgeVariant = isPending ? 'warning' : isApproved ? 'success' : isSettled ? 'brand' : 'neutral';
  const badgeLabel = isPending ? 'Pending Approval' : isApproved ? 'Approved' : isSettled ? 'Settled' : claim.status;

  const expiryDateText = claim.expiryDate || 'Dec 2026';
  const qtyText = `${claim.quantity || claim.units || 10} Units`;
  const claimValueText = `PKR ${Number(claim.claimValue || 0).toLocaleString()}`;

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
        <View style={styles.zone1Left}>
          <AppText
            style={[
              styles.claimNumber,
              {
                color: colors.brand?.accent || '#FB6B03',
                fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
              },
            ]}
          >
            {claim.claimNumber}
          </AppText>
          <AppText
            style={[
              styles.skuName,
              typography?.bodySmall,
              {
                color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'),
                fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
              },
            ]}
            numberOfLines={1}
          >
            {claim.skuName || claim.brandName}
          </AppText>
          <AppText
            style={[
              styles.batchInfo,
              typography?.caption,
              {
                color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                fontFamily: fontFamilies.monoRegular || 'DMMono-Regular',
              },
            ]}
            numberOfLines={1}
          >
            Batch: {claim.batchNo} • {claim.distributorName || 'Distributor Return'}
          </AppText>
        </View>

        <AppBadge
          label={badgeLabel}
          variant={badgeVariant}
          size="md"
          isMono={true}
        />
      </View>

      {/* ── ZONE 2: 3-Column Summary Strip ────────────────────────────── */}
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
        {/* Column 1: Expiry Date */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            EXPIRY DATE
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'), fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
            ]}
            numberOfLines={1}
          >
            {expiryDateText}
          </AppText>
        </View>

        {/* Divider 1 */}
        <View
          style={[
            styles.colDivider,
            { backgroundColor: colors.border?.divider || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') },
          ]}
        />

        {/* Column 2: Quantity */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            QTY
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'), fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
            ]}
            numberOfLines={1}
          >
            {qtyText}
          </AppText>
        </View>

        {/* Divider 2 */}
        <View
          style={[
            styles.colDivider,
            { backgroundColor: colors.border?.divider || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') },
          ]}
        />

        {/* Column 3: Claim Value */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            CLAIM VALUE
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.brand?.accent || '#FB6B03', fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
            ]}
            numberOfLines={1}
          >
            {claimValueText}
          </AppText>
        </View>
      </View>

      {/* ── ZONE 3: Action Row ────────────────────────────────────────── */}
      <View style={styles.zone3ActionRow}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: scale(8) }}>
          <DetailsChevronButton
            label="View Details"
            onPress={() => onDetails && onDetails(claim)}
          />
          {isPending && (
            <PermissionGuard permission={PERMISSIONS.EXPIRY_APPROVER} mode="lock">
              <AppButton
                variant="accent"
                size="sm"
                title="Approve Expiry Claim"
                onPress={() => onApprove && onApprove(claim.id)}
                style={styles.actionBtn}
              />
            </PermissionGuard>
          )}
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
    justifyContent: 'space-between',
    width: '100%',
  },
  zone1Left: {
    flex: 1,
    marginRight: scale(10),
  },
  claimNumber: {
    fontSize: scaleFont(15),
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  skuName: {
    fontSize: scaleFont(13),
    marginTop: verticalScale(2),
  },
  batchInfo: {
    fontSize: scaleFont(11),
    marginTop: verticalScale(1),
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
    width: '100%',
  },
  actionBtn: {
    height: verticalScale(42),
    width: '100%',
  },
});

export default ExpiryClaimCard;
