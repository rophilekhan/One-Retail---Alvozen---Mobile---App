import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Rect } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import {
  AppModal,
  AppText,
  FieldIconBadge,
} from '../core/index.js';
import { TierGemIcon } from '../../assets/vectors/ImpactIcons.jsx';
import { CloseIcon } from '../../assets/vectors/AuthIcons.jsx';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * All Tier Milestones Definition for OneRetail Pharmacy Impact Index (PII)
 */
const TIERS_META = [
  {
    id: 'general_trade',
    name: 'General Trade',
    range: '0 – 249',
    min: 0,
    max: 249,
    nextTier: 'Established',
  },
  {
    id: 'established',
    name: 'Established',
    range: '250 – 499',
    min: 250,
    max: 499,
    nextTier: 'Key Account',
  },
  {
    id: 'key_account',
    name: 'Key Account',
    range: '500 – 749',
    min: 500,
    max: 749,
    nextTier: 'Flagship',
  },
  {
    id: 'flagship',
    name: 'Flagship',
    range: '750+',
    min: 750,
    max: 1000,
    nextTier: 'Pinnacle',
  },
];

/**
 * Dynamic Hero Card Gradients
 */
const TIER_CARD_GRADIENTS = {
  general_trade: {
    light: ['#9AE1D5', '#B8EDE5', '#D2F5F0'],
    dark: ['#172E29', '#12221E', '#0E1A17'],
  },
  emerging: {
    light: ['#9AE1D5', '#B8EDE5', '#D2F5F0'],
    dark: ['#172E29', '#12221E', '#0E1A17'],
  },
  established: {
    light: ['#FDAE78', '#FDC197', '#FED7BD'],
    dark: ['#281C14', '#201610', '#1A120D'],
  },
  key_account: {
    light: ['#9CCAE1', '#BEE0F2', '#D8ECF7'],
    dark: ['#162330', '#111B24', '#0E151C'],
  },
  senior: {
    light: ['#9CCAE1', '#BEE0F2', '#D8ECF7'],
    dark: ['#162330', '#111B24', '#0E151C'],
  },
  flagship: {
    light: ['#D9B3F5', '#EAD2FA', '#F5E6FE'],
    dark: ['#241730', '#1C1225', '#160E1D'],
  },
  distinguished: {
    light: ['#D9B3F5', '#EAD2FA', '#F5E6FE'],
    dark: ['#241730', '#1C1225', '#160E1D'],
  },
};

const TIER_PROGRESS_COLORS = {
  general_trade: '#00C48C',
  emerging: '#00C48C',
  established: '#FF6A00',
  key_account: '#0284C7',
  senior: '#0284C7',
  flagship: '#A855F7',
  distinguished: '#A855F7',
};

const TIER_PROGRESS_GRADIENTS = {
  general_trade: ['#80E3CE', '#00C48C'],
  emerging: ['#80E3CE', '#00C48C'],
  established: ['#FDA15F', '#FB6B03'],
  key_account: ['#7AD3FA', '#0284C7'],
  senior: ['#7AD3FA', '#0284C7'],
  flagship: ['#D49BF6', '#A855F7'],
  distinguished: ['#D49BF6', '#A855F7'],
};

/**
 * ProgressBarsIcon
 */
const ProgressBarsIcon = ({
  width = 18,
  height = 16,
  primaryColor = '#020202',
  accentColor = '#5B5B5B',
}) => (
  <Svg width={width} height={height} viewBox="0 0 18 16" fill="none">
    <Rect x="1" y="4.5" width="4" height="10.5" rx="2" fill={primaryColor} />
    <Rect x="7" y="0.5" width="4" height="14.5" rx="2" fill={accentColor} />
    <Rect x="13" y="7.5" width="4" height="7.5" rx="2" fill={primaryColor} />
  </Svg>
);

/**
 * ImpactScoreModal
 *
 * Bottom sheet status modal breaking down the pharmacy's current
 * PII progression, point deficit to the next tier, and all tier bands.
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {'general_trade' | 'established' | 'key_account' | 'flagship'} [props.tier='established']
 * @param {number} [props.score=482]
 * @param {Function} [props.onSelectTier]
 */
