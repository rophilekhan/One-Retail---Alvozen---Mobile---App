import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import {
  AppScreenContainer,
  AppText,
  GlassCard,
  AppBackButton,
} from '../../components/core/index.js';
import {
  PointTransactionCard,
  FilterTabs,
} from '../../components/wallet/index.js';
import { PointsOfficialGraphic } from '../../assets/vectors/ImpactIcons.jsx';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Point Transactions Data matching OneRetail pharmacy activity pillars
 */
const MOCK_TRANSACTIONS = [
  {
    id: 'tx-1',
    badges: ['QR Prescription Scan', 'RX-82910'],
    description: 'Scanned & validated patient prescription for Panadol 500mg',
    timestamp: '15 Nov, 2:45 PM',
    points: 40,
    currencyValue: '20 Rs',
  },
  {
    id: 'tx-2',
    badges: ['Pharma Data Sharing', 'Daily Sync'],
    description: 'Synced end-of-day de-identified dispensary closing movement',
    timestamp: '15 Nov, 11:30 PM',
    points: 70,
    currencyValue: '35 Rs',
  },
  {
    id: 'tx-3',
    badges: ['Digital Engagement', 'Survey'],
    description: 'Completed GSK clinical availability awareness module',
    timestamp: '14 Nov, 4:15 PM',
    points: 50,
    currencyValue: '25 Rs',
  },
  {
    id: 'tx-4',
    badges: ['QR Prescription Scan', 'RX-82894'],
    description: 'Dispensed Augmentin 625mg via digital generic matching',
    timestamp: '14 Nov, 1:20 PM',
    points: 40,
    currencyValue: '20 Rs',
  },
  {
    id: 'tx-5',
    badges: ['Reciprocal Visibility', 'Stock Alert'],
    description: 'Supplied out-of-stock antibiotic to nearby partner pharmacy',
    timestamp: '12 Nov, 6:10 PM',
    points: 100,
    currencyValue: '50 Rs',
  },
];

const PERIOD_OPTIONS = [
  'This Month',
  'Last Month',
  'Last 3 Months',
  'All Time',
];

/**
 * PointsEarnedScreen
 *
 * Dedicated points history and rewards tracking screen matching OneRx layout:
 * - AppBackButton + left-aligned header title
 * - Glassmorphic Hero Card with centered dual coins graphic, mono score & fiat value
 * - Section header with 'Points Earned' and FilterTabs
 * - Clean solid PointTransactionCard list
 */
export const PointsEarnedScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('This Month');

  return (
    <AppScreenContainer
      withAmbientGlow={true}
      keyboardAvoiding={false}
      withHorizontalPadding={false}
    >
      {/* 1. Header with AppBackButton and left-aligned title */}
      <View style={styles.headerRow}>
        <AppBackButton
          onPress={() => navigation.goBack()}
          size={scale(40)}
        />
        <AppText style={[styles.headerTitle, { color: colors.text.primary }]}>
          Points
        </AppText>
      </View>

      <FlatList
        data={MOCK_TRANSACTIONS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* 2. Top Hero Card Area */}
            <View style={styles.heroCardContainer}>
              <GlassCard
                radius={scale(26)}
                style={[
                  styles.featuredCard,
                  {
                    backgroundColor: isDark ? '#122021' : '#D8F1F8',
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(255, 255, 255, 0.85)',
                    borderWidth: isDark ? 1 : 1.5,
                  },
                ]}
                contentStyle={styles.featuredCardContent}
              >
                {/* Centered 3D Dual Cyan Points Image Graphic */}
                <View style={styles.coinsWrapper}>
                  <PointsOfficialGraphic width={scale(110)} height={verticalScale(80)} />
                </View>

                {/* Total Points Label */}
                <AppText
                  style={[
                    styles.totalPointsLabel,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  TOTAL POINTS
                </AppText>

                {/* Massive Score Row with Mono Font */}
                <View style={styles.scoreRow}>
                  <AppText
                    style={[
                      styles.scoreNumberMono,
                      { color: isDark ? '#FFFFFF' : '#000000' },
                    ]}
                  >
                    12,450
                  </AppText>
                  <AppText
                    style={[
                      styles.scorePtsLabel,
                      { color: isDark ? '#94A3B8' : '#737373' },
                    ]}
                  >
                    pts
                  </AppText>
                </View>

                {/* Converted Currency Pill Badge with Mono Font */}
                <View
                  style={[
                    styles.currencyBadge,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(255, 255, 255, 0.4)',
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(255, 255, 255, 0.6)',
                      borderWidth: 1,
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.currencyBadgeText,
                      { color: isDark ? '#38BDF8' : '#0F4761' },
                    ]}
                  >
                    = 6,225 PKR
                  </AppText>
                </View>
              </GlassCard>
            </View>

            {/* 3. Section Title & Filter Tabs */}
            <View style={styles.sectionHeader}>
              <AppText style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Points Earned
              </AppText>
              <FilterTabs
                tabs={PERIOD_OPTIONS}
                activeTab={selectedFilter}
                onTabChange={setSelectedFilter}
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <PointTransactionCard
            badges={item.badges}
            description={item.description}
            timestamp={item.timestamp}
            points={item.points}
            currencyValue={item.currencyValue}
          />
        )}
      />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
  },
  headerTitle: {
    fontSize: scaleFont(22),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(32),
  },
  heroCardContainer: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(20),
  },
  featuredCard: {
    width: '100%',
  },
  featuredCardContent: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  coinsWrapper: {
    marginBottom: verticalScale(10),
  },
  totalPointsLabel: {
    fontSize: scaleFont(11.5),
    fontFamily: fontFamilies.primaryBold,
    letterSpacing: 1.2,
    marginBottom: verticalScale(4),
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: verticalScale(10),
  },
  scoreNumberMono: {
    fontSize: scaleFont(44),
    fontFamily: fontFamilies.mono,
    fontWeight: '700',
    letterSpacing: -1,
  },
  scorePtsLabel: {
    fontSize: scaleFont(16),
    fontFamily: fontFamilies.mono,
    marginLeft: scale(4),
  },
  currencyBadge: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
    borderRadius: scale(999),
  },
  currencyBadgeText: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.mono,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
});

export default PointsEarnedScreen;
