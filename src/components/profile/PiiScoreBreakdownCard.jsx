import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge, MetricIconDisc } from '../core/index.js';
import {
  TierGemIcon,
  PillIcon,
  TransferArrowsIconSvg,
  RewardsStarIcon,
} from '../../assets/vectors/index.js';

/**
 * PiiScoreBreakdownCard - Visual Composite PII Intelligence & Driver Breakdown
 * Mandated by ONERETAIL_PRD.md:
 * - Pharmacy Impact Index (PII): Score from 0 to 1500
 * - Tiers: General Trade (0-299), Established (300-599), Key Account (600-899), Flagship (900-1500)
 * - 3 Core Drivers: Digital Rx Scans (40%), Pharma Data Sharing (35%), Digital Pharma Engagement (25%)
 * - Wire exact Figma tier gems & vector icons
 */
export const PiiScoreBreakdownCard = ({
  score = 842,
  tier = 'Key Account',
  drivers,
  style,
}) => {
  const { colors, isDark } = useTheme();

  const getTierBadgeVariant = (tierName) => {
    switch (tierName) {
      case 'Flagship':
        return 'success';
      case 'Key Account':
        return 'accent';
      case 'Established':
        return 'brand';
      case 'General Trade':
      default:
        return 'neutral';
    }
  };

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
      color: colors.brand?.primary,
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
      color: colors.brand?.accent,
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
      color: isDark ? '#A78BFA' : '#7C3AED',
      icon: <RewardsStarIcon color="#FFFFFF" size={16} />,
      tone: 'gold',
    },
  ];

  return (
    <GlassCard style={[styles.card, style]}>
      {/* 1. Header with Official Tier Gem */}
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
          <TierGemIcon tier={tier} size={36} isApex={true} style={{ marginRight: 8 }} />
          <AppBadge
            label={tier}
            variant={getTierBadgeVariant(tier)}
            size="md"
          />
        </View>
      </View>

      {/* 2. Score Arc Gauge Visual */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreArcWrap}>
          <Svg width={scale(110)} height={scale(110)} viewBox="0 0 100 100">
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
              stroke={colors.brand?.primary}
              strokeWidth="9"
              strokeDasharray={`${(score / 1500) * 251.2} 251.2`}
              strokeDashoffset="0"
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 50 50)"
            />
          </Svg>
          <View style={styles.scoreCenterText}>
            <AppText variant="headlineMedium" colorType="primary" style={styles.scoreNumber}>
              {score}
            </AppText>
            <AppText variant="caption" colorType="muted" style={styles.scoreMax}>
              / 1500
            </AppText>
          </View>
        </View>

        <View style={styles.scoreSummary}>
          <AppText variant="bodyMediumMedium" colorType="primary">
            {tier} Status
          </AppText>
          <AppText variant="caption" colorType="muted" style={styles.tierDesc}>
            Earn higher cashout multipliers on prescription QR scans and early access to manufacturer trade schemes.
          </AppText>
          <AppText variant="caption" colorType="brand" style={styles.rankText}>
            Top 8% in Territory
          </AppText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border?.subtle }]} />

      {/* 3. Driver Breakdown */}
      <AppText variant="titleSmall" colorType="primary" style={styles.driversHeading}>
        Score Activity Drivers
      </AppText>

      <View style={styles.driversList}>
        {DRIVER_METRICS.map((driver) => {
          const progressPct = Math.round((driver.score / driver.max) * 100);

          return (
            <View key={driver.id} style={styles.driverItem}>
              <View style={styles.driverTopRow}>
                <MetricIconDisc variant={driver.tone} size={32} marginRight={8}>
                  {driver.icon}
                </MetricIconDisc>

                <View style={styles.driverMeta}>
                  <View style={styles.driverTitleRow}>
                    <AppText variant="bodySmallMedium" colorType="primary">
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
                  <AppText variant="bodySmallMedium" colorType="primary">
                    {driver.score}
                  </AppText>
                  <AppText variant="caption" colorType="muted">
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
    marginVertical: verticalScale(8),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  titleWrap: {
    flex: 1,
  },
  overline: {
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    letterSpacing: -0.3,
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
    width: scale(110),
    height: scale(110),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontWeight: '700',
    lineHeight: scale(28),
  },
  scoreMax: {
    fontSize: scale(10),
  },
  scoreSummary: {
    flex: 1,
    marginLeft: scale(16),
  },
  tierDesc: {
    marginTop: 4,
    lineHeight: scale(16),
  },
  rankText: {
    marginTop: 6,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: verticalScale(10),
  },
  driversHeading: {
    marginBottom: verticalScale(10),
  },
  driversList: {
    gap: verticalScale(10),
  },
  driverItem: {
    width: '100%',
  },
  driverTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  driverMeta: {
    flex: 1,
    marginRight: scale(8),
  },
  driverTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverPointsWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  progressBarBg: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default PiiScoreBreakdownCard;
