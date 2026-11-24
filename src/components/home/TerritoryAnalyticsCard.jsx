import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText, AppToast, AppWelcomeBadge } from '../core/index.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { TierGemIcon } from '../../assets/vectors/ImpactIcons.jsx';
import { RxTrendAreaChart } from './RxTrendAreaChart.jsx';

const PERIOD_CONFIGS = {
  Today: {
    heroCount: '38',
    growthText: '+14.2% vs yesterday',
    periodLabel: 'Today\nAug 2026',
    sparkline: [
      { day: 'Mon', count: 28, heightRatio: 24 },
      { day: 'Tue', count: 32, heightRatio: 28 },
      { day: 'Wed', count: 35, heightRatio: 32 },
      { day: 'Thu', count: 30, heightRatio: 26 },
      { day: 'Fri', count: 42, heightRatio: 40 },
      { day: 'Sat', count: 34, heightRatio: 30 },
      { day: 'Sun', count: 38, heightRatio: 36 },
    ],
  },
  '7 Days': {
    heroCount: '266',
    growthText: '+18.5% vs last week',
    periodLabel: '7 Days\nAug 2026',
    sparkline: [
      { day: 'Mon', count: 34, heightRatio: 28 },
      { day: 'Tue', count: 38, heightRatio: 32 },
      { day: 'Wed', count: 42, heightRatio: 36 },
      { day: 'Thu', count: 35, heightRatio: 30 },
      { day: 'Fri', count: 45, heightRatio: 42 },
      { day: 'Sat', count: 38, heightRatio: 32 },
      { day: 'Sun', count: 42, heightRatio: 36 },
    ],
  },
  '30 Days': {
    heroCount: '1,142',
    growthText: '+22.4% vs last month',
    periodLabel: '30 Days\nAug 2026',
    sparkline: [
      { day: 'Mon', count: 140, heightRatio: 30 },
      { day: 'Tue', count: 162, heightRatio: 34 },
      { day: 'Wed', count: 175, heightRatio: 38 },
      { day: 'Thu', count: 155, heightRatio: 32 },
      { day: 'Fri', count: 195, heightRatio: 42 },
      { day: 'Sat', count: 160, heightRatio: 35 },
      { day: 'Sun', count: 155, heightRatio: 32 },
    ],
  },
};

/**
 * TerritoryAnalyticsCard
 * Rebuilt verbatim to OneRx DashboardMetrics.jsx:
 * 1. Segmented Control Filter Pills (Today, 7 Days, 30 Days)
 * 2. Big DM Mono 56px counter & period label
 * 3. AppWelcomeBadge delta trend capsule with arrow vector
 * 4. Interactive 7-Day Sparkline Bar Breakdown with popover capsule
 * 5. 362x58 Total PII Points capsule leading to PharmacyImpactIndex
 */
