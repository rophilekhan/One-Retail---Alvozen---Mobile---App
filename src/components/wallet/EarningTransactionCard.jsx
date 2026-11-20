import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText, FieldIconBadge } from '../core/index.js';
import { BankOfficialIcon } from '../../assets/vectors/index.js';

/**
 * EarningTransactionCard
 * Exact 1:1 port of OneRx EarningTransactionCard for payout transactions.
 *
 * @param {Object} props
 * @param {'bank' | 'jazzcash' | 'easypaisa'} [props.type='bank']
 * @param {string} props.title - e.g. 'Bank Transfer'
 * @param {'Pending' | 'Paid'} [props.status='Paid']
 * @param {string} props.date - e.g. 'Today' or '04 Sep'
 * @param {string} props.amount - e.g. '4,500 Rs'
 * @param {string} [props.badgeVariant]
 */
export const EarningTransactionCard = memo(({
  type = 'bank',
  title = 'Bank Transfer',
  status = 'Paid',
  date = 'Today',
  amount = '4,500 Rs',
  badgeVariant,
}) => {
  const { isDark } = useTheme();

  const isPending = status?.toLowerCase() === 'pending';
  const statusColor = isPending ? '#FF7A00' : '#10B981';

  const amountStr = String(amount || '');
  const numericPart = amountStr.replace(/[^0-9,]/g, '').trim();
  const unitPart = amountStr.includes('Rs') ? 'Rs' : (amountStr.replace(/[0-9,\s]/g, '').trim() || 'Rs');
  const amountColor = isDark ? '#38BDF8' : '#0F4761';

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
          borderWidth: isDark ? 1 : 0,
        },
      ]}
    >
      <View style={styles.leftRow}>
        {type === 'jazzcash' ? (
          <View style={styles.brandDisc}>
            <Image
              source={require('../../assets/images/jazzcash icon.png')}
              style={styles.brandIcon}
              resizeMode="contain"
            />
          </View>
        ) : type === 'easypaisa' ? (
          <View style={styles.brandDisc}>
            <Image
              source={require('../../assets/images/easypaisa icon.png')}
              style={styles.brandIcon}
              resizeMode="contain"
            />
          </View>
        ) : (
          <FieldIconBadge
            isDark={isDark}
            size={44}
            variant={badgeVariant || 'bank'}
            marginRight={12}
          >
            <BankOfficialIcon
              size={scale(20)}
              color={isDark ? '#FFFFFF' : '#020202'}
            />
          </FieldIconBadge>
        )}

        <View style={styles.infoColumn}>
          <AppText
            style={[
              styles.title,
              { color: isDark ? '#FFFFFF' : '#020202' },
            ]}
            numberOfLines={1}
          >
            {title}
          </AppText>

          <View style={styles.statusDateRow}>
            <AppText style={[styles.statusText, { color: statusColor }]}>
              {status}
            </AppText>
            <AppText style={[styles.dotSeparator, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
              •
            </AppText>
            <AppText style={[styles.dateText, { color: isDark ? '#9CA3AF' : '#737373' }]}>
              {date}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.amountWrap}>
        <AppText style={[styles.amountNumberMono, { color: amountColor }]}>
          {numericPart}
        </AppText>
        <AppText style={[styles.amountUnitMono, { color: '#ABABAB' }]}>
          {' '}{unitPart}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(10),
    borderRadius: scale(20),
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(12),
  },
  brandDisc: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: scale(12),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  brandIcon: {
    width: scale(26),
    height: scale(22),
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleFont(15),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginBottom: verticalScale(3),
  },
  statusDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
  },
  dotSeparator: {
    fontSize: scaleFont(11),
    marginHorizontal: scale(5),
  },
  dateText: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.primary,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amountNumberMono: {
    fontSize: scaleFont(18),
    fontFamily: fontFamilies.mono,
    letterSpacing: -0.3,
  },
  amountUnitMono: {
    fontSize: scaleFont(13.5),
    fontFamily: fontFamilies.mono,
  },
});

export default EarningTransactionCard;
