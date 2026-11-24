import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { GlassCard, AppText, AppBadge } from '../core/index.js';
import { TerritoryBenchmarkBarChart } from './TerritoryBenchmarkBarChart.jsx';

/**
 * TerritoryBenchmarkingCard - Pharmacy Performance vs. Territory Average
 * Upgraded with Native SVG Grouped Dual-Bar Comparison Graph across:
 * 1. Daily Rx Volume
 * 2. SKU Fill Rate %
 * 3. Generic Substitution Rate %
 *
 * @param {Object} props
 * @param {string} [props.territoryName='PECHS / Tariq Road']
 */
export const TerritoryBenchmarkingCard = ({
  territoryName = 'PECHS / Tariq Road',
}) => {
  const { colors, isDark } = useTheme();

  return (
    <GlassCard style={styles.card}>
      {/* Header Row: Title & Territory Pill */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <AppText
            style={[
              styles.overline,
              { color: isDark ? '#38D6E5' : (colors.brand?.primaryDark || '#0F4761') },
            ]}
          >
            TERRITORY BENCHMARK
          </AppText>
          <AppText
            style={[
              styles.title,
              { color: colors.text?.primary || (isDark ? '#FFFFFF' : '#020202') },
            ]}
          >
            Performance Benchmarks
          </AppText>
        </View>

        <AppBadge label={territoryName} variant="brand" size="sm" />
      </View>

      <AppText
        style={[
          styles.subtext,
          { color: colors.text?.secondary || (isDark ? '#94A3B8' : '#64748B') },
        ]}
      >
        Real-time comparison vs 48 verified pharmacies in your assigned territory
      </AppText>

      {/* SVG Grouped Dual-Bar Comparison Graph */}
      <TerritoryBenchmarkBarChart />
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: verticalScale(14),
    width: '100%',
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(4),
  },
  titleWrap: {
    flex: 1,
    marginRight: scale(8),
  },
  overline: {
    letterSpacing: 0.8,
    fontSize: scaleFont(9.5),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: scaleFont(16),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: verticalScale(2),
  },
  subtext: {
    fontSize: scaleFont(12.5),
    fontFamily: fontFamilies.primary,
    marginBottom: verticalScale(14),
    lineHeight: scaleFont(16),
  },
});

export default TerritoryBenchmarkingCard;
