import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge, AppButton } from '../core/index.js';
import { PermissionGuard } from '../common/PermissionGuard.jsx';
import { PERMISSIONS } from '../../store/useStaffStore.js';

/**
 * ExpiryReturnCard - Near-expiry item return authorization
 *
 * @param {Object} props
 * @param {Object} props.expiry
 * @param {Function} props.onAuthorize
 */
export const ExpiryReturnCard = ({ expiry, onAuthorize }) => {
  const { colors } = useTheme();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="titleMedium" colorType="primary">{expiry.brandName}</AppText>
          <AppText variant="caption" colorType="muted">
            Batch: {expiry.batchNo} • Cutoff: {expiry.expiryDate} • Qty: {expiry.units} units
          </AppText>
          <AppText variant="bodySmallMedium" colorType="brand" style={{ marginTop: 2 }}>
            Claim Value: PKR {expiry.claimValue.toLocaleString()}
          </AppText>
        </View>

        <AppBadge
          label={expiry.status}
          variant={expiry.status.includes('Credit') ? 'success' : 'accent'}
        />
      </View>

      {expiry.status === 'Ready for Return Authorization' && (
        <View style={[styles.cardActionRow, { borderTopColor: colors.border?.subtle }]}>
          <PermissionGuard
            permission={PERMISSIONS.EXPIRY_APPROVER}
            fallback={
              <AppText variant="caption" colorType="muted">
                Awaiting Expiry Approver sign-off.
              </AppText>
            }
          >
            <AppButton
              variant="accent"
              size="xs"
              title="Authorize Credit Note Claim"
              onPress={() => onAuthorize(expiry.id)}
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

export default ExpiryReturnCard;
