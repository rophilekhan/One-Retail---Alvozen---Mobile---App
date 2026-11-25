import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, fontFamilies } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  PHARMACY_TIERS_CONFIG,
  normalizePharmacyTier,
  resolveTierFromPoints,
} from '../../theme/tierThemes.js';
import { GlassCard, AppText, AppBadge, MetricIconDisc } from '../core/index.js';

/**
 * High-contrast monochrome Tier Gem outline icon sized cleanly for MetricIconDisc.
 */
const TierGemSvg = ({ size = 20, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.5 4H17.5L21 9.5L12 20.5L3 9.5L6.5 4Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 9.5H21M9 4L7.5 9.5L12 20.5L16.5 9.5L15 4"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const unwrapTierLabel = (tier, numericScore) => {
  if (tier && typeof tier === 'object') {
    const raw = tier.name || tier.label || tier.key;
    if (raw) {
      const normalized = normalizePharmacyTier(raw);
      return PHARMACY_TIERS_CONFIG[normalized]?.label || String(raw);
    }
  }
  const normalizedKey = tier
    ? normalizePharmacyTier(tier)
    : resolveTierFromPoints(numericScore);
  return PHARMACY_TIERS_CONFIG[normalizedKey]?.label || 'Key Account';
};

/**
 * PiiScoreBreakdownCard - Composite Pharmacy Impact Index (PII) Card
 * Strict vertical rhythm with zero double-padding inside GlassCard.
 */
export const PiiScoreBreakdownCard = ({
  score = 842,
  tier = 'Key Account',
  drivers,
  style,
}) => {
  const { colors, isDark, radii, spacing } = useTheme();

  const numericScore = Number.isFinite(Number(score)) ? Number(score) : 842;
  const activeTierName = useMemo(
    () => unwrapTierLabel(tier, numericScore),
    [tier, numericScore]
  );

  const discIconColor = isDark ? colors.text.primary : colors.brand.primaryDark;
  const dividerColor = colors.surface?.divider || colors.border.subtle;
  const trackBgColor = isDark ? colors.surface.badge : colors.border.subtle;

  const resolvedDrivers = useMemo(() => {
    const src = drivers || {};
    return [
      {
        id: 'scans',
        title: 'Digital Rx QR Scans',
        score: Number(src.rxScansScore ?? 320),
        max: Number(src.rxScansMax ?? 400),
      },
      {
        id: 'data',
        title: 'Pharma Industry Data Sharing',
        score: Number(src.dataSharingScore ?? 295),
        max: Number(src.dataSharingMax ?? 350),
      },
      {
        id: 'engagement',
        title: 'Digital Pharma Engagement',
        score: Number(src.engagementScore ?? 197),
        max: Number(src.engagementMax ?? 250),
      },
    ];
  }, [drivers]);

  return (
    <GlassCard style={style}>
      {/* Header Row */}
      <View style={[styles.headerRow, { gap: spacing.sm }]}>
        <View style={[styles.headerLeft, { gap: spacing.sm }]}>
          <MetricIconDisc size={40} variant="first_visit">
            <TierGemSvg size={scale(20)} color={discIconColor} />
          </MetricIconDisc>

          <View style={styles.scoreCol}>
            <AppText
              style={[styles.scoreLabel, { color: colors.text.secondary }]}
              numberOfLines={1}
            >
              Composite PII Score
            </AppText>
            <AppText
              isMono
              style={[styles.scoreValue, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {numericScore}
            </AppText>
          </View>
        </View>

        <View style={styles.tierBadgeWrap}>
          <AppBadge label={activeTierName} variant="accent" />
        </View>
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          { backgroundColor: dividerColor, marginVertical: spacing.md },
        ]}
      />

      {/* 3 Aligned Driver Progress Rows */}
      <View style={[styles.driversList, { gap: spacing.sm }]}>
        {resolvedDrivers.map((driver) => {
          const safeMax = driver.max > 0 ? driver.max : 1;
          const fillRatio = Math.min(
            100,
            Math.max(0, Math.round((driver.score / safeMax) * 100))
          );

          return (
            <View key={driver.id} style={styles.driverRow}>
              <View style={styles.driverTopRow}>
                <AppText
                  style={[
                    styles.driverTitle,
                    { color: colors.text.primary, marginRight: spacing.sm },
                  ]}
                  numberOfLines={1}
                >
                  {driver.title}
                </AppText>
                <AppText
                  isMono
                  style={[styles.driverPoints, { color: colors.text.secondary }]}
                  numberOfLines={1}
                >
                  {`${driver.score} / ${safeMax} pts`}
                </AppText>
              </View>

              <View
                style={[
                  styles.progressTrack,
                  {
                    backgroundColor: trackBgColor,
                    borderRadius: radii.pill,
                  },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${fillRatio}%`,
                      backgroundColor: colors.brand.primary,
                      borderRadius: radii.pill,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scoreCol: {
    flex: 1,
  },
  scoreLabel: {
    fontFamily: fontFamilies.primaryRegular,
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
  },
  scoreValue: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: scaleFont(22),
    lineHeight: scaleFont(26),
    fontVariant: ['tabular-nums'],
    marginTop: verticalScale(2),
  },
  tierBadgeWrap: {
    flexShrink: 0,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  driversList: {
    width: '100%',
  },
  driverRow: {
    width: '100%',
  },
  driverTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  driverTitle: {
    flex: 1,
    fontFamily: fontFamilies.primaryMedium,
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
  },
  driverPoints: {
    flexShrink: 0,
    fontFamily: fontFamilies.monoMedium,
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    width: '100%',
    height: verticalScale(6),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

export default PiiScoreBreakdownCard;
