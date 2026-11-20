import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge } from '../core/index.js';

/**
 * PrescriptionsPerDayWidget - 7-Day Rx Scanning Trend & Velocity
 *
 * @param {Object} props
 * @param {number} [props.todayCount=34] - Scanned today
 * @param {number} [props.weeklyAverage=29] - Daily average
 * @param {Array<number>} [props.weekData=[22, 28, 35, 30, 42, 38, 34]] - Daily counts
 */
export const PrescriptionsPerDayWidget = ({
  todayCount = 34,
  weeklyAverage = 29,
  weekData = [22, 28, 35, 30, 42, 38, 34],
}) => {
  const { colors, isDark } = useTheme();

  const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const maxVal = Math.max(...weekData, 45);

  return (
    <GlassCard style={styles.card}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <AppText variant="caption" colorType="brand" style={styles.overline}>
            SCAN VELOCITY
          </AppText>
          <AppText variant="titleMedium" colorType="primary" style={styles.title}>
            Prescriptions Per Day
          </AppText>
        </View>

        <AppBadge label="+18% vs Last Wk" variant="success" size="sm" />
      </View>

      {/* Main Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <AppText variant="displaySmall" colorType="brand" style={styles.statVal}>
            {todayCount}
          </AppText>
          <AppText variant="caption" colorType="muted">
            Today's Scanned Rx
          </AppText>
        </View>

        <View style={[styles.statDivider, { backgroundColor: colors.border?.subtle }]} />

        <View style={styles.statItem}>
          <AppText variant="headlineSmall" colorType="primary" style={styles.statVal}>
            {weeklyAverage}
          </AppText>
          <AppText variant="caption" colorType="muted">
            7-Day Daily Avg
          </AppText>
        </View>
      </View>

      {/* 7-Day Bar Chart Sparkline */}
      <View style={styles.chartContainer}>
        {weekData.map((val, idx) => {
          const heightPct = Math.min(100, Math.max(12, Math.round((val / maxVal) * 100)));
          const isToday = idx === weekData.length - 1;

          return (
            <View key={idx} style={styles.barCol}>
              <View
                style={[
                  styles.barTrack,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' },
                ]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${heightPct}%`,
                      backgroundColor: isToday
                        ? colors.brand?.primary
                        : isDark
                        ? 'rgba(0, 155, 169, 0.45)'
                        : 'rgba(0, 155, 169, 0.35)',
                    },
                  ]}
                />
              </View>
              <AppText
                variant="caption"
                colorType={isToday ? 'brand' : 'muted'}
                style={[styles.dayLabel, isToday && { fontWeight: '700' }]}
              >
                {DAYS[idx]}
              </AppText>
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
    marginBottom: verticalScale(14),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(10),
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  statItem: {
    flex: 1,
  },
  statVal: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statDivider: {
    width: 1,
    height: verticalScale(36),
    marginHorizontal: scale(14),
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: verticalScale(74),
    paddingTop: verticalScale(8),
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: scale(14),
    height: verticalScale(50),
    borderRadius: scale(7),
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: scale(7),
  },
  dayLabel: {
    marginTop: verticalScale(4),
    fontSize: scale(10),
  },
});

export default PrescriptionsPerDayWidget;
