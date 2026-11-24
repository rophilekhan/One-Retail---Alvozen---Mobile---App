import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText, AppBadge } from '../core/index.js';

const DEFAULT_BENCHMARKS = [
  {
    id: 'volume',
    label: 'Daily Rx Volume',
    pharmacyVal: '34 Rx/day',
    pharmacyPct: 82,
    territoryAvg: '21 Rx/day',
    territoryPct: 52,
    varianceLabel: '+62% vs Territory',
    isPositive: true,
  },
  {
    id: 'fillRate',
    label: 'SKU Fill Rate %',
    pharmacyVal: '94.8%',
    pharmacyPct: 94.8,
    territoryAvg: '86.2%',
    territoryPct: 86.2,
    varianceLabel: '+8.6% vs Territory',
    isPositive: true,
  },
  {
    id: 'substitution',
    label: 'Generic Substitution Rate %',
    pharmacyVal: '88.0%',
    pharmacyPct: 88,
    territoryAvg: '72.0%',
    territoryPct: 72,
    varianceLabel: '+16.0% vs Territory',
    isPositive: true,
  },
];

/**
 * TerritoryBenchmarkBarChart - Grouped Dual-Bar Comparison Graph
 * Native react-native-svg implementation:
 * - Your Pharmacy gradient bar vs Territory Average muted bar across 3 KPIs
 * - Top legend indicators
 * - DMMono-Medium value labels
 * - Variance badges (+12% vs Territory)
 *
 * @param {Object} props
 * @param {Array<Object>} [props.benchmarks]
 */
export const TerritoryBenchmarkBarChart = ({
  benchmarks = DEFAULT_BENCHMARKS,
}) => {
  const { colors, isDark } = useTheme();

  const brandPrimary = colors.brand?.primary || '#009BA9';
  const brandDark = colors.brand?.primaryDark || '#0F4761';
  const mutedFill = isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.14)';
  const trackBg = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';

  const BAR_SVG_WIDTH = 300;
  const BAR_HEIGHT = 8;

  return (
    <View style={styles.container}>
      {/* 1. Top Legend Row */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: brandPrimary }]} />
          <AppText
            style={[
              styles.legendText,
              { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
            ]}
          >
            Your Pharmacy
          </AppText>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: mutedFill }]} />
          <AppText
            style={[
              styles.legendText,
              { color: isDark ? '#94A3B8' : '#64748B', fontFamily: fontFamilies.primaryRegular },
            ]}
          >
            Territory Average
          </AppText>
        </View>
      </View>

      {/* 2. Grouped Metric Comparison Rows */}
      <View style={styles.metricsList}>
        {benchmarks.map((item) => {
          const pharmacyWidth = (item.pharmacyPct / 100) * BAR_SVG_WIDTH;
          const territoryWidth = (item.territoryPct / 100) * BAR_SVG_WIDTH;

          return (
            <View key={item.id} style={styles.benchmarkCard}>
              {/* Header: KPI Label + Variance Badge */}
              <View style={styles.metricHeaderRow}>
                <AppText
                  style={[
                    styles.metricTitle,
                    { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                  ]}
                >
                  {item.label}
                </AppText>
                <AppBadge
                  label={item.varianceLabel}
                  variant={item.isPositive ? 'success' : 'warning'}
                  size="sm"
                />
              </View>

              {/* Bar 1: Your Pharmacy */}
              <View style={styles.barSection}>
                <View style={styles.barLabelRow}>
                  <AppText style={[styles.barTypeLabel, { color: brandPrimary, fontFamily: fontFamilies.primaryMedium }]}>
                    Your Pharmacy
                  </AppText>
                  <AppText
                    style={[
                      styles.monoValue,
                      { color: brandPrimary, fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
                    ]}
                  >
                    {item.pharmacyVal}
                  </AppText>
                </View>

                <View style={styles.svgBarWrap}>
                  <Svg width="100%" height={BAR_HEIGHT} viewBox={`0 0 ${BAR_SVG_WIDTH} ${BAR_HEIGHT}`}>
                    <Defs>
                      <SvgLinearGradient id={`barGrad-${item.id}`} x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0%" stopColor={brandPrimary} />
                        <Stop offset="100%" stopColor={brandDark} />
                      </SvgLinearGradient>
                    </Defs>
                    {/* Background track */}
                    <Rect
                      x="0"
                      y="0"
                      width={BAR_SVG_WIDTH}
                      height={BAR_HEIGHT}
                      rx={BAR_HEIGHT / 2}
                      fill={trackBg}
                    />
                    {/* Active Bar */}
                    <Rect
                      x="0"
                      y="0"
                      width={pharmacyWidth}
                      height={BAR_HEIGHT}
                      rx={BAR_HEIGHT / 2}
                      fill={`url(#barGrad-${item.id})`}
                    />
                  </Svg>
                </View>
              </View>

              {/* Bar 2: Territory Average */}
              <View style={styles.barSection}>
                <View style={styles.barLabelRow}>
                  <AppText style={[styles.barTypeLabel, { color: isDark ? '#94A3B8' : '#64748B', fontFamily: fontFamilies.primaryRegular }]}>
                    Territory Avg
                  </AppText>
                  <AppText
                    style={[
                      styles.monoValue,
                      { color: isDark ? '#94A3B8' : '#64748B', fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
                    ]}
                  >
                    {item.territoryAvg}
                  </AppText>
                </View>

                <View style={styles.svgBarWrap}>
                  <Svg width="100%" height={BAR_HEIGHT} viewBox={`0 0 ${BAR_SVG_WIDTH} ${BAR_HEIGHT}`}>
                    {/* Background track */}
                    <Rect
                      x="0"
                      y="0"
                      width={BAR_SVG_WIDTH}
                      height={BAR_HEIGHT}
                      rx={BAR_HEIGHT / 2}
                      fill={trackBg}
                    />
                    {/* Territory Muted Bar */}
                    <Rect
                      x="0"
                      y="0"
                      width={territoryWidth}
                      height={BAR_HEIGHT}
                      rx={BAR_HEIGHT / 2}
                      fill={mutedFill}
                    />
                  </Svg>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
    marginBottom: verticalScale(14),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(6),
  },
  legendText: {
    fontSize: scaleFont(12),
  },
  metricsList: {
    gap: verticalScale(12),
  },
  benchmarkCard: {
    width: '100%',
    paddingBottom: verticalScale(4),
  },
  metricHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  metricTitle: {
    fontSize: scaleFont(13),
    fontWeight: '600',
    flex: 1,
    marginRight: scale(8),
  },
  barSection: {
    marginTop: verticalScale(4),
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(3),
  },
  barTypeLabel: {
    fontSize: scaleFont(11.5),
  },
  monoValue: {
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  svgBarWrap: {
    width: '100%',
    height: verticalScale(8),
  },
});

export default TerritoryBenchmarkBarChart;
