import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText } from '../core/index.js';
import { MoneyOfficialIcon } from '../../assets/vectors/index.js';

/**
 * EarningsSummaryCard
 * Exact 1:1 port of OneRx EarningsSummaryCard with diagonal teal gradient,
 * white circular dollar badge, mono balance, transparent trophy graphic, and 3-column breakdown.
 *
 * @param {Object} props
 * @param {string|number} [props.totalEarnings='48,500']
 * @param {string} [props.currency='PKR']
 * @param {string} [props.availableAmount='36,500 Rs']
 * @param {string} [props.pendingAmount='12,000 Rs']
 * @param {string} [props.paidAmount='8,500 Rs']
 */
export const EarningsSummaryCard = ({
  totalEarnings = '48,500',
  currency = 'PKR',
  availableAmount = '36,500 Rs',
  pendingAmount = '12,000 Rs',
  paidAmount = '8,500 Rs',
}) => {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.cardOuter,
        {
          borderColor: isDark
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(255, 255, 255, 0.45)',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: verticalScale(6) },
          shadowOpacity: isDark ? 0.45 : 0.2,
          shadowRadius: scale(14),
          elevation: 6,
        },
      ]}
    >
      <LinearGradient
        colors={[
          '#518789',
          '#3D5C61',
          '#1D353A',
          '#0F1A1C',
          '#0B0C0E',
          '#0B0C0E',
        ]}
        locations={[0, 0.22, 0.45, 0.65, 0.85, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* 1. Top Section */}
        <View style={styles.topRow}>
          <View style={styles.leftInfoColumn}>
            {/* White Circular Dollar Disc Badge */}
            <View style={styles.moneyDisc}>
              <MoneyOfficialIcon size={scale(19)} color="#020202" />
            </View>

            {/* Total Earnings Label */}
            <AppText style={styles.totalEarningsLabel}>
              TOTAL EARNINGS
            </AppText>

            {/* Balance in Mono Typography */}
            <View style={styles.amountRow}>
              <AppText style={styles.amountMono}>
                {totalEarnings}
              </AppText>
              <AppText style={styles.currencySuffix}>
                {currency}
              </AppText>
            </View>
          </View>

          {/* Right: Transparent Trophy Graphic */}
          <View style={styles.graphicWrap} pointerEvents="none">
            <Image
              source={require('../../assets/images/transparent one rx.png')}
              style={styles.oneRxImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* 2. Bottom Section: 3-Column Breakdown */}
        <View style={styles.breakdownRow}>
          {/* Column 1: Available */}
          <View style={styles.columnItem}>
            <View style={styles.columnHeader}>
              <View style={[styles.squareIndicator, { backgroundColor: '#00E5FF' }]} />
              <AppText style={styles.columnLabel}>Available</AppText>
            </View>
            <View style={styles.amountPillRow}>
              <AppText style={styles.columnAmountMono}>
                {String(availableAmount).replace(' Rs', '')}
              </AppText>
              <AppText style={styles.columnCurrencyUnit}> Rs</AppText>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Column 2: Pending */}
          <View style={styles.columnItem}>
            <View style={styles.columnHeader}>
              <View style={[styles.squareIndicator, { backgroundColor: '#FF6B00' }]} />
              <AppText style={styles.columnLabel}>Pending</AppText>
            </View>
            <View style={styles.amountPillRow}>
              <AppText style={styles.columnAmountMono}>
                {String(pendingAmount).replace(' Rs', '')}
              </AppText>
              <AppText style={styles.columnCurrencyUnit}> Rs</AppText>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Column 3: Paid */}
          <View style={styles.columnItem}>
            <View style={styles.columnHeader}>
              <View style={[styles.squareIndicator, { backgroundColor: '#00E676' }]} />
              <AppText style={styles.columnLabel}>Paid</AppText>
            </View>
            <View style={styles.amountPillRow}>
              <AppText style={styles.columnAmountMono}>
                {String(paidAmount).replace(' Rs', '')}
              </AppText>
              <AppText style={styles.columnCurrencyUnit}> Rs</AppText>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: scale(26),
    overflow: 'hidden',
    borderWidth: 1,
    marginVertical: verticalScale(4),
  },
  gradientContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  leftInfoColumn: {
    flex: 1,
  },
  moneyDisc: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  totalEarningsLabel: {
    fontSize: scaleFont(11),
    fontFamily: fontFamilies.primaryBold,
    color: '#FFFFFF',
    letterSpacing: 1.1,
    marginBottom: verticalScale(4),
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountMono: {
    fontSize: scaleFont(38),
    lineHeight: scaleFont(44),
    fontFamily: fontFamilies.mono,
    fontVariant: ['tabular-nums'],
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  currencySuffix: {
    fontSize: scaleFont(16),
    fontFamily: fontFamilies.primaryMedium,
    color: 'rgba(255, 255, 255, 0.45)',
    marginLeft: scale(8),
  },
  graphicWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(10),
  },
  oneRxImage: {
    width: scale(86),
    height: scale(94),
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: verticalScale(14),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  columnItem: {
    flex: 1,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  squareIndicator: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(1.5),
    marginRight: scale(5),
  },
  columnLabel: {
    fontSize: scaleFont(11.5),
    fontFamily: fontFamilies.primaryMedium,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  amountPillRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  columnAmountMono: {
    fontSize: scaleFont(13.5),
    fontFamily: fontFamilies.mono,
    fontVariant: ['tabular-nums'],
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  columnCurrencyUnit: {
    fontSize: scaleFont(12.5),
    fontFamily: fontFamilies.monoMedium || fontFamilies.mono,
    fontVariant: ['tabular-nums'],
    color: 'rgba(255, 255, 255, 0.9)',
  },
  divider: {
    width: 1,
    height: verticalScale(26),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: scale(6),
  },
});

export default EarningsSummaryCard;
