import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge, AppButton } from '../core/index.js';
import { PermissionGuard } from '../common/PermissionGuard.jsx';
import { PERMISSIONS } from '../../store/useStaffStore.js';

/**
 * PurchaseOrderCard - Single PO item with RBAC approval action
 *
 * @param {Object} props
 * @param {Object} props.po
 * @param {Function} props.onApprove
 */
export const PurchaseOrderCard = ({ po, onApprove }) => {
  const { colors } = useTheme();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="titleMedium" colorType="primary">{po.poNumber}</AppText>
          <AppText variant="caption" colorType="muted">
            {po.distributor} • {po.itemsCount} Items
          </AppText>
          <AppText variant="bodySmallMedium" colorType="brand" style={{ marginTop: 2 }}>
            PKR {po.totalAmount.toLocaleString()}
          </AppText>
        </View>

        <AppBadge
          label={po.status}
          variant={
            po.status === 'Submitted to Distributor' || po.status === 'Dispatched'
              ? 'success'
              : 'accent'
          }
        />
      </View>

      {po.status === 'Pending Approval' && (
        <View style={[styles.cardActionRow, { borderTopColor: colors.border?.subtle }]}>
          <PermissionGuard
            permission={PERMISSIONS.PO_APPROVER}
            fallback={
              <AppText variant="caption" colorType="muted">
                Awaiting PO Approver authorization.
              </AppText>
            }
          >
            <AppButton
              variant="primary"
              size="xs"
              title="Approve & Transmit PO to Distributor"
              onPress={() => onApprove(po.id)}
            />
          </PermissionGuard>
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: verticalScale(5),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardActionRow: {
    borderTopWidth: 1,
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
  },
});

export default PurchaseOrderCard;
