import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppModal, AppText, AppBadge, MetricIconDisc } from '../core/index.js';
import { TierGemIcon, CloseIcon } from '../../assets/vectors/index.js';
import {
  PHARMACY_TIER_KEYS,
  PHARMACY_TIERS_CONFIG,
  getPharmacyTierTheme,
  normalizePharmacyTier,
} from '../../theme/tierThemes.js';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TIERS_ROADMAP_KEYS = [
  PHARMACY_TIER_KEYS.GENERAL_TRADE,
  PHARMACY_TIER_KEYS.ESTABLISHED,
  PHARMACY_TIER_KEYS.KEY_ACCOUNT,
  PHARMACY_TIER_KEYS.FLAGSHIP,
];

/**
 * ProgressBarsIcon - Visual Tier Progress Indicator
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
 * Exact OneRx bottom sheet roadmap modal (radii.sheet / 32px, 1.2px glass border,
 * top radial glow) displaying the pharmacy's current PII score and all 4 pharmacy tiers.
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {string} [props.tier='key_account']
 * @param {number} [props.score=842]
 * @param {Function} [props.onSelectTier]
 */
export const ImpactScoreModal = ({
  visible,
  onClose,
  tier = 'key_account',
  score = 842,
  onSelectTier,
}) => {
  const { colors, isDark, radii } = useTheme();

  const currentTheme = useMemo(() => {
    return getPharmacyTierTheme(tier, isDark);
  }, [tier, isDark]);

  const {
    key: normTier,
    label: currentLabel,
    minPoints,
    maxPoints,
    nextTierKey,
    cardTint,
    arcGradient,
    accentColor,
  } = currentTheme;

  const nextTierConfig = nextTierKey ? PHARMACY_TIERS_CONFIG[nextTierKey] : null;
  const targetPoints = maxPoints + 1;
  const pointsRemaining = Math.max(0, targetPoints - score);

  const progressFraction = useMemo(() => {
    const span = maxPoints - minPoints;
    if (span <= 0) return 1;
    const currentInTier = score - minPoints;
    return Math.min(Math.max(currentInTier / span, 0.05), 1);
  }, [maxPoints, minPoints, score]);

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      type="bottomSheet"
      style={[
        styles.modalContainer,
        {
          backgroundColor: isDark ? '#0A0A0E' : '#FFFFFF',
          borderTopLeftRadius: radii?.sheet || scale(32),
          borderTopRightRadius: radii?.sheet || scale(32),
          borderTopWidth: 1.2,
          borderLeftWidth: 1.2,
          borderRightWidth: 1.2,
          borderTopColor: isDark
            ? 'rgba(255, 255, 255, 0.22)'
            : 'rgba(0, 155, 169, 0.35)',
          borderLeftColor: isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.06)',
          borderRightColor: isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      {/* Top Radial Glow */}
      <View style={styles.topGlowContainer} pointerEvents="none">
        <Svg width="100%" height={verticalScale(120)} viewBox="0 0 360 120">
          <Defs>
            <RadialGradient id="scoreModalTopGlow" cx="50%" cy="0%" rx="55%" ry="100%">
              <Stop
                offset="0%"
                stopColor={accentColor}
                stopOpacity={isDark ? 0.38 : 0.25}
              />
              <Stop
                offset="100%"
                stopColor={accentColor}
                stopOpacity={0}
              />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="360" height="120" fill="url(#scoreModalTopGlow)" />
        </Svg>
      </View>

      {/* 1. Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleWrap}>
          <AppText style={[styles.title, { color: colors.text.primary }]}>
            Pharmacy Impact Index (PII)
          </AppText>
          <AppText style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Performance tiers and verified dispensing score
          </AppText>
        </View>

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
          accessibilityRole="button"
          accessibilityLabel="Close PII Tier Roadmap"
        >
          <CloseIcon size={scale(15)} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. Current Tier Dynamic Hero Card */}
        <LinearGradient
          colors={cardTint}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.heroCard,
            {
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.16)'
                : 'rgba(255, 255, 255, 0.75)',
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
                {`${currentLabel} Pharmacy`}
              </AppText>
              <AppText
                style={[
                  styles.heroRemainingText,
                  { color: isDark ? '#94A3B8' : '#475569' },
                ]}
              >
                {pointsRemaining > 0 && nextTierConfig
                  ? `${pointsRemaining} pts to unlock ${nextTierConfig.label}`
                  : 'Pinnacle Tier Achieved! Top 1% in Territory'}
              </AppText>
            </View>

            <View style={styles.heroRightGem}>
              <MetricIconDisc size={52} isDark={isDark} variant={normTier}>
                <TierGemIcon tier={normTier} size={scale(28)} isApex={true} />
              </MetricIconDisc>
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
              colors={arcGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBarFill,
                { width: `${Math.round(progressFraction * 100)}%` },
              ]}
            />
          </View>

          <View style={styles.progressMetaRow}>
            <AppText style={[styles.progressScoreText, { color: accentColor }]}>
              {`${score} / ${maxPoints >= 1500 ? '1500' : maxPoints} pts`}
            </AppText>
            <AppText style={[styles.progressPctText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {`${Math.round(progressFraction * 100)}% completed`}
            </AppText>
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
          <AppText style={[styles.sectionTitleText, { color: colors.text.primary }]}>
            All Pharmacy Tiers
          </AppText>
        </View>

        {/* 4. Tier Milestone Cards */}
        <View style={styles.tiersList}>
          {TIERS_ROADMAP_KEYS.map((k) => {
            const itemTheme = getPharmacyTierTheme(k, isDark);
            const isCurrent = k === normTier;

            return (
              <TouchableOpacity
                key={k}
                activeOpacity={0.85}
                onPress={() => onSelectTier && onSelectTier(k)}
                style={[
                  styles.tierRowCard,
                  {
                    backgroundColor: isDark ? '#141418' : '#F8FAFC',
                    borderColor: isCurrent
                      ? accentColor
                      : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                    borderWidth: isCurrent ? 1.5 : 1,
                  },
                ]}
              >
                <View style={styles.tierRowLeft}>
                  <MetricIconDisc
                    size={42}
                    isDark={isDark}
                    variant={k}
                    style={styles.tierGemDisc}
                  >
                    <TierGemIcon tier={k} size={scale(22)} isApex={true} />
                  </MetricIconDisc>

                  <View style={styles.tierTextCol}>
                    <View style={styles.nameRow}>
                      <AppText
                        style={[
                          styles.tierRowName,
                          { color: colors.text.primary },
                        ]}
                      >
                        {itemTheme.label}
                      </AppText>
                      {isCurrent && (
                        <View
                          style={[
                            styles.currentBadge,
                            { backgroundColor: accentColor },
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
                      {`${itemTheme.minPoints} – ${itemTheme.maxPoints >= 1500 ? '1500+' : itemTheme.maxPoints} pts`}
                    </AppText>
                  </View>
                </View>

                {isCurrent ? (
                  <View
                    style={[
                      styles.scoreBubble,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                        borderColor: accentColor,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.scoreBubbleText,
                        { color: accentColor },
                      ]}
                    >
                      {`${score} pts`}
                    </AppText>
                  </View>
                ) : (
                  <AppText style={{ color: itemTheme.accentColor, fontSize: scaleFont(12), fontFamily: fontFamilies.primaryMedium }}>
                    Preview &gt;
                  </AppText>
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
    overflow: 'hidden',
  },
  topGlowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(120),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    marginTop: verticalScale(4),
  },
  headerTitleWrap: {
    flex: 1,
    paddingRight: scale(12),
  },
  title: {
    fontSize: scaleFont(18),
    fontFamilies: fontFamilies.primaryBold,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: scaleFont(12.5),
    fontFamily: fontFamilies.primaryRegular,
    marginTop: verticalScale(2),
  },
  closeBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: verticalScale(16),
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
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  progressScoreText: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.monoMedium || fontFamilies.primaryBold,
    fontWeight: '600',
  },
  progressPctText: {
    fontSize: scaleFont(11.5),
    fontFamily: fontFamilies.primaryRegular,
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
  },
  tierRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    borderRadius: scale(18),
  },
  tierRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(8),
  },
  tierGemDisc: {
    marginRight: scale(12),
  },
  tierTextCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierRowName: {
    fontSize: scaleFont(14.5),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  currentBadge: {
    paddingHorizontal: scale(7),
    paddingVertical: verticalScale(2),
    borderRadius: scale(6),
    marginLeft: scale(8),
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: scaleFont(9.5),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  tierRowRange: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.monoRegular || fontFamilies.primaryRegular,
    marginTop: verticalScale(3),
  },
  scoreBubble: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(10),
  },
  scoreBubbleText: {
    fontSize: scaleFont(12.5),
    fontFamily: fontFamilies.monoMedium || fontFamilies.primaryBold,
    fontWeight: '700',
  },
});

export default ImpactScoreModal;
