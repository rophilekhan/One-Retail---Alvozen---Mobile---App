import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge } from '../core/index.js';
import { TerritoryShareDonutChart } from './TerritoryShareDonutChart.jsx';

const DEMO_BRANDS = [
  { id: 'b1', name: 'Augmentin 625mg', generic: 'Co-Amoxiclav', sharePct: 24.5, rank: 1 },
  { id: 'b2', name: 'Panadol Extra', generic: 'Paracetamol + Caffeine', sharePct: 19.2, rank: 2 },
  { id: 'b3', name: 'Risek 20mg Cap', generic: 'Omeprazole', sharePct: 15.0, rank: 3 },
  { id: 'b4', name: 'Softin 10mg Tab', generic: 'Loratadine', sharePct: 11.4, rank: 4 },
  { id: 'b5', name: 'Loprin 75mg Tab', generic: 'Aspirin', sharePct: 8.8, rank: 5 },
];

/**
 * TopBrandsTerritoryCard - Ranked Brands & Territory Sales Share
 * Upgraded with Native Segmented Donut Ring Chart + Non-overlapping Ranked Legend.
 *
 * @param {Object} props
 * @param {string} [props.territoryName='PECHS, Karachi']
 * @param {Array<Object>} [props.brands]
 */
export const TopBrandsTerritoryCard = ({
  territoryName = 'PECHS, Karachi',
  brands = DEMO_BRANDS,
}) => {
  return (
    <GlassCard style={styles.card}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <AppText variant="caption" colorType="brand" style={styles.overline}>
            TERRITORY MARKET SHARE
          </AppText>
          <AppText variant="titleMedium" colorType="primary" style={styles.title}>
            Top Brands in Territory
          </AppText>
        </View>

        <AppBadge label="This Month" variant="neutral" size="sm" />
      </View>

      <AppText variant="caption" colorType="muted" style={styles.subtext}>
        Aggregated demand off-take across pharmacies in {territoryName}
      </AppText>

      {/* Segmented Donut Ring Chart & Ranked Legend */}
      <TerritoryShareDonutChart brands={brands} territoryName={territoryName} />
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: verticalScale(14),
    flexDirection: 'column',
    width: '100%',
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
    fontSize: scale(9.5),
    fontWeight: '700',
  },
  title: {
    letterSpacing: -0.2,
    marginTop: verticalScale(2),
  },
  subtext: {
    marginBottom: verticalScale(14),
  },
});

export default TopBrandsTerritoryCard;