export const TerritoryAnalyticsCard = ({
  territoryName = 'PECHS Territory',
}) => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const pharmacy = usePharmacyStore();
  const piiPoints = pharmacy.piiPoints || 842;
  const piiTier = pharmacy.piiTier || 'Key Account';

  const [activePeriod, setActivePeriod] = useState('Today');
  const [selectedDayIdx, setSelectedDayIdx] = useState(4); // Default Friday (Fri is active)

  const currentConfig = PERIOD_CONFIGS[activePeriod] || PERIOD_CONFIGS.Today;
  const days = currentConfig.sparkline;
  const selectedDay = days[selectedDayIdx] || days[4];

  const badgeWidth = scale(171);
  const badgeHeight = verticalScale(32);
  const badgeRadius = scale(16);

  const handleDayPress = (idx) => {
    setSelectedDayIdx(idx);
  };

  const handlePointsPress = () => {
    try {
      navigation.navigate('ImpactWallet');
    } catch {
      navigation.navigate('PharmacyProfile');
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Top Toggle Segmented Control (Exact 240px x 32px pill) */}
      <View
        style={styles.toggleRow}
        accessible={true}
        accessibilityRole="tablist"
      >
        {['Today', '7 Days', '30 Days'].map((period) => {
          const isSelected = activePeriod === period;
          return (
            <TouchableOpacity
              key={period}
              style={[
                styles.tabButton,
                {
                  backgroundColor: isSelected
                    ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')
                    : 'transparent',
                },
              ]}
              onPress={() => setActivePeriod(period)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${period} Filter Tab`}
            >
              <AppText
                style={[
                  styles.tabText,
                  {
                    color: isSelected
                      ? (isDark ? '#FFFFFF' : '#020202')
                      : (isDark ? '#787878' : '#ABABAB'),
                    fontFamily: isSelected ? 'DMSans-Medium' : 'DMSans-Regular',
                    fontWeight: isSelected ? '500' : '400',
                  },
                ]}
              >
                {period}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. Main Metric Counter Area (DM Mono 56px counter & Period Label) */}
      <View
        style={styles.counterRow}
        accessible={true}
        accessibilityLabel={`Prescriptions scanned: ${selectedDay ? selectedDay.count : currentConfig.heroCount}`}
      >
        <AppText
          style={[
            styles.mainCount,
            { color: isDark ? '#FFFFFF' : '#020202', fontFamily: fontFamilies.monoMedium || 'DMMono-Medium' },
          ]}
        >
          {selectedDay ? selectedDay.count : currentConfig.heroCount}
        </AppText>
        <View style={styles.monthCol}>
          <AppText
            style={[
              styles.monthText,
              { color: isDark ? '#ABABAB' : '#787878' },
            ]}
          >
            {selectedDay ? `${selectedDay.day} Scans\nAug 2026` : currentConfig.periodLabel}
          </AppText>
        </View>
      </View>

      {/* 3. Growth Badge using AppWelcomeBadge */}
      <View style={styles.growthBadgeWrap}>
        <AppWelcomeBadge
          width={badgeWidth}
          height={badgeHeight}
          borderRadius={badgeRadius}
          style={styles.welcomeBadgeOverride}
          onPress={() => {
            AppToast.show({
              title: 'Prescription Growth',
              message: `${currentConfig.growthText} across ${territoryName}`,
              type: 'info',
            });
          }}
        >
          <View style={styles.growthInnerRow}>
            <AppText
              style={[
                styles.growthText,
                { color: isDark ? '#FFFFFF' : '#020202' },
              ]}
            >
              {currentConfig.growthText}
            </AppText>
            <Svg
              width={scale(13)}
              height={scale(7)}
              viewBox="0 0 13 7"
              fill="none"
              style={styles.trendIcon}
            >
              <Path
                d="M0.146447 6.14645C-0.0488155 6.34171 -0.0488155 6.65829 0.146447 6.85355C0.341709 7.04882 0.658291 7.04882 0.853553 6.85355L0.5 6.5L0.146447 6.14645ZM3.28571 3.71429L3.63927 4.06784L3.63928 4.06783L3.28571 3.71429ZM4.4366 2.79514L4.3009 2.3139L4.30082 2.31393L4.4366 2.79514ZM5.13483 2.79514L5.27061 2.31393L5.27053 2.3139L5.13483 2.79514ZM7.4366 4.6334L7.57243 4.1522L7.57231 4.15217L7.4366 4.6334ZM8.13483 4.6334L7.99912 4.1522L7.999 4.1522L8.13483 4.6334ZM13 0.5C13 0.223858 12.7761 0 12.5 0H8C7.72386 0 7.5 0.223858 7.5 0.5C7.5 0.776142 7.72386 1 8 1H12V5C12 5.27614 12.2239 5.5 12.5 5.5C12.7761 5.5 13 5.27614 13 5V0.5ZM0.5 6.5L0.853553 6.85355L3.63927 4.06784L3.28571 3.71429L2.93216 3.36073L0.146447 6.14645L0.5 6.5ZM3.28571 3.71429L3.63928 4.06783C3.92163 3.78546 4.11068 3.59705 4.26817 3.46515C4.42058 3.3375 4.50715 3.29475 4.57238 3.27635L4.4366 2.79514L4.30082 2.31393C4.04325 2.3866 3.8304 2.52739 3.62608 2.69852C3.42683 2.8654 3.20185 3.09103 2.93215 3.36075L3.28571 3.71429ZM4.4366 2.79514L4.5723 3.27637C4.71191 3.237 4.85952 3.237 4.99913 3.27637L5.13483 2.79514L5.27053 2.3139C4.95345 2.22449 4.61798 2.22449 4.3009 2.3139L4.4366 2.79514ZM5.13483 2.79514L4.99905 3.27635C5.06427 3.29475 5.15083 3.33749 5.30324 3.46514C5.46073 3.59705 5.64978 3.78546 5.93216 4.06784L6.28571 3.71429L6.63927 3.36073C6.36956 3.09102 6.14457 2.8654 5.94534 2.69853C5.74103 2.5274 5.52819 2.3866 5.27061 2.31393L5.13483 2.79514ZM6.28571 3.71429L5.93216 4.06784C6.20187 4.33754 6.42685 4.56318 6.62609 4.73005C6.8304 4.90118 7.04327 5.04198 7.30089 5.11463L7.4366 4.6334L7.57231 4.15217C7.50713 4.13379 7.4206 4.09108 7.26819 3.96343C7.1107 3.83152 6.92165 3.64311 6.63927 3.36073L6.28571 3.71429ZM7.4366 4.6334L7.30077 5.1146C7.61793 5.20413 7.9535 5.20413 8.27066 5.1146L8.13483 4.6334L7.999 4.1522C7.85947 4.19159 7.71196 4.19159 7.57243 4.1522L7.4366 4.6334ZM8.13483 4.6334L8.27053 5.11463C8.52816 5.04198 8.74102 4.90118 8.94534 4.73005C9.14457 4.56318 9.36956 4.33754 9.63927 4.06784L9.28571 3.71429L8.93216 3.36073C8.64978 3.64311 8.46073 3.83152 8.30324 3.96343C8.15083 4.09108 8.0643 4.13379 7.99912 4.15217L8.13483 4.6334ZM9.28571 3.71429L9.63927 4.06784L12.8536 0.853553L12.5 0.5L12.1464 0.146447L8.93216 3.36073L9.28571 3.71429Z"
                fill={isDark ? '#85CCC3' : '#009BA9'}
              />
            </Svg>
          </View>
        </AppWelcomeBadge>
      </View>

      {/* 4. Weekly Activity Graph - Smooth SVG Area & Line Chart */}
      <RxTrendAreaChart
        data={days}
        selectedIdx={selectedDayIdx}
        onSelectDay={handleDayPress}
        brandColor={isDark ? '#009BA9' : '#0F4761'}
      />

      {/* 5. Points Card (Exact 362px x 58px Capsule from OneRx Figma) */}
      <TouchableOpacity
        style={[
          styles.pointsCard,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : '#F5F5F5',
          },
        ]}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Total PII points: ${piiPoints}`}
        onPress={handlePointsPress}
      >
        <View style={styles.pointsLeft}>
          <View
            style={[
              styles.gemIconWrap,
              {
                backgroundColor: isDark ? 'rgba(251, 107, 3, 0.15)' : 'rgba(251, 107, 3, 0.10)',
              },
            ]}
          >
            <TierGemIcon tier={piiTier} size={22} isApex={false} />
          </View>
          <AppText
            style={[
              styles.pointsCount,
              { color: isDark ? '#FFFFFF' : '#020202' },
            ]}
          >
            {piiPoints}
          </AppText>
          <AppText
            style={[
              styles.pointsLabel,
              { color: isDark ? '#ABABAB' : '#787878' },
            ]}
          >
            Total PII Points
          </AppText>
        </View>

        <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 6L15 12L9 18"
            stroke="#ABABAB"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(240),
    height: verticalScale(32),
    backgroundColor: 'transparent',
    marginBottom: verticalScale(16),
  },
  tabButton: {
    flex: 1,
    height: verticalScale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: scaleFont(12),
    letterSpacing: -0.2,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(10),
  },
  mainCount: {
    fontFamily: 'DMMono-Regular',
    fontWeight: '400',
    fontSize: scaleFont(56),
    lineHeight: verticalScale(48),
    letterSpacing: -1.4,
    marginRight: scale(12),
    includeFontPadding: false,
  },
  monthCol: {
    justifyContent: 'center',
  },
  monthText: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    letterSpacing: -0.2,
    textAlign: 'left',
  },
  growthBadgeWrap: {
    marginBottom: verticalScale(18),
    alignItems: 'center',
  },
  welcomeBadgeOverride: {
    alignSelf: 'center',
    marginBottom: 0,
  },
  growthInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  growthText: {
    fontFamily: 'DMMono-Medium',
    fontWeight: '500',
    fontSize: scaleFont(11),
    lineHeight: scaleFont(12),
    letterSpacing: -0.6,
  },
  trendIcon: {
    marginLeft: scale(6),
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: scale(362),
    height: verticalScale(72),
    marginBottom: verticalScale(18),
    alignSelf: 'center',
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  columnDivider: {
    width: StyleSheet.hairlineWidth,
    height: verticalScale(42),
    alignSelf: 'flex-start',
  },
  barsArea: {
    height: verticalScale(42),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  linesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: scale(28),
  },
  vertLine: {
    width: scale(1.5),
    borderRadius: scale(1),
  },
  popoverWrap: {
    position: 'absolute',
    top: verticalScale(13),
    alignSelf: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: scale(200),
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popoverText: {
    fontFamily: 'DMMono-Medium',
    fontSize: scaleFont(12),
    lineHeight: verticalScale(12),
    color: '#FFFFFF',
  },
  labelBottomArea: {
    marginTop: verticalScale(12),
    height: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabelWrap: {
    height: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDayLabelWrap: {
    backgroundColor: '#FFFFFF',
    width: scale(26),
    borderRadius: scale(4),
  },
  dayText: {
    fontSize: scaleFont(12),
    lineHeight: verticalScale(16),
    letterSpacing: -0.2,
  },
  pointsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: scale(362),
    height: verticalScale(58),
    paddingHorizontal: scale(12),
    borderRadius: scale(24),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    alignSelf: 'center',
  },
  pointsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gemIconWrap: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
  },
  pointsCount: {
    fontFamily: 'DMMono-Regular',
    fontSize: scaleFont(24),
    lineHeight: verticalScale(24),
    marginRight: scale(8),
    includeFontPadding: false,
  },
  pointsLabel: {
    fontFamily: 'DMSans-Regular',
    fontSize: scaleFont(12),
    lineHeight: verticalScale(16),
  },
});

export default TerritoryAnalyticsCard;
