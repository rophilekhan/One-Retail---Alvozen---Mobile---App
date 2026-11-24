import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { GlassCard, AppText, AppBadge, MetricIconDisc } from '../core/index.js';
import {
  TierGemIcon,
  PillIcon,
  TransferArrowsIconSvg,
  RewardsStarIcon,
} from '../../assets/vectors/index.js';
import { getPharmacyTierTheme } from '../../theme/tierThemes.js';

/**
 * PiiScoreBreakdownCard - Visual Composite PII Intelligence & Driver Breakdown
 * Mandated by ONERETAIL_PRD.md:
 * - Pharmacy Impact Index (PII): Score from 0 to 1500
 * - Tiers: General Trade (0-299), Established (300-599), Key Account (600-899), Flagship (900-1500)
 * - 3 Core Drivers: Digital Rx Scans (40%), Pharma Data Sharing (35%), Digital Pharma Engagement (25%)
 * - Driven identically by getPharmacyTierTheme(tier, isDark)
 *
 * @param {Object} props
 * @param {number} [props.score=842]
 * @param {string} [props.tier='Key Account']
 * @param {Object} [props.drivers]
 * @param {Object} [props.style]
 */
export const PiiScoreBreakdownCard = ({
  score = 842,
  tier = 'Key Account',
  drivers,
  style,
}) => {
  const { colors, isDark } = useTheme();

  const tierTheme = useMemo(() => {
    return getPharmacyTierTheme(tier, isDark);
  }, [tier, isDark]);

  const piiDrivers = drivers || {
    rxScansScore: 350,
    rxScansMax: 400,
    dataSharingScore: 295,
    dataSharingMax: 350,
    engagementScore: 197,
    engagementMax: 250,
  };

  const DRIVER_METRICS = [
    {
      id: 'scans',
      title: 'Digital Rx Scans',
      weight: '40% Impact',
      score: piiDrivers.rxScansScore,
      max: piiDrivers.rxScansMax,
      desc: 'Volume of verified QR-coded prescriptions scanned',
      color: tierTheme.accentColor,
      icon: <PillIcon color="#FFFFFF" size={16} />,
      tone: 'teal',
    },
    {
      id: 'data',
      title: 'Pharma Data Sharing',
      weight: '35% Impact',
      score: piiDrivers.dataSharingScore,
      max: piiDrivers.dataSharingMax,
      desc: 'Off-take velocity sharing & reciprocal stock visibility',
      color: tierTheme.secondaryColor || colors.brand?.accent,
      icon: <TransferArrowsIconSvg color="#FFFFFF" size={16} />,
      tone: 'purple',
    },
    {
      id: 'engagement',
      title: 'Digital Pharma Engagement',
      weight: '25% Impact',
      score: piiDrivers.engagementScore,
      max: piiDrivers.engagementMax,
      desc: 'Active trade scheme adoption and manufacturer surveys',
      color: isDark ? '#FBBF24' : '#D97706',
      icon: <RewardsStarIcon color="#FFFFFF" size={16} />,
      tone: 'gold',
    },
  ];

  return (
    <GlassCard style={[styles.card, style]}>
      {/* 1. Header with Official Tier Gem & Active Badge */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <AppText variant="caption" colorType="brand" style={styles.overline}>
            PHARMACY IMPACT INDEX
          </AppText>
          <AppText variant="headlineSmall" colorType="primary" style={styles.title}>
            PII Platform Score
          </AppText>
        </View>

        <View style={styles.tierGemHeader}>
          <MetricIconDisc size={36} isDark={isDark} variant={tierTheme.key} style={{ marginRight: scale(8) }}>
            <TierGemIcon tier={tierTheme.key} size={scale(20)} isApex={true} />
          </MetricIconDisc>
          <AppBadge
            label={tierTheme.label}
            style={{
              backgroundColor: tierTheme.badgeBg,
              borderColor: tierTheme.badgeBorder,
            }}
          />
        </View>
      </View>

      {/* 2. Score Arc Gauge Visual */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreArcWrap}>
          <Svg width={scale(104)} height={scale(104)} viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
              strokeWidth="9"
              fill="none"
            />
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke={tierTheme.accentColor}
              strokeWidth="9"
              strokeDasharray={`${(score / 1500) * 251.2} 251.2`}
              strokeDashoffset="0"
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 50 50)"
            />
          </Svg>
          <View style={styles.scoreCenterText}>
            <AppText
              style={[
                styles.scoreNumber,
                {
                  color: colors.text.primary,
                  fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                },
              ]}
            >
              {score}
            </AppText>
            <AppText
              style={[
                styles.scoreMax,
                {
                  color: isDark ? '#94A3B8' : '#64748B',
                  fontFamily: fontFamilies.monoRegular || 'DMMono-Regular',
                },
              ]}
            >
              / 1500
            </AppText>
          </View>
        </View>

        <View style={styles.scoreSummary}>
          <AppText variant="bodyMediumMedium" colorType="primary">
            {`${tierTheme.label} Status`}
          </AppText>
          <AppText variant="caption" colorType="muted" style={styles.tierDesc}>
            Verified off-take volume, reciprocal SKU visibility, and trade scheme participation.
          </AppText>
          <View style={styles.rankPill}>
            <AppText
              style={[styles.rankText, { color: tierTheme.accentColor }]}
            >
              Top 8% in Territory
            </AppText>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border?.subtle }]} />

      {/* 3. Driver Breakdown (3 Vertical Progress Rows) */}
      <AppText variant="titleSmall" colorType="primary" style={styles.driversHeading}>
        Score Activity Drivers
      </AppText>

      <View style={styles.driversList}>
        {DRIVER_METRICS.map((driver) => {
          const progressPct = Math.min(100, Math.round((driver.score / driver.max) * 100));

          return (
            <View key={driver.id} style={styles.driverItem}>
              <View style={styles.driverTopRow}>
                <MetricIconDisc variant={driver.tone} size={32} marginRight={8}>
                  {driver.icon}
                </MetricIconDisc>

                <View style={styles.driverMeta}>
                  <View style={styles.driverTitleRow}>
                    <AppText
                      style={[
                        styles.driverTitleText,
                        { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
                      ]}
                      numberOfLines={1}
                    >
                      {driver.title}
                    </AppText>
                    <AppText variant="caption" colorType="muted">
                      {driver.weight}
                    </AppText>
                  </View>
                  <AppText variant="caption" colorType="muted" numberOfLines={1}>
                    {driver.desc}
                  </AppText>
                </View>

                <View style={styles.driverPointsWrap}>
                  <AppText
                    style={[
                      styles.driverScoreValue,
                      {
                        color: colors.text.primary,
                        fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                      },
                    ]}
                  >
                    {driver.score}
                  </AppText>
                  <AppText
                    style={[
                      styles.driverScoreMax,
                      {
                        color: isDark ? '#94A3B8' : '#64748B',
                        fontFamily: fontFamilies.monoRegular || 'DMMono-Regular',
                      },
                    ]}
                  >
                    /{driver.max}
                  </AppText>
                </View>
              </View>

              <View
                style={[
                  styles.progressBarBg,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                  },
                ]}
              >
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progressPct}%`,
                      backgroundColor: driver.color,
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
  card: {
    padding: scale(16),
    marginVertical: verticalScale(6),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  titleWrap: {
    flex: 1,
    paddingRight: scale(8),
  },
  overline: {
    letterSpacing: 0.8,
    fontSize: scaleFont(9.5),
    fontWeight: '700',
  },
  title: {
    letterSpacing: -0.3,
    marginTop: verticalScale(2),
  },
  tierGemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  scoreArcWrap: {
    width: scale(104),
    height: scale(104),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: scaleFont(22),
    fontWeight: '700',
  },
  scoreMax: {
    fontSize: scaleFont(10),
    marginTop: -2,
  },
  scoreSummary: {
    flex: 1,
    marginLeft: scale(14),
  },
  tierDesc: {
    marginTop: verticalScale(2),
    lineHeight: scaleFont(15),
  },
  rankPill: {
    marginTop: verticalScale(6),
  },
  rankText: {
    fontSize: scaleFont(11.5),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: verticalScale(12),
  },
  driversHeading: {
    marginBottom: verticalScale(10),
  },
  driversList: {
    gap: verticalScale(12),
  },
  driverItem: {
    width: '100%',
  },
  driverTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  driverMeta: {
    flex: 1,
    marginRight: scale(10),
  },
  driverTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverTitleText: {
    flex: 1,
    fontSize: scaleFont(13),
    fontWeight: '600',
    marginRight: scale(6),
  },
  driverPointsWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexShrink: 0,
  },
  driverScoreValue: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  driverScoreMax: {
    fontSize: scaleFont(10.5),
  },
  progressBarBg: {
    height: verticalScale(5),
    borderRadius: scale(3),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: scale(3),
  },
});

export default PiiScoreBreakdownCard;
