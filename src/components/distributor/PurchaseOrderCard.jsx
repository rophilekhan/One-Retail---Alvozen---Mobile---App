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
 * PurchaseOrderCard - Single PO item with RBAC approval workflow
 *
 * @param {Object} props
 * @param {Object} props.po
 * @param {Function} props.onApprove
 * @param {Object} [props.style]
 */
export const PurchaseOrderCard = ({ po, onApprove, onDetails, style }) => {
  const { colors, isDark, spacing, shadows } = useTheme();

  if (!po) return null;

  const isPending = po.status === 'PENDING_APPROVAL' || po.status === 'Pending Approval';
  const isApproved = po.status === 'APPROVED' || po.status === 'Approved' || po.status === 'Submitted to Distributor';
  const isDispatched = po.status === 'DISPATCHED' || po.status === 'Dispatched';

  const badgeVariant = isPending ? 'warning' : isApproved ? 'success' : isDispatched ? 'brand' : 'neutral';
  const badgeLabel = isPending ? 'Pending Approval' : isApproved ? 'Approved' : isDispatched ? 'Dispatched' : po.status;

  const itemsCountText = `${po.itemsCount || po.items?.length || 1} Items`;
  const totalAmountText = `PKR ${Number(po.totalAmount || 0).toLocaleString()}`;
  const dateText = po.createdDate || po.createdAt || 'Nov 2026';

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
              styles.poNumber,
              {
                color: colors.brand?.primary || '#009BA9',
                fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                fontVariant: ['tabular-nums'],
              },
            ]}
          >
            {po.poNumber}
          </AppText>
          <AppText
            style={[
              styles.distributorName,
              typography?.caption,
              {
                color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'),
                fontFamily: fontFamilies.primaryMedium || 'DMSans-Medium',
              },
            ]}
            numberOfLines={1}
          >
            {po.distributorName || po.distributor}
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
        {/* Column 1: Items */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            ITEMS
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'), fontFamily: fontFamilies.monoMedium || 'DMMono-Medium', fontVariant: ['tabular-nums'] },
            ]}
            numberOfLines={1}
          >
            {itemsCountText}
          </AppText>
        </View>

        {/* Divider 1 */}
        <View
          style={[
            styles.colDivider,
            { backgroundColor: colors.border?.divider || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') },
          ]}
        />

        {/* Column 2: Total TP */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            TOTAL AMOUNT (TP)
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.brand?.primary || '#009BA9', fontFamily: fontFamilies.monoMedium || 'DMMono-Medium', fontVariant: ['tabular-nums'] },
            ]}
            numberOfLines={1}
          >
            {totalAmountText}
          </AppText>
        </View>

        {/* Divider 2 */}
        <View
          style={[
            styles.colDivider,
            { backgroundColor: colors.border?.divider || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') },
          ]}
        />

        {/* Column 3: Date */}
        <View style={styles.metricCol}>
          <AppText
            style={[
              styles.metricLabel,
              { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B'), fontFamily: fontFamilies.primaryRegular || 'DMSans-Regular' },
            ]}
            numberOfLines={1}
          >
            DATE
          </AppText>
          <AppText
            style={[
              styles.metricValue,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202'), fontFamily: fontFamilies.monoMedium || 'DMMono-Medium', fontVariant: ['tabular-nums'] },
            ]}
            numberOfLines={1}
          >
            {dateText}
          </AppText>
        </View>
      </View>

      {/* ── ZONE 3: Action Row ────────────────────────────────────────── */}
      <View style={styles.zone3ActionRow}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: scale(8) }}>
          <DetailsChevronButton
            label="View Details"
            onPress={() => onDetails && onDetails(po)}
          />
          {isPending && (
            <PermissionGuard permission={PERMISSIONS.PO_APPROVER} mode="lock">
              <AppButton
                variant="primary"
                size="sm"
                title="Approve Purchase Order"
                onPress={() => onApprove && onApprove(po.id)}
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
  poNumber: {
    fontSize: scaleFont(15),
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  distributorName: {
    fontSize: scaleFont(12),
    marginTop: verticalScale(2),
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

export default PurchaseOrderCard;
