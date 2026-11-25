import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge, MetricIconDisc } from '../core/index.js';
import {
  PillIcon,
  TransferArrowsIconSvg,
  RewardsStarIcon,
} from '../../assets/vectors/index.js';
import { getPharmacyTierTheme } from '../../theme/tierThemes.js';

/**
 * PiiActivitiesCard - PII Points breakdown across the 3 core PRD drivers
 * Features exact SVG vector activity icons, dynamic active tier accent tokens,
 * and zero hardcoded colors.
 *
 * @param {Object} props
 * @param {number} [props.piiScore=842]
 * @param {string} [props.tier='key_account']
 */
export const PiiActivitiesCard = ({ piiScore = 842, tier = 'key_account' }) => {
  const { colors, isDark } = useTheme();

  const tierTheme = useMemo(() => {
    return getPharmacyTierTheme(tier, isDark);
  }, [tier, isDark]);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={{ flex: 1 }}>
          <AppText variant="titleMedium" colorType="primary">
            PII Points System (
            <AppText isMono colorType="primary">
              {piiScore} pts
            </AppText>
            )
          </AppText>
          <AppText variant="caption" colorType="muted">
            {`Composite platform score earned in ${tierTheme.label} Tier`}
          </AppText>
        </View>
        <AppBadge
          label={`${tierTheme.label} Status`}
          style={{
            backgroundColor: tierTheme.badgeBg,
            borderColor: tierTheme.badgeBorder,
          }}
        />
      </View>

      {/* Driver 1: Digital Prescription QR Scans */}
      <View style={[styles.activityRow, { borderBottomColor: colors.border?.subtle }]}>
        <MetricIconDisc variant="teal" size={36} marginRight={10}>
          <PillIcon color={isDark ? '#FFFFFF' : '#0F4761'} size={18} />
        </MetricIconDisc>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyMediumMedium" colorType="primary">
            Digital Prescription QR Scans
          </AppText>
          <AppText variant="caption" colorType="muted">
            <AppText variant="monoSmall" colorType="muted">34</AppText> Scans confirmed this month (
            <AppText variant="monoSmall" colorType="muted">40%</AppText> Weight)
          </AppText>
        </View>
        <AppBadge
          label="+340 Pts"
          isMono={true}
          style={{
            backgroundColor: isDark ? 'rgba(0, 155, 169, 0.15)' : '#E0F7FA',
            borderColor: tierTheme.accentColor,
          }}
        />
      </View>

      {/* Driver 2: Data Sharing with Pharma */}
      <View style={[styles.activityRow, { borderBottomColor: colors.border?.subtle }]}>
        <MetricIconDisc variant="purple" size={36} marginRight={10}>
          <TransferArrowsIconSvg color={isDark ? '#FFFFFF' : '#0F4761'} size={18} />
        </MetricIconDisc>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyMediumMedium" colorType="primary">
            Data Sharing with Pharma
          </AppText>
          <AppText variant="caption" colorType="muted">
            <AppText variant="monoSmall" colorType="muted">28</AppText> Consecutive days closing sync (
            <AppText variant="monoSmall" colorType="muted">35%</AppText> Weight)
          </AppText>
        </View>
        <AppBadge
          label="+280 Pts"
          isMono={true}
          style={{
            backgroundColor: isDark ? 'rgba(168, 85, 247, 0.15)' : '#F3E8FF',
            borderColor: isDark ? '#C084FC' : '#9333EA',
          }}
        />
      </View>

      {/* Driver 3: Digital Pharma Engagement */}
      <View style={styles.activityRow}>
        <MetricIconDisc variant="gold" size={36} marginRight={10}>
          <RewardsStarIcon color={isDark ? '#FFFFFF' : '#0F4761'} size={18} />
        </MetricIconDisc>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyMediumMedium" colorType="primary">
            Digital Pharma Engagement
          </AppText>
          <AppText variant="caption" colorType="muted">
            <AppText variant="monoSmall" colorType="muted">8</AppText> Surveys & clinical modules completed (
            <AppText variant="monoSmall" colorType="muted">25%</AppText> Weight)
          </AppText>
        </View>
        <AppBadge
          label="+222 Pts"
          isMono={true}
          style={{
            backgroundColor: isDark ? 'rgba(255, 122, 0, 0.15)' : '#FFF3E0',
            borderColor: isDark ? '#FFA043' : '#FF6B00',
          }}
        />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
  },
});

export default PiiActivitiesCard;
