import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge } from '../core/index.js';

const DEMO_BRANDS = [
  { id: 'b1', name: 'Augmentin 625mg', generic: 'Co-Amoxiclav', sharePct: 24, rank: 1 },
  { id: 'b2', name: 'Panadol Extra', generic: 'Paracetamol + Caffeine', sharePct: 19, rank: 2 },
  { id: 'b3', name: 'Risek 20mg Cap', generic: 'Omeprazole', sharePct: 15, rank: 3 },
  { id: 'b4', name: 'Softin 10mg Tab', generic: 'Loratadine', sharePct: 11, rank: 4 },
  { id: 'b5', name: 'Loprin 75mg Tab', generic: 'Aspirin', sharePct: 8, rank: 5 },
];

/**
 * TopBrandsTerritoryCard - Ranked Brands & Territory Sales Share
 *
 * @param {Object} props
 * @param {string} [props.territoryName='PECHS, Karachi']
 * @param {Array<Object>} [props.brands]
 */
export const TopBrandsTerritoryCard = ({
  territoryName = 'PECHS, Karachi',
  brands = DEMO_BRANDS,
}) => {
  const { colors, isDark } = useTheme();

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

      {/* Brands Ranked List */}
      <View style={styles.listContainer}>
        {brands.map((brand) => (
          <View key={brand.id} style={styles.brandRow}>
            {/* Rank Number Badge */}
            <View
              style={[
                styles.rankBadge,
                {
                  backgroundColor:
                    brand.rank === 1
                      ? colors.brand?.primary
                      : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)',
                },
              ]}
            >
              <AppText
                variant="captionMedium"
                colorType={brand.rank === 1 ? 'inverse' : 'muted'}
              >
                #{brand.rank}
              </AppText>
            </View>

            {/* Brand Info & Progress Meter */}
            <View style={styles.brandInfoWrap}>
              <View style={styles.brandNameRow}>
                <AppText variant="bodySmallMedium" colorType="primary">
                  {brand.name}
                </AppText>
                <AppText variant="captionMedium" colorType="brand">
                  {brand.sharePct}% Share
                </AppText>
              </View>

              {/* Progress Bar Track */}
              <View
                style={[
                  styles.track,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' },
                ]}
              >
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${brand.sharePct * 3.5}%`,
                      backgroundColor:
                        brand.rank === 1 ? colors.brand?.primary : colors.brand?.primaryDark,
                    },
                  ]}
                />
              </View>

              <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                {brand.generic}
              </AppText>
            </View>
          </View>
        ))}
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
    marginBottom: verticalScale(14),
  },
  listContainer: {
    marginTop: verticalScale(2),
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(12),
  },
  rankBadge: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
    marginTop: verticalScale(2),
  },
  brandInfoWrap: {
    flex: 1,
  },
  brandNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  track: {
    height: verticalScale(6),
    borderRadius: scale(3),
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: scale(3),
  },
});

export default TopBrandsTerritoryCard;
