import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText, MetricIconDisc } from '../core/index.js';
import {
  BankOfficialIcon,
  JazzCashOfficialIcon,
  EasypaisaOfficialIcon,
} from '../../assets/vectors/index.js';

/**
 * EarningTransactionCard
 * Payout transaction row displaying aligned 44x44 MetricIconDisc brand vector,
 * status/date hierarchy, and tabular DMMono currency amounts.
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
  const { colors, isDark } = useTheme();

  const isPending = status?.toLowerCase() === 'pending';
  const statusColor = isPending ? colors.brand.accent : colors.status.available;

  const amountStr = String(amount || '');
  const numericPart = amountStr.replace(/[^0-9,]/g, '').trim();
  const unitPart = amountStr.includes('Rs') ? 'Rs' : (amountStr.replace(/[0-9,\s]/g, '').trim() || 'Rs');
  const amountColor = isDark ? colors.brand.primary : colors.brand.primaryDark;

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? colors.surface.inputSecondary : colors.surface.cardElevated,
          borderColor: colors.border.card,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.leftRow}>
        <MetricIconDisc
          variant={badgeVariant || 'bank'}
          size={scale(44)}
          disableSizeScale
          isDark={isDark}
          style={styles.brandDisc}
        >
          {type === 'jazzcash' ? (
            <JazzCashOfficialIcon width={scale(26)} height={scale(26)} />
          ) : type === 'easypaisa' ? (
            <EasypaisaOfficialIcon width={scale(26)} height={scale(26)} isDark={isDark} />
          ) : (
            <BankOfficialIcon
              width={scale(26)}
              height={scale(26)}
              color={isDark ? colors.text.primary : colors.brand.primaryDark}
            />
          )}
        </MetricIconDisc>

        <View style={styles.infoColumn}>
          <AppText
            style={[
              styles.title,
              { color: colors.text.primary },
            ]}
            numberOfLines={1}
          >
            {title}
          </AppText>

          <View style={styles.statusDateRow}>
            <AppText style={[styles.statusText, { color: statusColor }]}>
              {status}
            </AppText>
            <AppText style={[styles.dotSeparator, { color: colors.text.tertiary }]}>
              •
            </AppText>
            <AppText style={[styles.dateText, { color: colors.text.secondary }]}>
              {date}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.amountWrap}>
        <AppText style={[styles.amountNumberMono, { color: amountColor }]}>
          {numericPart}
        </AppText>
        <AppText style={[styles.amountUnitMono, { color: colors.text.secondary }]}>
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
    borderWidth: 0,
    padding: 0,
    marginRight: scale(12),
    flexShrink: 0,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleFont(15),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
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
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  amountUnitMono: {
    fontSize: scaleFont(13.5),
    fontFamily: fontFamilies.mono,
    fontVariant: ['tabular-nums'],
  },
});

export default EarningTransactionCard;
