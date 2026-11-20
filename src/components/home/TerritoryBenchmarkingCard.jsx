import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge } from '../core/index.js';

/**
 * TerritoryBenchmarkingCard - Pharmacy Performance vs. Territory Average
 *
 * @param {Object} props
 * @param {string} [props.territoryName='PECHS Territory']
 * @param {Object} [props.metrics]
 */
export const TerritoryBenchmarkingCard = ({
  territoryName = 'PECHS Territory',
  metrics,
}) => {
  const { colors, isDark } = useTheme();

  const BENCHMARKS = [
    {
      id: 'scans',
      label: 'Daily Scanned Prescriptions',
      pharmacyVal: '34 Rx/day',
      territoryAvg: '21 Rx/day',
      comparison: '+62% Above Avg',
      isPositive: true,
    },
    {
      id: 'substitution',
      label: 'Generic Substitution Compliance',
      pharmacyVal: '88%',
      territoryAvg: '72%',
      comparison: '+16% Above Avg',
      isPositive: true,
    },
    {
      id: 'schemes',
      label: 'Active Scheme Adoption',
      pharmacyVal: '92%',
      territoryAvg: '68%',
      comparison: '+24% Above Avg',
      isPositive: true,
    },
    {
      id: 'stockout',
      label: 'Prescription Stock-out Rate',
      pharmacyVal: '4.2%',
      territoryAvg: '9.8%',
      comparison: '5.6% Lower (Better)',
      isPositive: true,
    },
  ];

  return (
    <GlassCard style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <AppText variant="caption" colorType="brand" style={styles.overline}>
            COMPETITIVE BENCHMARK
          </AppText>
          <AppText variant="titleMedium" colorType="primary" style={styles.title}>
            Territory Benchmarking
          </AppText>
        </View>

        <AppBadge label="Top Decile" variant="accent" size="sm" />
      </View>

      <AppText variant="caption" colorType="muted" style={styles.subtext}>
        Your store performance compared against 48 pharmacies in {territoryName}
      </AppText>

      {/* Benchmarks Grid */}
      <View style={styles.itemsWrap}>
        {BENCHMARKS.map((item, idx) => {
          const isLast = idx === BENCHMARKS.length - 1;
          return (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border?.subtle },
              ]}
            >
              <View style={styles.itemInfo}>
                <AppText variant="bodySmallMedium" colorType="primary">
                  {item.label}
                </AppText>
                <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                  Your Store: {item.pharmacyVal} • Territory: {item.territoryAvg}
                </AppText>
              </View>

              <AppBadge
                label={item.comparison}
                variant={item.isPositive ? 'success' : 'warning'}
                size="sm"
              />
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: scale(16),
    marginBottom: verticalScale(14),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(4),
  },
  titleWrap: {
    flex: 1,
  },
  overline: {
    letterSpacing: 0.8,
    fontSize: scale(9),
    fontWeight: '700',
  },
  title: {
    letterSpacing: -0.2,
    marginTop: verticalScale(2),
  },
  subtext: {
    marginBottom: verticalScale(12),
  },
  itemsWrap: {
    marginTop: verticalScale(2),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },
  itemInfo: {
    flex: 1,
    paddingRight: scale(10),
  },
});

export default TerritoryBenchmarkingCard;
