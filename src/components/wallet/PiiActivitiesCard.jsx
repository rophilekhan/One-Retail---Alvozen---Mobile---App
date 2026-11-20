import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge, MetricIconDisc } from '../core/index.js';
import {
  PillIcon,
  TransferArrowsIconSvg,
  RewardsStarIcon,
} from '../../assets/vectors/index.js';

/**
 * PiiActivitiesCard - PII Points breakdown across the 3 core PRD drivers
 * Features exact SVG vector activity icons (Zero emoji/text placeholders).
 *
 * @param {Object} props
 * @param {number} props.piiScore
 */
export const PiiActivitiesCard = ({ piiScore = 842 }) => {
  const { colors } = useTheme();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={{ flex: 1 }}>
          <AppText variant="titleMedium" colorType="primary">
            PII Points System ({piiScore} pts)
          </AppText>
          <AppText variant="caption" colorType="muted">
            Composite platform score earned across 3 core activities
          </AppText>
        </View>
        <AppBadge label="Top 8% Peer Tier" variant="success" />
      </View>

      {/* Driver 1: Digital Prescription QR Scans */}
      <View style={[styles.activityRow, { borderBottomColor: colors.border?.subtle }]}>
        <MetricIconDisc variant="teal" size={36} marginRight={10}>
          <PillIcon color="#FFFFFF" size={18} />
        </MetricIconDisc>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyMediumMedium" colorType="primary">Digital Prescription QR Scans</AppText>
          <AppText variant="caption" colorType="muted">34 Scans confirmed this month</AppText>
        </View>
        <AppBadge label="+340 Pts" variant="brand" />
      </View>

      {/* Driver 2: Data Sharing with Pharma */}
      <View style={[styles.activityRow, { borderBottomColor: colors.border?.subtle }]}>
        <MetricIconDisc variant="purple" size={36} marginRight={10}>
          <TransferArrowsIconSvg color="#FFFFFF" size={18} />
        </MetricIconDisc>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyMediumMedium" colorType="primary">Data Sharing with Pharma</AppText>
          <AppText variant="caption" colorType="muted">28 Consecutive days closing sync</AppText>
        </View>
        <AppBadge label="+280 Pts" variant="brand" />
      </View>

      {/* Driver 3: Digital Pharma Engagement */}
      <View style={styles.activityRow}>
        <MetricIconDisc variant="gold" size={36} marginRight={10}>
          <RewardsStarIcon color="#FFFFFF" size={18} />
        </MetricIconDisc>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyMediumMedium" colorType="primary">Digital Pharma Engagement</AppText>
          <AppText variant="caption" colorType="muted">8 Surveys & clinical modules completed</AppText>
        </View>
        <AppBadge label="+222 Pts" variant="brand" />
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