export const ImpactScoreModal = ({
  visible,
  onClose,
  tier = 'established',
  score = 482,
  onSelectTier,
}) => {
  const { colors, isDark } = useTheme();

  const normTier = useMemo(() => {
    const raw = String(tier || 'established').toLowerCase();
    if (raw.includes('flag') || raw.includes('dist')) return 'flagship';
    if (raw.includes('key') || raw.includes('sen')) return 'key_account';
    if (raw.includes('gen') || raw.includes('emer')) return 'general_trade';
    return 'established';
  }, [tier]);

  const currentTierMeta = useMemo(() => {
    return TIERS_META.find((t) => t.id === normTier) || TIERS_META[1];
  }, [normTier]);

  const targetTierScore = currentTierMeta.max + 1;
  const pointsRemaining = Math.max(0, targetTierScore - score);

  const progressFraction = useMemo(() => {
    const span = currentTierMeta.max - currentTierMeta.min;
    if (span <= 0) return 1;
    const currentInTier = score - currentTierMeta.min;
    return Math.min(Math.max(currentInTier / span, 0.05), 1);
  }, [currentTierMeta, score]);

  const heroGrad =
    (TIER_CARD_GRADIENTS[normTier] || TIER_CARD_GRADIENTS.established)[
      isDark ? 'dark' : 'light'
    ];
  const progressGrad =
    (TIER_PROGRESS_GRADIENTS[normTier] || TIER_PROGRESS_GRADIENTS.established);
  const solidProgressColor =
    TIER_PROGRESS_COLORS[normTier] || '#FF6A00';

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      type="bottomSheet"
      style={[
        styles.modalContainer,
        {
          backgroundColor: isDark ? '#141416' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      {/* 1. Header Row */}
      <View style={styles.headerRow}>
        <AppText
          style={[
            styles.title,
            { color: colors.text.primary },
          ]}
        >
          Pharmacy Impact Index (PII)
        </AppText>

        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={[
            styles.closeBtn,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        >
          <CloseIcon size={scale(16)} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        {/* 2. Dynamic Hero Card for Current Tier */}
        <LinearGradient
          colors={heroGrad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.heroCard,
            {
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.65)',
            },
          ]}
        >
          <View style={styles.heroCardTop}>
            <View style={styles.heroLeft}>
              <AppText
                style={[
                  styles.heroTierName,
                  { color: isDark ? '#FFFFFF' : '#020202' },
                ]}
              >
                {`${currentTierMeta.name} Pharmacy`}
              </AppText>
              <AppText
                style={[
                  styles.heroRemainingText,
                  { color: isDark ? '#94A3B8' : '#475569' },
                ]}
              >
                {pointsRemaining > 0
                  ? `${pointsRemaining} pts to unlock ${currentTierMeta.nextTier}`
                  : 'Highest PII Tier Achieved!'}
              </AppText>
            </View>

            <View style={styles.heroRightGem}>
              <TierGemIcon tier={normTier} size={scale(48)} isApex />
            </View>
          </View>

          {/* Progress Bar Container */}
          <View
            style={[
              styles.progressBarTrack,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
          >
            <LinearGradient
              colors={progressGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBarFill,
                { width: `${Math.round(progressFraction * 100)}%` },
              ]}
            />
          </View>
        </LinearGradient>

        {/* 3. Section Title */}
        <View style={styles.sectionTitleRow}>
          <ProgressBarsIcon
            width={scale(18)}
            height={scale(16)}
            primaryColor={isDark ? '#FFFFFF' : '#020202'}
            accentColor={isDark ? '#64748B' : '#94A3B8'}
          />
          <AppText
            style={[
              styles.sectionTitleText,
              { color: colors.text.primary },
            ]}
          >
            All Pharmacy Tiers
          </AppText>
        </View>

        {/* 4. Tier Milestone Cards */}
        <View style={styles.tiersList}>
          {TIERS_META.map((t) => {
            const isCurrent = t.id === normTier;

            return (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.85}
                onPress={() => onSelectTier && onSelectTier(t.id)}
                style={[
                  styles.tierRowCard,
                  {
                    backgroundColor: isDark ? '#1C1C20' : '#F8FAFC',
                    borderColor: isCurrent
                      ? solidProgressColor
                      : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'),
                    borderWidth: isCurrent ? 1.5 : 1,
                  },
                ]}
              >
                <View style={styles.tierRowLeft}>
                  <View style={styles.gemDisc}>
                    <TierGemIcon tier={t.id} size={scale(28)} />
                  </View>
                  <View>
                    <View style={styles.nameRow}>
                      <AppText
                        style={[
                          styles.tierRowName,
                          { color: colors.text.primary },
                        ]}
                      >
                        {t.name}
                      </AppText>
                      {isCurrent && (
                        <View
                          style={[
                            styles.currentBadge,
                            { backgroundColor: solidProgressColor },
                          ]}
                        >
                          <AppText style={styles.currentBadgeText}>
                            CURRENT
                          </AppText>
                        </View>
                      )}
                    </View>
                    <AppText
                      style={[
                        styles.tierRowRange,
                        { color: isDark ? '#94A3B8' : '#64748B' },
                      ]}
                    >
                      {`${t.range} PII points`}
                    </AppText>
                  </View>
                </View>

                {isCurrent && (
                  <View
                    style={[
                      styles.scoreBubble,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.scoreBubbleText,
                        { color: solidProgressColor },
                      ]}
                    >
                      {`${score} pts`}
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(28),
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: scaleFont(18),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  closeBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    maxHeight: verticalScale(500),
  },
  heroCard: {
    borderRadius: scale(22),
    padding: scale(18),
    borderWidth: 1.5,
    marginBottom: verticalScale(20),
  },
  heroCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  heroLeft: {
    flex: 1,
  },
  heroTierName: {
    fontSize: scaleFont(20),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  heroRemainingText: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.primaryMedium,
  },
  heroRightGem: {
    marginLeft: scale(12),
  },
  progressBarTrack: {
    height: verticalScale(8),
    borderRadius: scale(4),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: scale(4),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  sectionTitleText: {
    fontSize: scaleFont(14.5),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    marginLeft: scale(8),
  },
  tiersList: {
    gap: verticalScale(10),
    paddingBottom: verticalScale(12),
  },
  tierRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderRadius: scale(18),
  },
  tierRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gemDisc: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierRowName: {
    fontSize: scaleFont(15),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  currentBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: scale(8),
    marginLeft: scale(8),
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: scaleFont(10),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  tierRowRange: {
    fontSize: scaleFont(12.5),
    fontFamily: fontFamilies.primaryRegular,
    marginTop: verticalScale(2),
  },
  scoreBubble: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
  },
  scoreBubbleText: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.mono || fontFamilies.primaryBold,
    fontWeight: '700',
  },
});

export default ImpactScoreModal;
