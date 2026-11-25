import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText } from '../core/index.js';

const SLICE_COLORS = [
  '#009BA9', // Teal Primary
  '#0F4761', // Deep Cyan / Navy
  '#38D6E5', // Aqua Accent
  '#F59E0B', // Amber Gold
  '#8B5CF6', // Purple Accent
  '#EC4899', // Pink Accent
];

/**
 * TerritoryShareDonutChart - Segmented Donut Ring Chart + Ranked Legend
 * Native react-native-svg multi-segment Donut Ring:
 * - strokeDasharray / strokeDashoffset segmented arcs
 * - Center total territory share % in DMMono-Medium
 * - Ranked non-overlapping brand legend items with color indicators
 *
 * @param {Object} props
 * @param {Array<Object>} props.brands - Array of { id, name, generic, sharePct, rank }
 * @param {string} [props.territoryName]
 */
export const TerritoryShareDonutChart = ({
  brands = [],
  territoryName = 'PECHS, Karachi',
}) => {
  const { colors, isDark } = useTheme();

  // Donut geometry constants
  const RADIUS = 42;
  const STROKE_WIDTH = 12;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~263.89
  const CX = 60;
  const CY = 60;
  const SVG_SIZE = 120;

  const { slices, totalShare } = useMemo(() => {
    if (!brands || brands.length === 0) {
      return { slices: [], totalShare: 0 };
    }

    const total = brands.reduce((sum, b) => sum + (b.sharePct || 0), 0);
    let cumulativeLength = 0;

    const computedSlices = brands.map((b, idx) => {
      const sliceFraction = total > 0 ? (b.sharePct || 0) / total : 0;
      const sliceLength = sliceFraction * CIRCUMFERENCE;
      const offset = -cumulativeLength;
      cumulativeLength += sliceLength;
      const color = SLICE_COLORS[idx % SLICE_COLORS.length];

      return {
        ...b,
        color,
        sliceLength,
        dashArray: `${sliceLength.toFixed(2)} ${(CIRCUMFERENCE - sliceLength).toFixed(2)}`,
        dashOffset: offset.toFixed(2),
      };
    });

    return { slices: computedSlices, totalShare: total };
  }, [brands, CIRCUMFERENCE]);

  return (
    <View style={styles.container}>
      {/* 1. Donut Ring Visual with Center Share Metric */}
      <View style={styles.donutRow}>
        <View style={styles.donutSvgWrap}>
          <Svg width={scale(120)} height={scale(120)} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
            {/* Background Track Circle */}
            <Circle
              cx={CX}
              cy={CY}
              r={RADIUS}
              stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />

            {/* Segmented Slices */}
            <G transform={`rotate(-90 ${CX} ${CY})`}>
              {slices.map((slice) => (
                <Circle
                  key={slice.id || slice.name}
                  cx={CX}
                  cy={CY}
                  r={RADIUS}
                  stroke={slice.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={slice.dashArray}
                  strokeDashoffset={slice.dashOffset}
                  fill="none"
                  strokeLinecap="butt"
                />
              ))}
            </G>
          </Svg>

          {/* Center Text in DMMono-Medium */}
          <View style={styles.centerTextOverlay} pointerEvents="none">
            <AppText
              style={[
                styles.centerPercentText,
                {
                  color: colors.text.primary,
                  fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                  fontVariant: ['tabular-nums'],
                },
              ]}
            >
              {`${totalShare.toFixed(0)}%`}
            </AppText>
            <AppText
              style={[
                styles.centerSubLabel,
                { color: isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              Territory
            </AppText>
          </View>
        </View>

        {/* Donut Quick Summary Column */}
        <View style={styles.donutSummaryCol}>
          <AppText
            style={[
              styles.summaryHeader,
              { color: colors.text.primary, fontFamily: fontFamilies.primaryBold },
            ]}
          >
            Concentrated Demand
          </AppText>
          <AppText
            style={[
              styles.summaryDesc,
              { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            Top 5 brand molecules account for{' '}
            <AppText isMono style={{ color: colors.text.primary }}>
              {totalShare.toFixed(1)}%
            </AppText>{' '}
            of total verified prescription volume in {territoryName}.
          </AppText>
        </View>
      </View>

      {/* 2. Ranked Legend List */}
      <View style={styles.rankedList}>
        {slices.map((brand) => (
          <View key={brand.id || brand.name} style={styles.brandRow}>
            {/* Color Dot + Rank Badge */}
            <View style={styles.rankLeftGroup}>
              <View style={[styles.colorDot, { backgroundColor: brand.color }]} />
              <View
                style={[
                  styles.rankPill,
                  {
                    backgroundColor:
                      brand.rank === 1
                        ? brand.color
                        : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.06)',
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.rankPillText,
                    {
                      color: brand.rank === 1 ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
                      fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                      fontVariant: ['tabular-nums'],
                    },
                  ]}
                >
                  #{brand.rank}
                </AppText>
              </View>
            </View>

            {/* Brand Title & Molecule */}
            <View style={styles.brandDetailsCol}>
              <AppText
                style={[
                  styles.brandName,
                  { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                ]}
                numberOfLines={1}
              >
                {brand.name}
              </AppText>
              <AppText
                style={[
                  styles.brandGeneric,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
                numberOfLines={1}
              >
                {brand.generic}
              </AppText>
            </View>

            {/* Share Percentage in DMMono-Medium */}
            <View style={styles.shareValueWrap}>
              <AppText
                style={[
                  styles.shareValueText,
                  {
                    color: brand.color,
                    fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                    fontVariant: ['tabular-nums'],
                  },
                ]}
              >
                {brand.sharePct.toFixed(1)}%
              </AppText>
              <AppText
                style={[
                  styles.shareLabelSmall,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                share
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  donutSvgWrap: {
    width: scale(120),
    height: scale(120),
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPercentText: {
    fontSize: scaleFont(19),
    fontWeight: '700',
  },
  centerSubLabel: {
    fontSize: scaleFont(10),
    fontFamily: fontFamilies.primaryMedium,
    marginTop: -2,
  },
  donutSummaryCol: {
    flex: 1,
    marginLeft: scale(14),
    justifyContent: 'center',
  },
  summaryHeader: {
    fontSize: scaleFont(13.5),
    fontWeight: '700',
    marginBottom: verticalScale(3),
  },
  summaryDesc: {
    fontSize: scaleFont(11.5),
    lineHeight: scaleFont(16),
  },
  rankedList: {
    gap: verticalScale(8),
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(4),
  },
  rankLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(10),
  },
  colorDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(8),
  },
  rankPill: {
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: scale(6),
  },
  rankPillText: {
    fontSize: scaleFont(10.5),
    fontWeight: '600',
  },
  brandDetailsCol: {
    flex: 1,
    marginRight: scale(10),
  },
  brandName: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  brandGeneric: {
    fontSize: scaleFont(11),
    marginTop: verticalScale(1),
  },
  shareValueWrap: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  shareValueText: {
    fontSize: scaleFont(13),
    fontWeight: '700',
  },
  shareLabelSmall: {
    fontSize: scaleFont(9.5),
  },
});

export default TerritoryShareDonutChart;
